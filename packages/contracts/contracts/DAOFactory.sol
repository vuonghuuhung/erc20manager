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

import {MultisigDAO} from "./MultisigDAO.sol";
import {ERC20Template} from "./ERC20Template.sol";

contract DAOFactory {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address[] private s_erc20DAO;
    address[] private s_listOfDAO;
    mapping(address => address) s_daoAddressToERC20;
    mapping(address => address) s_ERC20toDAO;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Create(
        address indexed daoAddress,
        address indexed token,
        uint256 indexed amount
    );

    /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function createDAO(
        address[] memory _owners,
        uint256 _required,
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount,
        string memory _metadata
    ) public {
        MultisigDAO multiSigDAO = new MultisigDAO(
            _owners,
            _required,
            _name,
            _symbol,
            _decimals,
            _amount,
            _metadata
        );
        address token = address(multiSigDAO.erc20Template());
        address daoAddress = address(multiSigDAO);
        s_listOfDAO.push(daoAddress);
        s_erc20DAO.push(token);
        s_ERC20toDAO[token] = daoAddress;
        s_daoAddressToERC20[daoAddress] = token;
        emit Create(daoAddress, token, ERC20Template(token).totalSupply());
    }

    /*//////////////////////////////////////////////////////////////
                            PUBLIC VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getDAOAddressOfERC20DAO(
        address token
    ) public view returns (address) {
        return s_ERC20toDAO[token];
    }

    function getListOfDAO() public view returns (address[] memory) {
        return s_listOfDAO;
    }

    function getListOfERC20DAOCreated() public view returns (address[] memory) {
        return s_erc20DAO;
    }

    function getERC20MetadataOfDAO(
        address dao
    )
        public
        view
        returns (address, string memory, string memory, uint8, uint256)
    {
        ERC20Template erc20DAO = ERC20Template(s_daoAddressToERC20[dao]);
        string memory tokenName = erc20DAO.name();
        string memory symbol = erc20DAO.symbol();
        uint8 decimals = erc20DAO.decimals();
        uint256 totalSupply = erc20DAO.totalSupply();
        return (address(erc20DAO), tokenName, symbol, decimals, totalSupply);
    }
}
