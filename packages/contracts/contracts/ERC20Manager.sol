// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20} from "solmate/tokens/ERC20.sol";

contract ERC20Manager is ERC20 {
    address immutable i_owner;

    error ERC20Manager__NotOwner(address sender, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount
    ) ERC20(_name, _symbol, _decimals) {
        i_owner = msg.sender;
        _mint(i_owner, _amount);
    }

    modifier isOwner() {
        require(
            msg.sender == i_owner,
            ERC20Manager__NotOwner(msg.sender, i_owner)
        );
        _;
    }

    function burn(address from, uint256 amount) external isOwner {
        _burn(from, amount);
    }
}
