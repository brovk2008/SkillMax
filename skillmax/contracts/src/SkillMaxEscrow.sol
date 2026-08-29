// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SkillMaxEscrow
/// @notice Escrow + on-chain reputation for SkillMax freelance marketplace
/// @dev Deployed on Monad Testnet (chainId 10143)
contract SkillMaxEscrow {
    // ─── Types ────────────────────────────────────────────────────────────────
    enum Status { Active, Completed, Disputed, Resolved }

    struct Job {
        address provider;
        address client;
        uint256 amount;
        Status  status;
        bool    rated;
    }

    struct Reputation {
        uint64  completedJobs;
        uint64  disputedJobs;
        uint64  ratingCount;
        uint256 totalRating100; // rating * 100 for precision
    }

    // ─── State ────────────────────────────────────────────────────────────────
    address public immutable arbiter;
    uint256 public jobCounter;

    mapping(uint256 => Job)        public jobs;
    mapping(address => Reputation) public reputations;

    // ─── Events ───────────────────────────────────────────────────────────────
    event JobCreated(uint256 indexed jobId, address indexed provider, address indexed client, uint256 amount);
    event JobCompleted(uint256 indexed jobId, uint256 amountReleased);
    event DisputeRaised(uint256 indexed jobId, address raisedBy);
    event DisputeResolved(uint256 indexed jobId, address winner);
    event ProviderRated(uint256 indexed jobId, address provider, uint8 rating);

    // ─── Errors ───────────────────────────────────────────────────────────────
    error NotAuthorized();
    error JobNotFound();
    error ZeroAmount();
    error WrongStatus();
    error AlreadyRated();
    error InvalidRating();
    error TransferFailed();

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _arbiter) {
        arbiter = _arbiter;
    }

    // ─── Client: Create Job ───────────────────────────────────────────────────
    /// @notice Create a new escrow job. Funds are locked until completion.
    /// @param provider Address of the skill provider
    function createJob(address provider) external payable returns (uint256 jobId) {
        if (msg.value == 0) revert ZeroAmount();

        jobId = ++jobCounter;
        jobs[jobId] = Job({
            provider: provider,
            client: msg.sender,
            amount: msg.value,
            status: Status.Active,
            rated: false
        });

        emit JobCreated(jobId, provider, msg.sender, msg.value);
    }

    // ─── Client: Mark Complete ────────────────────────────────────────────────
    /// @notice Client releases funds to provider, marking job done.
    function markComplete(uint256 jobId) external {
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.client != msg.sender) revert NotAuthorized();
        if (job.status != Status.Active) revert WrongStatus();

        job.status = Status.Completed;
        reputations[job.provider].completedJobs++;

        uint256 amount = job.amount;
        job.amount = 0;

        (bool ok,) = job.provider.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit JobCompleted(jobId, amount);
    }

    // ─── Raise Dispute ────────────────────────────────────────────────────────
    function raiseDispute(uint256 jobId) external {
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.client != msg.sender && job.provider != msg.sender) revert NotAuthorized();
        if (job.status != Status.Active) revert WrongStatus();

        job.status = Status.Disputed;
        reputations[job.provider].disputedJobs++;

        emit DisputeRaised(jobId, msg.sender);
    }

    // ─── Arbiter: Resolve Dispute ─────────────────────────────────────────────
    function resolveDispute(uint256 jobId, address winner) external {
        if (msg.sender != arbiter) revert NotAuthorized();
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.status != Status.Disputed) revert WrongStatus();

        require(winner == job.client || winner == job.provider, "Invalid winner");

        job.status = Status.Resolved;
        uint256 amount = job.amount;
        job.amount = 0;

        (bool ok,) = winner.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit DisputeResolved(jobId, winner);
    }

    // ─── Client: Rate Provider ────────────────────────────────────────────────
    function rateProvider(uint256 jobId, uint8 rating) external {
        if (rating < 1 || rating > 5) revert InvalidRating();
        Job storage job = jobs[jobId];
        if (job.client != msg.sender) revert NotAuthorized();
        if (job.status != Status.Completed) revert WrongStatus();
        if (job.rated) revert AlreadyRated();

        job.rated = true;
        Reputation storage rep = reputations[job.provider];
        rep.ratingCount++;
        rep.totalRating100 += uint256(rating) * 100;

        emit ProviderRated(jobId, job.provider, rating);
    }

    // ─── Views ────────────────────────────────────────────────────────────────
    function getJob(uint256 jobId) external view returns (
        address provider,
        address client,
        uint256 amount,
        uint8 status,
        bool rated
    ) {
        Job storage job = jobs[jobId];
        return (job.provider, job.client, job.amount, uint8(job.status), job.rated);
    }

    function getReputation(address provider) external view returns (
        uint64 completedJobs,
        uint64 disputedJobs,
        uint64 ratingCount,
        uint256 avgRating100
    ) {
        Reputation storage rep = reputations[provider];
        completedJobs = rep.completedJobs;
        disputedJobs  = rep.disputedJobs;
        ratingCount   = rep.ratingCount;
        avgRating100  = rep.ratingCount > 0
            ? rep.totalRating100 / rep.ratingCount
            : 0;
    }
}
