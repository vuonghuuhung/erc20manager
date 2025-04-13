import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import * as hre from "hardhat";

// Define types to match the Proposal struct in MultisigDAO
interface Proposal {
    to: string;
    value: bigint;
    action: number;
    data: string;
    isExecuted: boolean;
    metadataURI: string;
    isRejected: boolean;
}

// Define enum to match the Action enum in MultisigDAO
enum Action {
    Distribute = 0,
    Burn = 1,
    Approve = 2,
    UpdateMetadata = 3
}

// Define enum to match the ProposalStatus enum in MultisigDAO
enum ProposalStatus {
    OnVoting = 0,
    Passed = 1,
    Executed = 2,
    Rejected = 3
}

// Add type extensions for the MultisigDAO contract
interface MultisigDAOExtended {
    getAllProposals: () => Promise<Proposal[]>;
    getProposalsByStatus: (isExecuted: boolean) => Promise<Proposal[]>;
    getProposalDetails: (proposalId: bigint) => Promise<{
        proposal: Proposal;
        approvalCount: bigint;
        isApprovedByCurrentSender: boolean;
        status: ProposalStatus;
        rejectionCount: bigint;
        isRejectedByCurrentSender: boolean;
    }>;
    getOwners: () => Promise<string[]>;
    s_isOwner: (address: string) => Promise<boolean>;
    s_required: () => Promise<bigint>;
    s_metadata: () => Promise<string>;
    getMetadata: () => Promise<string>;
    s_proposals: (index: number) => Promise<Proposal>;
    submitProposal: (to: string, value: bigint, action: number, data: string, metadataURI: string) => Promise<any>;
    approveProposal: (proposalId: bigint) => Promise<any>;
    rejectProposal: (proposalId: bigint) => Promise<any>;
    executeProposal: (proposalId: bigint) => Promise<any>;
    getProposalStatus: (proposalId: bigint) => Promise<ProposalStatus>;
    getProposalRejectionDetails: (proposalId: bigint) => Promise<{
        rejectionCount: bigint;
        isRejected: boolean;
        isRejectedByCurrentSender: boolean;
    }>;
    getAllProposalStatuses: () => Promise<{
        statuses: ProposalStatus[];
        proposalIds: bigint[];
    }>;
    getProposalsByProposalStatus: (status: ProposalStatus) => Promise<{
        filteredProposals: Proposal[];
        proposalIds: bigint[];
    }>;
    erc20Template: () => Promise<string>;
    connect: (signer: any) => MultisigDAOExtended;
}

// Deploy fixtures for testing
async function deployDAOFixture() {
    // Get signers (EOA accounts for testing)
    const [owner, otherAccount1, otherAccount2, otherAccount3, recipient] = await hre.ethers.getSigners();

    // Deploy DAOFactory
    const DAOFactory = await hre.ethers.getContractFactory("DAOFactory");
    const daoFactory = await DAOFactory.deploy();

    // Create new DAO
    const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
    const requiredConfirmations = 2; // Require 2 out of 3 owners to approve
    const tokenName = "DAO Test Token";
    const tokenSymbol = "DTT";
    const tokenDecimals = 18;
    const tokenInitialSupply = hre.ethers.parseUnits("1000", tokenDecimals);
    const daoMetadataBytes = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://dao-metadata-hash"));

    const tx = await daoFactory.createDAO(
        daoOwners,
        requiredConfirmations,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenInitialSupply,
        daoMetadataBytes
    );
    const receipt = await tx.wait();

    // Extract DAO and token addresses from event logs
    let daoAddress = "";
    let tokenAddress = "";
    if (receipt?.logs) {
        const daoFactoryInterface = DAOFactory.interface;
        for (const log of receipt.logs) {
            try {
                const parsedLog = daoFactoryInterface.parseLog(log as any);
                if (parsedLog && parsedLog.name === "Create") {
                    daoAddress = parsedLog.args.daoAddress;
                    tokenAddress = parsedLog.args.token;
                    break;
                }
            } catch (e) { /* Ignore */ }
        }
    }

    // Get contract instances
    const multisigDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
    const erc20DAO = await hre.ethers.getContractAt("ERC20Template", tokenAddress);

    return {
        daoFactory,
        multisigDAO: multisigDAO as unknown as MultisigDAOExtended,
        erc20DAO,
        owner,
        otherAccount1,
        otherAccount2,
        otherAccount3,
        recipient,
        daoAddress,
        tokenAddress,
        requiredConfirmations,
        daoMetadataBytes
    };
}

// Deploy fixture with 4 owners and 3 required confirmations to test edge cases
async function deployDAOFixture4Owners3Required() {
    // Get signers (EOA accounts for testing)
    const [owner, otherAccount1, otherAccount2, otherAccount3, recipient] = await hre.ethers.getSigners();

    // Deploy DAOFactory
    const DAOFactory = await hre.ethers.getContractFactory("DAOFactory");
    const daoFactory = await DAOFactory.deploy();

    // Create new DAO
    const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address, otherAccount3.address];
    const requiredConfirmations = 3; // Require 3 out of 4 owners to approve
    const tokenName = "DAO Test Token 4-3";
    const tokenSymbol = "DTT43";
    const tokenDecimals = 18;
    const tokenInitialSupply = hre.ethers.parseUnits("1000", tokenDecimals);
    const daoMetadataBytes = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://dao-metadata-hash-4-3"));

    const tx = await daoFactory.createDAO(
        daoOwners,
        requiredConfirmations,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        tokenInitialSupply,
        daoMetadataBytes
    );
    const receipt = await tx.wait();

    // Extract DAO and token addresses from event logs
    let daoAddress = "";
    let tokenAddress = "";
    if (receipt?.logs) {
        const daoFactoryInterface = DAOFactory.interface;
        for (const log of receipt.logs) {
            try {
                const parsedLog = daoFactoryInterface.parseLog(log as any);
                if (parsedLog && parsedLog.name === "Create") {
                    daoAddress = parsedLog.args.daoAddress;
                    tokenAddress = parsedLog.args.token;
                    break;
                }
            } catch (e) { /* Ignore */ }
        }
    }

    // Get contract instances
    const multisigDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
    const erc20DAO = await hre.ethers.getContractAt("ERC20Template", tokenAddress);

    return {
        daoFactory,
        multisigDAO: multisigDAO as unknown as MultisigDAOExtended,
        erc20DAO,
        owner,
        otherAccount1,
        otherAccount2,
        otherAccount3,
        recipient,
        daoAddress,
        tokenAddress,
        requiredConfirmations,
        daoMetadataBytes
    };
}

describe("MultisigDAO Proposal Status", function () {
    describe("Proposal Status Functions", function () {
        it("Should correctly identify proposal status as OnVoting when first submitted", async function () {
            const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Check proposal status
            const status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.OnVoting);

            // Check via getProposalDetails
            const details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.OnVoting);
        });

        it("Should update proposal status to Passed when it receives required approvals", async function () {
            const { multisigDAO, owner, otherAccount1, recipient, requiredConfirmations } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Owner approves (submitter auto-approves in some implementations, but we do it explicitly)
            await multisigDAO.connect(owner).approveProposal(0n);

            // Status should still be OnVoting with just one approval
            let status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.OnVoting);

            // Second owner approves, meeting required confirmations
            await multisigDAO.connect(otherAccount1).approveProposal(0n);

            // Status should now be Passed
            status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.Passed);

            // Verify with getProposalDetails
            const details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.Passed);
            expect(details.approvalCount).to.equal(requiredConfirmations);
        });

        it("Should update proposal status to Executed after execution", async function () {
            const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Both owners approve
            await multisigDAO.connect(owner).approveProposal(0n);
            await multisigDAO.connect(otherAccount1).approveProposal(0n);

            // Execute the proposal
            await multisigDAO.connect(owner).executeProposal(0n);

            // Status should now be Executed
            const status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.Executed);

            // Verify with getProposalDetails
            const details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.Executed);
            expect(details.proposal.isExecuted).to.be.true;
        });

        it("Should update proposal status to Rejected when majority rejects", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Two owners reject (majority)
            await multisigDAO.connect(owner).rejectProposal(0n);
            await multisigDAO.connect(otherAccount1).rejectProposal(0n);

            // Status should be Rejected
            const status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.Rejected);

            // Verify with getProposalDetails
            const details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.Rejected);
            expect(details.proposal.isRejected).to.be.true;
            expect(details.rejectionCount).to.equal(2n);
        });

        it("Should provide correct rejection details", async function () {
            const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Owner rejects
            await multisigDAO.connect(owner).rejectProposal(0n);

            // Get rejection details from owner's perspective
            let details = await multisigDAO.connect(owner).getProposalRejectionDetails(0n);
            expect(details.rejectionCount).to.equal(1n);
            expect(details.isRejected).to.be.false; // Not yet rejected (need majority)
            expect(details.isRejectedByCurrentSender).to.be.true; // Owner rejected

            // Get rejection details from otherAccount1's perspective
            details = await multisigDAO.connect(otherAccount1).getProposalRejectionDetails(0n);
            expect(details.rejectionCount).to.equal(1n);
            expect(details.isRejected).to.be.false;
            expect(details.isRejectedByCurrentSender).to.be.false; // otherAccount1 didn't reject

            // Second owner rejects, triggering rejection
            await multisigDAO.connect(otherAccount1).rejectProposal(0n);

            // Check updated rejection details
            details = await multisigDAO.getProposalRejectionDetails(0n);
            expect(details.rejectionCount).to.equal(2n);
            expect(details.isRejected).to.be.true; // Now rejected (majority reached)
        });

        it("Should not allow approving a rejected proposal", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // Two owners reject (majority)
            await multisigDAO.connect(owner).rejectProposal(0n);
            await multisigDAO.connect(otherAccount1).rejectProposal(0n);

            // Third owner tries to approve - should revert
            await expect(
                multisigDAO.connect(otherAccount2).approveProposal(0n)
            ).to.be.revertedWith("MultisigDAO: Proposal has been rejected");
        });

        it("Should not allow executing a rejected proposal", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Submit a proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x", // Empty data for Distribute action
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata-hash"))
            );

            // First get enough approvals to pass
            await multisigDAO.connect(owner).approveProposal(0n);
            await multisigDAO.connect(otherAccount1).approveProposal(0n);

            // Then get majority to reject
            await multisigDAO.connect(owner).rejectProposal(0n);
            await multisigDAO.connect(otherAccount2).rejectProposal(0n);

            // Try to execute - should revert
            await expect(
                multisigDAO.connect(owner).executeProposal(0n)
            ).to.be.revertedWith("MultisigDAO: Proposal has been rejected");
        });

        it("Should revert approveProposal if rejections make passing impossible", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://test-impossible"))
            );

            // One rejection (owner)
            await multisigDAO.connect(owner).rejectProposal(0n);

            // OK to approve now - still 2 owners left, need 2 approvals
            await expect(multisigDAO.connect(otherAccount2).approveProposal(0n)).to.not.be.reverted;

            // Reset with a new proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://test-impossible-2"))
            );

            // Two rejections makes it impossible to reach required=2 with only 1 owner left
            await multisigDAO.connect(owner).rejectProposal(1n);
            await multisigDAO.connect(otherAccount1).rejectProposal(1n);

            // Try to approve - should fail due to impossibility
            await expect(
                multisigDAO.connect(otherAccount2).approveProposal(1n)
            ).to.be.revertedWith("MultisigDAO: Proposal has been rejected");
        });

        it("Should return Rejected status if rejections make passing impossible", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://test-status"))
            );

            // One rejection (owner). Remaining = 2. Required = 2. Still possible.
            await multisigDAO.connect(owner).rejectProposal(0n);
            let details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.OnVoting); // Still OnVoting
            expect(details.proposal.isRejected).to.be.false;

            // Second rejection (otherAccount1). Remaining = 1. Required = 2. IMPOSSIBLE & MAJORITY REJECTED
            await multisigDAO.connect(otherAccount1).rejectProposal(0n);
            details = await multisigDAO.getProposalDetails(0n);
            expect(details.status).to.equal(ProposalStatus.Rejected); // Now Rejected
            expect(details.proposal.isRejected).to.be.true;
        });

        it("Should handle edge case where impossible is different from majority rejected - 4 owners, 3 required", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, otherAccount3, recipient } = await loadFixture(deployDAOFixture4Owners3Required);
            const amount = hre.ethers.parseUnits("100", 18);

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://test-edge-case"))
            );

            // Rejection 1 (owner)
            await multisigDAO.connect(owner).rejectProposal(0n);
            let status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.OnVoting);

            // Check if we can still approve (should work with just 1 rejection)
            await expect(multisigDAO.connect(otherAccount2).approveProposal(0n)).to.not.be.reverted;

            // Reset with a new proposal for testing rejection path
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://test-edge-case-2"))
            );

            // Rejection 1 (owner)
            await multisigDAO.connect(owner).rejectProposal(1n);

            // Rejection 2 (otherAccount1). Remaining = 2. Required = 3. IMPOSSIBLE to reach required.
            await multisigDAO.connect(otherAccount1).rejectProposal(1n);
            status = await multisigDAO.getProposalStatus(1n);
            expect(status).to.equal(ProposalStatus.Rejected); // Should be rejected due to impossibility

            let details = await multisigDAO.getProposalDetails(1n);
            expect(details.proposal.isRejected).to.be.false; // But isRejected flag is still false (need 3 for majority)
            expect(details.status).to.equal(ProposalStatus.Rejected);

            // Try to approve - should fail due to impossibility
            await expect(
                multisigDAO.connect(otherAccount2).approveProposal(1n)
            ).to.be.revertedWith("MultisigDAO: Proposal cannot pass due to rejections");

            // Rejection 3 (otherAccount2). Now majority rejected.
            await multisigDAO.connect(otherAccount2).rejectProposal(1n);
            status = await multisigDAO.getProposalStatus(1n);
            expect(status).to.equal(ProposalStatus.Rejected);
            details = await multisigDAO.getProposalDetails(1n);
            expect(details.proposal.isRejected).to.be.true; // Now isRejected flag is true
        });
    });

    describe("Proposal Status Listing Functions", function () {
        it("Should correctly list all proposal statuses", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Create 4 proposals with different statuses

            // Proposal 0: OnVoting (no approvals yet)
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal0"))
            );

            // Proposal 1: Passed (enough approvals)
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal1"))
            );
            await multisigDAO.connect(owner).approveProposal(1n);
            await multisigDAO.connect(otherAccount1).approveProposal(1n);

            // Proposal 2: Executed
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal2"))
            );
            await multisigDAO.connect(owner).approveProposal(2n);
            await multisigDAO.connect(otherAccount1).approveProposal(2n);
            await multisigDAO.connect(owner).executeProposal(2n);

            // Proposal 3: Rejected
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal3"))
            );
            await multisigDAO.connect(owner).rejectProposal(3n);
            await multisigDAO.connect(otherAccount1).rejectProposal(3n);

            // Get all proposal statuses
            const result = await multisigDAO.getAllProposalStatuses();

            // Verify correct statuses
            expect(result.statuses.length).to.equal(4);
            expect(result.proposalIds.length).to.equal(4);

            expect(result.statuses[0]).to.equal(ProposalStatus.OnVoting);
            expect(result.statuses[1]).to.equal(ProposalStatus.Passed);
            expect(result.statuses[2]).to.equal(ProposalStatus.Executed);
            expect(result.statuses[3]).to.equal(ProposalStatus.Rejected);

            expect(result.proposalIds[0]).to.equal(0n);
            expect(result.proposalIds[1]).to.equal(1n);
            expect(result.proposalIds[2]).to.equal(2n);
            expect(result.proposalIds[3]).to.equal(3n);
        });

        it("Should filter proposals by status", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Create multiple proposals with different statuses

            // Proposals 0, 4: OnVoting
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://onvoting1"))
            );

            // Proposals 1, 5: Passed 
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://passed1"))
            );
            await multisigDAO.connect(owner).approveProposal(1n);
            await multisigDAO.connect(otherAccount1).approveProposal(1n);

            // Proposals 2, 6: Executed
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://executed1"))
            );
            await multisigDAO.connect(owner).approveProposal(2n);
            await multisigDAO.connect(otherAccount1).approveProposal(2n);
            await multisigDAO.connect(owner).executeProposal(2n);

            // Proposals 3, 7: Rejected
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://rejected1"))
            );
            await multisigDAO.connect(owner).rejectProposal(3n);
            await multisigDAO.connect(otherAccount1).rejectProposal(3n);

            // Add duplicates of each status
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://onvoting2"))
            );

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://passed2"))
            );
            await multisigDAO.connect(owner).approveProposal(5n);
            await multisigDAO.connect(otherAccount1).approveProposal(5n);

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://executed2"))
            );
            await multisigDAO.connect(owner).approveProposal(6n);
            await multisigDAO.connect(otherAccount1).approveProposal(6n);
            await multisigDAO.connect(owner).executeProposal(6n);

            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://rejected2"))
            );
            await multisigDAO.connect(owner).rejectProposal(7n);
            await multisigDAO.connect(otherAccount1).rejectProposal(7n);

            // Test filtering by status

            // OnVoting proposals
            let result = await multisigDAO.getProposalsByProposalStatus(ProposalStatus.OnVoting);
            expect(result.filteredProposals.length).to.equal(2);
            expect(result.filteredProposals[0].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://onvoting1")));
            expect(result.filteredProposals[1].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://onvoting2")));

            // Passed proposals
            result = await multisigDAO.getProposalsByProposalStatus(ProposalStatus.Passed);
            expect(result.filteredProposals.length).to.equal(2);
            expect(result.filteredProposals[0].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://passed1")));
            expect(result.filteredProposals[1].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://passed2")));

            // Executed proposals
            result = await multisigDAO.getProposalsByProposalStatus(ProposalStatus.Executed);
            expect(result.filteredProposals.length).to.equal(2);
            expect(result.filteredProposals[0].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://executed1")));
            expect(result.filteredProposals[1].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://executed2")));

            // Rejected proposals
            result = await multisigDAO.getProposalsByProposalStatus(ProposalStatus.Rejected);
            expect(result.filteredProposals.length).to.equal(2);
            expect(result.filteredProposals[0].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://rejected1")));
            expect(result.filteredProposals[1].metadataURI).to.equal(hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://rejected2")));
        });

        it("Should return empty arrays when filtering with no matching proposals", async function () {
            const { multisigDAO } = await loadFixture(deployDAOFixture);

            // No proposals have been created, so all statuses should return empty arrays
            const result = await multisigDAO.getProposalsByProposalStatus(ProposalStatus.Executed);
            expect(result.filteredProposals.length).to.equal(0);
            expect(result.proposalIds.length).to.equal(0);
        });

        it("Should handle mixed status operations correctly", async function () {
            const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFixture);
            const amount = hre.ethers.parseUnits("100", 18);

            // Create proposal
            await multisigDAO.connect(owner).submitProposal(
                recipient.address,
                amount,
                Action.Distribute,
                "0x",
                hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://mixed-status-test"))
            );

            // Check initial status
            let status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.OnVoting);

            // Approve to change status to Passed
            await multisigDAO.connect(owner).approveProposal(0n);
            await multisigDAO.connect(otherAccount1).approveProposal(0n);

            status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.Passed);

            // Now reject to override the Passed status
            await multisigDAO.connect(owner).rejectProposal(0n);
            await multisigDAO.connect(otherAccount2).rejectProposal(0n);

            status = await multisigDAO.getProposalStatus(0n);
            expect(status).to.equal(ProposalStatus.Rejected);

            // Try to execute the now-rejected proposal (should fail)
            await expect(
                multisigDAO.connect(owner).executeProposal(0n)
            ).to.be.revertedWith("MultisigDAO: Proposal has been rejected");
        });
    });
});

// Add a test for DAOFactory and MultisigDAO with bytes metadata
describe("MultisigDAO with bytes metadata", function () {
    it("Should correctly store and retrieve bytes metadata", async function () {
        const { multisigDAO, daoMetadataBytes } = await loadFixture(deployDAOFixture);

        // Check that the metadata was stored correctly
        const storedMetadata = await (multisigDAO as any).getMetadata();
        expect(storedMetadata).to.equal(daoMetadataBytes);
    });

    it("Should update metadata using bytes in UpdateMetadata proposal", async function () {
        const { multisigDAO, owner, otherAccount1, daoMetadataBytes } = await loadFixture(deployDAOFixture);
        const newMetadataBytes = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://new-metadata-hash"));

        // Encode the metadata for the proposal
        const proposalData = hre.ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [newMetadataBytes]);

        // Submit UpdateMetadata proposal
        await multisigDAO.connect(owner).submitProposal(
            hre.ethers.ZeroAddress,
            0n,
            Action.UpdateMetadata,
            proposalData,
            hre.ethers.hexlify(hre.ethers.toUtf8Bytes("ipfs://proposal-metadata"))
        );

        // Approve and execute
        await multisigDAO.connect(owner).approveProposal(0n);
        await multisigDAO.connect(otherAccount1).approveProposal(0n);
        await multisigDAO.connect(owner).executeProposal(0n);

        // Verify metadata was updated
        const updatedMetadata = await (multisigDAO as any).getMetadata();
        expect(updatedMetadata).to.equal(newMetadataBytes);
        expect(updatedMetadata).to.not.equal(daoMetadataBytes);
    });
}); 