// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SkillMaxEscrow} from "../src/SkillMaxEscrow.sol";

contract SkillMaxEscrowTest is Test {
    SkillMaxEscrow escrow;
    address arbiter = makeAddr("arbiter");
    address client  = makeAddr("client");
    address provider = makeAddr("provider");

    function setUp() public {
        escrow = new SkillMaxEscrow(arbiter);
        vm.deal(client, 10 ether);
    }

    function test_CreateJob() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);
        assertEq(jobId, 1);
        (address p, address c, uint256 amount,,) = escrow.getJob(1);
        assertEq(p, provider);
        assertEq(c, client);
        assertEq(amount, 1 ether);
    }

    function test_CreateJob_RevertsOnZero() public {
        vm.prank(client);
        vm.expectRevert(SkillMaxEscrow.ZeroAmount.selector);
        escrow.createJob{value: 0}(provider);
    }

    function test_MarkComplete() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);

        uint256 balBefore = provider.balance;
        vm.prank(client);
        escrow.markComplete(jobId);

        assertEq(provider.balance, balBefore + 1 ether);
        (,,, uint8 status,) = escrow.getJob(jobId);
        assertEq(status, 1); // Completed

        (uint64 completed,,,) = escrow.getReputation(provider);
        assertEq(completed, 1);
    }

    function test_MarkComplete_RevertsIfNotClient() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);

        vm.prank(provider);
        vm.expectRevert(SkillMaxEscrow.NotAuthorized.selector);
        escrow.markComplete(jobId);
    }

    function test_RaiseDispute() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);

        vm.prank(client);
        escrow.raiseDispute(jobId);

        (,,, uint8 status,) = escrow.getJob(jobId);
        assertEq(status, 2); // Disputed

        (, uint64 disputed,,) = escrow.getReputation(provider);
        assertEq(disputed, 1);
    }

    function test_ResolveDispute_ToClient() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);

        vm.prank(client);
        escrow.raiseDispute(jobId);

        uint256 clientBalBefore = client.balance;
        vm.prank(arbiter);
        escrow.resolveDispute(jobId, client);

        assertEq(client.balance, clientBalBefore + 1 ether);
    }

    function test_RateProvider() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);

        vm.prank(client);
        escrow.markComplete(jobId);

        vm.prank(client);
        escrow.rateProvider(jobId, 5);

        (,, uint64 ratingCount, uint256 avgRating100) = escrow.getReputation(provider);
        assertEq(ratingCount, 1);
        assertEq(avgRating100, 500);
    }

    function test_RateProvider_RevertsOnDoubleRate() public {
        vm.prank(client);
        uint256 jobId = escrow.createJob{value: 1 ether}(provider);
        vm.prank(client);
        escrow.markComplete(jobId);
        vm.prank(client);
        escrow.rateProvider(jobId, 5);

        vm.prank(client);
        vm.expectRevert(SkillMaxEscrow.AlreadyRated.selector);
        escrow.rateProvider(jobId, 3);
    }
}
