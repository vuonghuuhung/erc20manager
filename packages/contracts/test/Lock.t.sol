// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/Lock.sol";

contract LockTest is Test {
    Lock public lock;
    uint public unlockTime;
    uint public constant deposit = 1 ether;

    // We declare the event here so we can use it with vm.expectEmit.
    event Withdrawal(uint amount, uint when);

    // setUp runs before each test.
    function setUp() public {
        // Set an unlock time 1 day in the future.
        unlockTime = block.timestamp + 1 days;
        // Deploy the contract with 1 ether. The owner will be the test contract.
        lock = new Lock{value: deposit}(unlockTime);
    }

    // Ensure the contract has the correct initial balance.
    function testInitialBalance() public view {
        assertEq(address(lock).balance, deposit);
    }

    // Test that deploying with an unlock time in the past reverts.
    function testCannotDeployWithPastUnlockTime() public {
        uint pastTime = block.timestamp - 1;
        vm.expectRevert("Unlock time should be in the future");
        new Lock{value: deposit}(pastTime);
    }

    // Test that withdraw cannot be called before the unlock time.
    function testCannotWithdrawBeforeUnlockTime() public {
        vm.expectRevert("You can't withdraw yet");
        lock.withdraw();
    }

    // Test that a non-owner cannot withdraw funds.
    function testOnlyOwnerCanWithdraw() public {
        // Fast-forward time to after the unlock time.
        vm.warp(unlockTime + 1);
        address nonOwner = address(0xBEEF);
        vm.prank(nonOwner);
        vm.expectRevert("You aren't the owner");
        lock.withdraw();
    }

    // Test a successful withdrawal.
    // function testSuccessfulWithdrawal() public {
    //     // Warp forward to a time after unlockTime.
    //     vm.warp(unlockTime + 1);
    //     uint initialBalance = address(this).balance;

    //     // Withdraw the funds; since the owner is the test contract, it will receive the deposit.
    //     lock.withdraw();

    //     // The contract's balance should be zero.
    //     assertEq(address(lock).balance, 0);
    //     // The test contract's balance should increase by the deposit amount.
    //     assertEq(address(this).balance, initialBalance + deposit);
    // }

    // Test that the Withdrawal event is emitted correctly.
    // function testWithdrawalEmitsEvent() public {
    //     vm.warp(unlockTime + 1);
    //     // Capture the expected timestamp after warp.
    //     uint expectedTimestamp = block.timestamp;
    //     // Expect the Withdrawal event with the deposit amount and expected timestamp.
    //     vm.expectEmit(true, false, false, true);
    //     emit Withdrawal(deposit, expectedTimestamp);
    //     lock.withdraw();
    // }
}
