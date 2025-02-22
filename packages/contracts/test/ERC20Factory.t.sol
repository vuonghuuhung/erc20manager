//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ERC20Factory} from "../contracts/ERC20Factory.sol";
import {DeployERC20Factory} from "../scripts/DeployERC20Factory.s.sol";

contract ERC20FactoryTest is Test {
    ERC20Factory erc20Factory;
    address public USER_NUMBER_1 = makeAddr("userNumber1");
    address public USER_NUMBER_2 = makeAddr("userNumber2");
    uint256 public constant STARTING_USER_BALANCE = 10 ether;

    modifier mint() {
        vm.prank(USER_NUMBER_1);
        erc20Factory.mintERC20Manager("Hello", "H", 18, 1e18);
        vm.prank(USER_NUMBER_2);
        erc20Factory.mintERC20Manager("Hello2", "H2", 18, 1e18);
        _;
    }

    function setUp() external {
        DeployERC20Factory deployer = new DeployERC20Factory();
        erc20Factory = deployer.run();
        vm.deal(USER_NUMBER_1, STARTING_USER_BALANCE);
        vm.deal(USER_NUMBER_2, STARTING_USER_BALANCE);
    }

    function testMintERC20Manager() public mint {}

    function testGetListOfERC20() public mint {
        erc20Factory.getListOfERC20(USER_NUMBER_1);
        erc20Factory.getListOfERC20(USER_NUMBER_2);
    }

    function testGetOwnerOfERC20() public mint {
        erc20Factory.getOwnerOfERC20(
            erc20Factory.getListOfERC20(USER_NUMBER_1)[0]
        );
        erc20Factory.getOwnerOfERC20(
            erc20Factory.getListOfERC20(USER_NUMBER_2)[0]
        );
    }
}
