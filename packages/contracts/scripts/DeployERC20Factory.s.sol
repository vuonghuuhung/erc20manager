//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "../lib/forge-std/src/Script.sol";
import {ERC20Factory} from "../contracts/ERC20Factory.sol";

contract DeployERC20Factory is Script {
    function run() external returns (ERC20Factory) {
        vm.startBroadcast();
        ERC20Factory erc20Factory = new ERC20Factory();
        vm.stopBroadcast();
        return erc20Factory;
    }
}
