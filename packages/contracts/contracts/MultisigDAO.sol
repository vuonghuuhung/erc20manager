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
    }

    address[] public s_owners;
    mapping(address => bool) public s_isOwner;
    uint256 public s_required;
    ERC20Template public erc20Template;
    string public s_metadata;

    Proposal[] public s_proposals;
    mapping(uint256 => mapping(address => bool)) public s_isApproved;

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
     * @notice Submits a new proposal.
     * @param _to The target address (recipient for Distribute, spender for Approve). Ignored for Burn/UpdateMetadata.
     * @param _value The amount (for Distribute, Burn, Approve). Ignored for UpdateMetadata.
     * @param _action The type of action (Distribute, Burn, Approve, UpdateMetadata).
     * @param _data Additional data. For UpdateMetadata: abi.encode(newMetadataString). Should be empty otherwise.
     */
    function submitProposal(
        address _to,
        uint256 _value,
        Action _action,
        bytes calldata _data
    ) external onlyOwner {
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
            require(
                _data.length == 0,
                "MultisigDAO: Data should be empty for Distribute"
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
            require(
                _data.length == 0,
                "MultisigDAO: Data should be empty for Burn"
            );
        } else if (_action == Action.Approve) {
            require(
                _to != address(0),
                "MultisigDAO: Invalid spender for Approve"
            );
            // Allow approving zero amount to revoke approval
            require(
                _data.length == 0,
                "MultisigDAO: Data should be empty for Approve"
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
                isExecuted: false
            })
        );
        emit Submit(s_proposals.length - 1);
    }

    function approveProposal(
        uint256 _proposalId
    )
        external
        onlyOwner
        proposalExists(_proposalId)
        notApproved(_proposalId)
        notExecuted(_proposalId)
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
    ) external onlyOwner proposalExists(_proposalId) notExecuted(_proposalId) {
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
}
