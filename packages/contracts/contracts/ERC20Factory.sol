// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Manager} from "./ERC20Manager.sol";

contract ERC20Factory {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address[] s_erc20;
    mapping(address => address[]) s_addressToListOfERC20;
    mapping(address => address) s_ERC20ToOwner;
    address private immutable i_owner;

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error ERC20Factory__NotOwner(address sender, address owner);

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event ERC20Factory__Create(
        address indexed owner,
        address indexed token,
        uint256 indexed amount
    );

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() {
        i_owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier isOwner() {
        require(
            msg.sender == i_owner,
            ERC20Factory__NotOwner(msg.sender, i_owner)
        );
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function mintERC20Manager(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount
    ) public {
        ERC20Manager erc20 = new ERC20Manager(
            _name,
            _symbol,
            _decimals,
            _amount
        );
        s_erc20.push(address(erc20));
        s_addressToListOfERC20[msg.sender].push(address(erc20));
        s_ERC20ToOwner[address(erc20)] = msg.sender;
        emit ERC20Factory__Create(
            msg.sender,
            address(erc20),
            erc20.totalSupply()
        );
    }

    /*//////////////////////////////////////////////////////////////
                            PUBLIC VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getListOfERC20(
        address user
    ) public view returns (address[] memory) {
        return s_addressToListOfERC20[user];
    }

    function getOwnerOfERC20(address token) public view returns (address) {
        return s_ERC20ToOwner[token];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getListOfERC20ManagerCreated()
        public
        view
        returns (address[] memory)
    {
        return s_erc20;
    }
}
