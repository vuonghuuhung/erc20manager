//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20Template} from "./ERC20Template.sol";

contract MultisigDAO {
    error MultisigDAO_NeedOwners();
    error MultisigDAO_InvalidRequired(uint256 required, uint256 numberOfOwners);
    error MultisigDAO_InvalidOwner();
    error MultisigDAO_AlreadyOwner(address owner);
    error MultisigDAO_ProposalNotExist();
    error MultisigDAO_AlreadyApproved(uint256 proposalId);
    error MultisigDAO_AlreadyExecutedd(uint256 proposalId);
    error MultisigDAO_NotEnoughApprovals(
        uint256 proposalId,
        uint256 required,
        uint256 approvals
    );
    error MultisigDAO_NotAuthorized();
    error MultisigDAO_InvalidActionData();

    event Submit(uint256 indexed proposalId);
    event Approve(address indexed owner, uint256 indexed proposalId);
    event Revoke(address indexed owner, uint256 indexed proposalId);
    event Execute(uint256 indexed proposalId);
    event MetadataUpdated(string oldMetadata, string newMetadata);

    enum ProposalStatus {
        OnVoting, // Proposal exists but doesn't have enough approvals yet
        Passed, // Proposal has enough approvals to be executed
        Executed, // Proposal has been executed
        Rejected // Proposal has been explicitly rejected (Not implemented yet)
    }

    enum Action {
        Distribute,
        Burn,
        Approve,
        UpdateMetadata
    }

    struct Proposal {
        address to;
        uint256 value;
        Action action;
        bytes data;
        bool isExecuted;
        string metadataURI;
        bool isRejected;
    }

    address[] public s_owners;
    mapping(address => bool) public s_isOwner;
    uint256 public s_required;
    ERC20Template public erc20Template;
    string public s_metadata;

    Proposal[] public s_proposals;
    mapping(uint256 => mapping(address => bool)) public s_isApproved;
    mapping(uint256 => mapping(address => bool)) public s_isRejected;
    mapping(uint256 => uint256) public s_rejectionCount;

    modifier onlyOwner() {
        require(s_isOwner[msg.sender], MultisigDAO_InvalidOwner());
        _;
    }

    modifier proposalExists(uint256 _proposalId) {
        require(
            _proposalId < s_proposals.length,
            MultisigDAO_ProposalNotExist()
        );
        _;
    }
    modifier notApproved(uint256 _proposalId) {
        require(
            !s_isApproved[_proposalId][msg.sender],
            MultisigDAO_AlreadyApproved(_proposalId)
        );
        _;
    }

    modifier notExecuted(uint256 _proposalId) {
        require(
            !s_proposals[_proposalId].isExecuted,
            MultisigDAO_AlreadyExecutedd(_proposalId)
        );
        _;
    }

    modifier notRejected(uint256 _proposalId) {
        require(
            !s_proposals[_proposalId].isRejected,
            "MultisigDAO: Proposal has been rejected"
        );
        _;
    }

    constructor(
        address[] memory _owners,
        uint256 _required,
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount,
        string memory _metadata
    ) {
        require(_owners.length > 0, MultisigDAO_NeedOwners());
        require(
            _required > 0 && _required <= _owners.length,
            MultisigDAO_InvalidRequired(_required, _owners.length)
        );
        uint256 length = _owners.length;
        for (uint256 i = 0; i < length; i++) {
            address owner = _owners[i];
            require(owner != address(0), MultisigDAO_InvalidOwner());
            require(!s_isOwner[owner], MultisigDAO_AlreadyOwner(owner));
            s_isOwner[owner] = true;
            s_owners.push(owner);
        }
        erc20Template = new ERC20Template(
            _name,
            _symbol,
            _amount,
            address(this)
        );
        s_required = _required;
        s_metadata = _metadata;
    }

    /**
     * @notice Internal function to submit a new proposal
     */
    function _submitProposal(
        address _to,
        uint256 _value,
        Action _action,
        bytes calldata _data,
        string memory _metadataURI
    ) internal {
        // Validate parameters based on action
        if (_action == Action.UpdateMetadata) {
            require(
                _data.length > 0,
                "MultisigDAO: Data required for UpdateMetadata"
            );
            require(
                _to == address(0),
                "MultisigDAO: 'to' should be zero address for UpdateMetadata"
            );
            require(
                _value == 0,
                "MultisigDAO: 'value' should be zero for UpdateMetadata"
            );
        } else if (_action == Action.Distribute) {
            require(
                _to != address(0),
                "MultisigDAO: Invalid recipient for Distribute"
            );
            require(
                _value > 0,
                "MultisigDAO: Value must be greater than zero for Distribute"
            );
        } else if (_action == Action.Burn) {
            require(
                _value > 0,
                "MultisigDAO: Value must be greater than zero for Burn"
            );
            require(
                _to == address(0),
                "MultisigDAO: 'to' should be zero address for Burn"
            );
        } else if (_action == Action.Approve) {
            require(
                _to != address(0),
                "MultisigDAO: Invalid spender for Approve"
            );
        } else {
            revert("MultisigDAO: Invalid action type");
        }

        s_proposals.push(
            Proposal({
                to: _to,
                value: _value,
                action: _action,
                data: _data,
                isExecuted: false,
                metadataURI: _metadataURI,
                isRejected: false
            })
        );
        emit Submit(s_proposals.length - 1);
    }

    /**
     * @notice Submits a new proposal.
     * @param _to The target address (recipient for Distribute, spender for Approve). Ignored for Burn/UpdateMetadata.
     * @param _value The amount (for Distribute, Burn, Approve). Ignored for UpdateMetadata.
     * @param _action The type of action (Distribute, Burn, Approve, UpdateMetadata).
     * @param _data Additional data based on action type:
     *        - For UpdateMetadata: abi.encode(newMetadataString)
     *        - For other actions: empty bytes
     * @param _metadataURI IPFS URI pointing to proposal metadata (title, description, etc.)
     */
    function submitProposal(
        address _to,
        uint256 _value,
        Action _action,
        bytes calldata _data,
        string memory _metadataURI
    ) external onlyOwner {
        _submitProposal(_to, _value, _action, _data, _metadataURI);
    }

    function approveProposal(
        uint256 _proposalId
    )
        external
        onlyOwner
        proposalExists(_proposalId)
        notApproved(_proposalId)
        notExecuted(_proposalId)
        notRejected(_proposalId)
    {
        s_isApproved[_proposalId][msg.sender] = true;
        emit Approve(msg.sender, _proposalId);
    }

    function _getApprovalCount(
        uint256 _proposalId
    ) private view returns (uint256 count) {
        uint256 length = s_owners.length;
        for (uint256 i = 0; i < length; i++) {
            if (s_isApproved[_proposalId][s_owners[i]]) {
                count++;
            }
        }
    }

    function executeProposal(
        uint256 _proposalId
    )
        external
        onlyOwner
        proposalExists(_proposalId)
        notExecuted(_proposalId)
        notRejected(_proposalId)
    {
        uint256 approvalCount = _getApprovalCount(_proposalId);
        require(
            approvalCount >= s_required,
            MultisigDAO_NotEnoughApprovals(
                _proposalId,
                s_required,
                approvalCount
            )
        );
        Proposal storage proposal = s_proposals[_proposalId];
        proposal.isExecuted = true;

        if (proposal.action == Action.Distribute) {
            require(
                proposal.to != address(0),
                "Invalid recipient for distribute"
            );
            erc20Template.transfer(proposal.to, proposal.value);
        } else if (proposal.action == Action.Burn) {
            erc20Template.burn(address(this), proposal.value);
        } else if (proposal.action == Action.Approve) {
            require(proposal.to != address(0), "Invalid spender for approve");
            erc20Template.approve(proposal.to, proposal.value);
        } else if (proposal.action == Action.UpdateMetadata) {
            // Extract the metadata from the data
            string memory newMetadata = abi.decode(proposal.data, (string));

            string memory oldMetadata = s_metadata;
            s_metadata = newMetadata;
            emit MetadataUpdated(oldMetadata, newMetadata);
        }

        emit Execute(_proposalId);
    }

    function getMetadata() external view returns (string memory) {
        return s_metadata;
    }

    /**
     * @notice Returns all proposals in the DAO
     * @return An array of all proposals
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory proposals = new Proposal[](s_proposals.length);
        for (uint256 i = 0; i < s_proposals.length; i++) {
            proposals[i] = s_proposals[i];
        }
        return proposals;
    }

    /**
     * @notice Returns filtered proposals by execution status
     * @param _isExecuted Filter for executed (true) or pending (false) proposals
     * @return An array of filtered proposals
     */
    function getProposalsByStatus(
        bool _isExecuted
    ) external view returns (Proposal[] memory) {
        // First, count how many proposals match the filter
        uint256 count = 0;
        for (uint256 i = 0; i < s_proposals.length; i++) {
            if (s_proposals[i].isExecuted == _isExecuted) {
                count++;
            }
        }

        // Create an array of the right size
        Proposal[] memory filteredProposals = new Proposal[](count);

        // Fill the array with matching proposals
        uint256 index = 0;
        for (uint256 i = 0; i < s_proposals.length; i++) {
            if (s_proposals[i].isExecuted == _isExecuted) {
                filteredProposals[index] = s_proposals[i];
                index++;
            }
        }

        return filteredProposals;
    }

    /**
     * @notice Returns detailed information about a specific proposal including approval count
     * @param _proposalId The ID of the proposal to get details for
     * @return proposal The proposal struct
     * @return approvalCount The number of approvals the proposal has received
     * @return isApprovedByCurrentSender Whether the current message sender has approved this proposal
     * @return status The current status of the proposal
     * @return rejectionCount The number of rejections the proposal has received
     * @return isRejectedByCurrentSender Whether the current message sender has rejected this proposal
     */
    function getProposalDetails(
        uint256 _proposalId
    )
        external
        view
        proposalExists(_proposalId)
        returns (
            Proposal memory proposal,
            uint256 approvalCount,
            bool isApprovedByCurrentSender,
            ProposalStatus status,
            uint256 rejectionCount,
            bool isRejectedByCurrentSender
        )
    {
        proposal = s_proposals[_proposalId];
        approvalCount = _getApprovalCount(_proposalId);
        isApprovedByCurrentSender = s_isApproved[_proposalId][msg.sender];
        rejectionCount = s_rejectionCount[_proposalId];
        isRejectedByCurrentSender = s_isRejected[_proposalId][msg.sender];

        // Determine the status
        if (proposal.isExecuted) {
            status = ProposalStatus.Executed;
        } else if (proposal.isRejected) {
            status = ProposalStatus.Rejected;
        } else if (approvalCount >= s_required) {
            status = ProposalStatus.Passed;
        } else {
            status = ProposalStatus.OnVoting;
        }
    }

    /**
     * @notice Returns all owner addresses for this DAO
     * @return An array of all owner addresses
     */
    function getOwners() external view returns (address[] memory) {
        return s_owners;
    }

    /**
     * @notice Gets the current status of a proposal
     * @param _proposalId The ID of the proposal to check status
     * @return status The current status of the proposal
     */
    function getProposalStatus(
        uint256 _proposalId
    ) external view proposalExists(_proposalId) returns (ProposalStatus) {
        Proposal storage proposal = s_proposals[_proposalId];

        // If already executed, return Executed status
        if (proposal.isExecuted) {
            return ProposalStatus.Executed;
        }

        // If rejected, return Rejected status
        if (proposal.isRejected) {
            return ProposalStatus.Rejected;
        }

        // Check if proposal has enough approvals to execute
        uint256 approvalCount = _getApprovalCount(_proposalId);
        if (approvalCount >= s_required) {
            return ProposalStatus.Passed;
        }

        // Otherwise proposal is still on voting
        return ProposalStatus.OnVoting;
    }

    /**
     * @notice Rejects a proposal
     * @param _proposalId The ID of the proposal to reject
     */
    function rejectProposal(
        uint256 _proposalId
    ) external onlyOwner proposalExists(_proposalId) notExecuted(_proposalId) {
        require(
            !s_isRejected[_proposalId][msg.sender],
            "MultisigDAO: Already rejected this proposal"
        );

        s_isRejected[_proposalId][msg.sender] = true;
        s_rejectionCount[_proposalId] += 1;

        // If majority of owners have rejected, mark the proposal as rejected
        uint256 rejectionThreshold = (s_owners.length / 2) + 1;
        if (s_rejectionCount[_proposalId] >= rejectionThreshold) {
            s_proposals[_proposalId].isRejected = true;
        }

        emit Revoke(msg.sender, _proposalId);
    }

    /**
     * @notice Returns rejection count and status for a specific proposal
     * @param _proposalId The ID of the proposal to get rejection details
     * @return rejectionCount The number of rejections the proposal has received
     * @return isRejected Whether the proposal has been rejected
     * @return isRejectedByCurrentSender Whether the current message sender has rejected this proposal
     */
    function getProposalRejectionDetails(
        uint256 _proposalId
    )
        external
        view
        proposalExists(_proposalId)
        returns (
            uint256 rejectionCount,
            bool isRejected,
            bool isRejectedByCurrentSender
        )
    {
        rejectionCount = s_rejectionCount[_proposalId];
        isRejected = s_proposals[_proposalId].isRejected;
        isRejectedByCurrentSender = s_isRejected[_proposalId][msg.sender];
    }

    /**
     * @notice Returns statuses for all proposals
     * @return statuses Array of statuses for all proposals
     * @return proposalIds Array of proposal IDs
     */
    function getAllProposalStatuses()
        external
        view
        returns (ProposalStatus[] memory statuses, uint256[] memory proposalIds)
    {
        uint256 proposalCount = s_proposals.length;
        statuses = new ProposalStatus[](proposalCount);
        proposalIds = new uint256[](proposalCount);

        for (uint256 i = 0; i < proposalCount; i++) {
            Proposal storage proposal = s_proposals[i];
            proposalIds[i] = i;

            // Determine the status
            if (proposal.isExecuted) {
                statuses[i] = ProposalStatus.Executed;
            } else if (proposal.isRejected) {
                statuses[i] = ProposalStatus.Rejected;
            } else {
                uint256 approvalCount = _getApprovalCount(i);
                if (approvalCount >= s_required) {
                    statuses[i] = ProposalStatus.Passed;
                } else {
                    statuses[i] = ProposalStatus.OnVoting;
                }
            }
        }
    }

    /**
     * @notice Returns all proposals filtered by status
     * @param _status The status to filter by
     * @return filteredProposals Array of proposals with the specified status
     * @return proposalIds Array of corresponding proposal IDs
     */
    function getProposalsByProposalStatus(
        ProposalStatus _status
    )
        external
        view
        returns (
            Proposal[] memory filteredProposals,
            uint256[] memory proposalIds
        )
    {
        uint256 proposalCount = s_proposals.length;

        // First, count proposals with the specified status
        uint256 matchCount = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            ProposalStatus status;
            Proposal storage proposal = s_proposals[i];

            if (proposal.isExecuted) {
                status = ProposalStatus.Executed;
            } else if (proposal.isRejected) {
                status = ProposalStatus.Rejected;
            } else {
                uint256 approvalCount = _getApprovalCount(i);
                if (approvalCount >= s_required) {
                    status = ProposalStatus.Passed;
                } else {
                    status = ProposalStatus.OnVoting;
                }
            }

            if (status == _status) {
                matchCount++;
            }
        }

        // Allocate arrays of the right size
        filteredProposals = new Proposal[](matchCount);
        proposalIds = new uint256[](matchCount);

        // Fill arrays with matching proposals
        uint256 index = 0;
        for (uint256 i = 0; i < proposalCount; i++) {
            ProposalStatus status;
            Proposal storage proposal = s_proposals[i];

            if (proposal.isExecuted) {
                status = ProposalStatus.Executed;
            } else if (proposal.isRejected) {
                status = ProposalStatus.Rejected;
            } else {
                uint256 approvalCount = _getApprovalCount(i);
                if (approvalCount >= s_required) {
                    status = ProposalStatus.Passed;
                } else {
                    status = ProposalStatus.OnVoting;
                }
            }

            if (status == _status) {
                filteredProposals[index] = proposal;
                proposalIds[index] = i;
                index++;
            }
        }
    }
}
