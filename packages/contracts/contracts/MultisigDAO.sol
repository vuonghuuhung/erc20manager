//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20Manager} from "./ERC20Manager.sol";

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

    event Submit(uint256 indexed proposalId);
    event Approve(address indexed owner, uint256 indexed proposalId);
    event Revoke(address indexed owner, uint256 indexed proposalId);
    event Execute(uint256 indexed proposalId);

    enum Action {
        Mint,
        Burn
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
    ERC20Manager public erc20Manager;

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
        uint256 _amount
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
        erc20Manager = new ERC20Manager(
            _name,
            _symbol,
            _decimals,
            _amount,
            address(this)
        );
        s_required = _required;
    }

    function submitProposal(
        address _to,
        uint256 _value,
        Action _action,
        bytes calldata _data
    ) external onlyOwner {
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
        if (proposal.action == Action.Mint) {
            erc20Manager.transfer(proposal.to, proposal.value);
            emit Execute(_proposalId);
        }
        if (proposal.action == Action.Burn) {
            erc20Manager.burn(address(this), proposal.value);
            emit Execute(_proposalId);
        }
    }
}
