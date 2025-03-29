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

import {ERC20Template} from "./ERC20Template.sol";

contract ERC20Factory {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address[] private s_erc20;
    mapping(address => address[]) s_addressToListOfERC20;
    mapping(address => address) s_ERC20ToOwner;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Create(
        address indexed owner,
        address indexed token,
        uint256 indexed amount
    );

    /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function mintERC20(
        string memory _name,
        string memory _symbol,
        uint256 _amount
    ) public {
        ERC20Template erc20 = new ERC20Template(
            _name,
            _symbol,
            _amount,
            msg.sender
        );
        s_erc20.push(address(erc20));
        s_addressToListOfERC20[msg.sender].push(address(erc20));
        s_ERC20ToOwner[address(erc20)] = msg.sender;
        emit Create(msg.sender, address(erc20), erc20.totalSupply());
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

    function getListOfERC20Created() public view returns (address[] memory) {
        return s_erc20;
    }
}
