// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20} from "@solmate/tokens/ERC20.sol";

contract ERC20Manager is ERC20 {
    address private immutable i_owner;

    error ERC20Manager__NotOwner(address sender, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount,
        address _owner
    ) ERC20(_name, _symbol, _decimals) {
        i_owner = _owner;
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

    function getOwner() external view returns (address) {
        return i_owner;
    }
}