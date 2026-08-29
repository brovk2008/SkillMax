// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {SkillMaxEscrow} from "../src/SkillMaxEscrow.sol";
import {SkillMaxBadge} from "../src/SkillMaxBadge.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address arbiter = vm.envAddress("ARBITER_ADDRESS");
        address platformWallet = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        SkillMaxEscrow escrow = new SkillMaxEscrow(arbiter);
        SkillMaxBadge badge = new SkillMaxBadge(
            platformWallet,
            "https://skillmax.vercel.app/api/badge/metadata/{id}"
        );

        vm.stopBroadcast();

        // Print for .env
        // solhint-disable-next-line no-console
        console2.log("NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=", address(escrow));
        console2.log("NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=", address(badge));
    }
}
