// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SkillMaxBadge
/// @notice Soulbound ERC-1155 badges for verified skill completion on SkillMax
/// @dev Token IDs 0-9 map to skill categories. Non-transferable (soulbound).
contract SkillMaxBadge is ERC1155, Ownable {
    uint256 public constant MAX_CATEGORIES = 10;

    // category → provider → count
    mapping(address => mapping(uint256 => uint256)) public badgeCount;

    event BadgeMinted(address indexed recipient, uint256 indexed categoryId);

    error InvalidCategory();
    error SoulboundToken();

    constructor(address platformWallet, string memory uri_)
        ERC1155(uri_)
        Ownable(platformWallet)
    {}

    /// @notice Mint a badge to a provider. Only callable by owner (platform wallet).
    function mintBadge(address recipient, uint256 categoryId) external onlyOwner {
        if (categoryId >= MAX_CATEGORIES) revert InvalidCategory();

        badgeCount[recipient][categoryId]++;
        _mint(recipient, categoryId, 1, "");

        emit BadgeMinted(recipient, categoryId);
    }

    /// @notice Get all badge counts for a provider across all categories
    function getBadges(address provider) external view returns (uint256[10] memory counts) {
        for (uint256 i = 0; i < MAX_CATEGORIES; i++) {
            counts[i] = badgeCount[provider][i];
        }
    }

    // ─── Soulbound: Block all transfers ───────────────────────────────────────
    function safeTransferFrom(
        address, address, uint256, uint256, bytes memory
    ) public pure override {
        revert SoulboundToken();
    }

    function safeBatchTransferFrom(
        address, address, uint256[] memory, uint256[] memory, bytes memory
    ) public pure override {
        revert SoulboundToken();
    }
}
