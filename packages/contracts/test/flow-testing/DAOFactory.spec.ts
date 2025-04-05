import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

// Define the Proposal struct type that matches our contract
interface Proposal {
    to: string;
    value: bigint;
    action: number;
    data: string;
    isExecuted: boolean;
}

// Add type extensions for the MultisigDAO contract
interface MultisigDAOExtended {
    getAllProposals: () => Promise<Proposal[]>;
    getProposalsByStatus: (isExecuted: boolean) => Promise<Proposal[]>;
    getProposalDetails: (proposalId: number) => Promise<{
        proposal: Proposal;
        approvalCount: bigint;
        isApprovedByCurrentSender: boolean;
    }>;
    getOwners: () => Promise<string[]>;
    s_isOwner: (address: string) => Promise<boolean>;
    s_required: () => Promise<bigint>;
    s_proposals: (index: number) => Promise<Proposal>;
    submitProposal: (to: string, value: bigint, action: number, data: string) => Promise<any>;
    approveProposal: (proposalId: number) => Promise<any>;
    executeProposal: (proposalId: number) => Promise<any>;
    connect: (signer: any) => MultisigDAOExtended;
}

describe("DAOFactory Flow", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployDAOFactoryFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount1, otherAccount2, otherAccount3, recipient] = await hre.ethers.getSigners();

        const DAOFactory = await hre.ethers.getContractFactory("DAOFactory");
        const daoFactory = await DAOFactory.deploy();

        // --- Create a default DAO for proposal testing --- //
        const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
        const requiredConfirmations = 2;
        const tokenName = "Test DAO Token";
        const tokenSymbol = "TDT";
        const tokenDecimals = 18;
        const tokenInitialSupply = hre.ethers.parseUnits("1000", tokenDecimals);
        const daoMetadata = "ipfs://test-metadata-hash";

        const tx = await daoFactory.createDAO(
            daoOwners,
            requiredConfirmations,
            tokenName,
            tokenSymbol,
            tokenDecimals,
            tokenInitialSupply,
            daoMetadata
        );
        const receipt = await tx.wait();

        let daoAddress = "";
        let tokenAddress = "";
        if (receipt?.logs) {
            const daoFactoryInterface = await hre.ethers.getContractFactory("DAOFactory").then(f => f.interface);
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

        const multisigDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
        const erc20DAO = await hre.ethers.getContractAt("ERC20Template", tokenAddress);
        // --- End Create default DAO --- //

        return {
            daoFactory, multisigDAO, erc20DAO,
            owner, otherAccount1, otherAccount2, otherAccount3, recipient,
            daoOwners, requiredConfirmations, tokenInitialSupply
        };
    }

    describe("Deployment", function () {
        it("Should deploy the DAOFactory correctly", async function () {
            const { daoFactory } = await loadFixture(deployDAOFactoryFixture);
            expect(await daoFactory.getAddress()).to.be.properAddress;
        });
    });

    describe("Create DAO", function () {
        it("Should allow anyone to create a new DAO with an associated ERC20 token", async function () {
            const { daoFactory, owner, otherAccount1, otherAccount2 } = await loadFixture(deployDAOFactoryFixture);

            const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
            const requiredConfirmations = 2;
            const tokenName = "Test DAO Token";
            const tokenSymbol = "TDT";
            const tokenDecimals = 18; // Standard ERC20 decimals
            const tokenInitialSupply = hre.ethers.parseUnits("1000", tokenDecimals);
            const daoMetadata = "ipfs://test-metadata-hash";

            // Call the createDAO function
            const tx = await daoFactory.createDAO(
                daoOwners,
                requiredConfirmations,
                tokenName,
                tokenSymbol,
                tokenDecimals,
                tokenInitialSupply,
                daoMetadata
            );
            const receipt = await tx.wait();

            // --- Verification --- Find the created DAO and Token addresses from event logs
            let daoAddress = "";
            let tokenAddress = "";
            let amountEmitted = 0n; // Use BigInt for uint256

            if (receipt?.logs) {
                const daoFactoryInterface = await hre.ethers.getContractFactory("DAOFactory").then(f => f.interface);
                for (const log of receipt.logs) {
                    try {
                        const parsedLog = daoFactoryInterface.parseLog(log as any);
                        if (parsedLog && parsedLog.name === "Create") {
                            daoAddress = parsedLog.args.daoAddress;
                            tokenAddress = parsedLog.args.token;
                            amountEmitted = parsedLog.args.amount; // Assign as BigInt
                            break;
                        }
                    } catch (e) {
                        // Ignore logs that don't match the DAOFactory interface
                    }
                }
            }

            expect(daoAddress).to.be.properAddress;
            expect(tokenAddress).to.be.properAddress;
            expect(amountEmitted).to.equal(tokenInitialSupply);

            // Verify factory state
            const listOfDAOs = await daoFactory.getListOfDAO();
            const listOfERC20DAOs = await daoFactory.getListOfERC20DAOCreated();
            expect(listOfDAOs).to.include(daoAddress);
            expect(listOfERC20DAOs).to.include(tokenAddress);
            expect(await daoFactory.getDAOAddressOfERC20DAO(tokenAddress)).to.equal(daoAddress);
            // Verify token association using the other getter
            const [retrievedTokenAddress] = await daoFactory.getERC20MetadataOfDAO(daoAddress);
            expect(retrievedTokenAddress).to.equal(tokenAddress);

            // Verify ERC20 token state using getContractAt for typed instance
            const erc20DAO = await hre.ethers.getContractAt("ERC20Template", tokenAddress);
            expect(await erc20DAO.name()).to.equal(tokenName);
            expect(await erc20DAO.symbol()).to.equal(tokenSymbol);
            expect(await erc20DAO.decimals()).to.equal(tokenDecimals);
            expect(await erc20DAO.totalSupply()).to.equal(tokenInitialSupply);
            expect(await erc20DAO.owner()).to.equal(daoAddress); // DAO contract owns the token
            expect(await erc20DAO.balanceOf(daoAddress)).to.equal(tokenInitialSupply); // Initial supply minted to DAO

            // Verify MultisigDAO state using getContractAt for typed instance
            const multisigDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
            expect(await multisigDAO.s_required()).to.equal(requiredConfirmations);
            expect(await multisigDAO.s_metadata()).to.equal(daoMetadata);
            // Verify owners using the s_isOwner mapping
            for (const ownerAddress of daoOwners) {
                expect(await multisigDAO.s_isOwner(ownerAddress)).to.be.true;
            }
            // Optional: Check that an unrelated address is not an owner
            const [, , , unrelatedAccount] = await hre.ethers.getSigners();
            expect(await multisigDAO.s_isOwner(unrelatedAccount.address)).to.be.false;

            expect(await multisigDAO.erc20Template()).to.equal(tokenAddress);
        });

        it("Should revert if required confirmations are invalid", async function () {
            const { daoFactory, owner, otherAccount1 } = await loadFixture(deployDAOFactoryFixture);
            const daoOwners = [owner.address, otherAccount1.address];
            const tokenInitialSupply = hre.ethers.parseUnits("1000", 18);

            // Required > number of owners
            await expect(daoFactory.createDAO(daoOwners, 3, "T", "T", 18, tokenInitialSupply, "")).to.be.revertedWithCustomError(
                // Need to attach MultisigDAO contract to get the error signature
                await hre.ethers.getContractFactory("MultisigDAO"),
                "MultisigDAO_InvalidRequired"
            ).withArgs(3, 2);

            // Required == 0
            await expect(daoFactory.createDAO(daoOwners, 0, "T", "T", 18, tokenInitialSupply, "")).to.be.revertedWithCustomError(
                await hre.ethers.getContractFactory("MultisigDAO"),
                "MultisigDAO_InvalidRequired"
            ).withArgs(0, 2);
        });

        it("Should revert if owner list is empty", async function () {
            const { daoFactory } = await loadFixture(deployDAOFactoryFixture);
            const tokenInitialSupply = hre.ethers.parseUnits("1000", 18);
            await expect(daoFactory.createDAO([], 1, "T", "T", 18, tokenInitialSupply, "")).to.be.revertedWithCustomError(
                await hre.ethers.getContractFactory("MultisigDAO"),
                "MultisigDAO_NeedOwners"
            );
        });

        it("Should revert if owner list contains zero address", async function () {
            const { daoFactory, owner } = await loadFixture(deployDAOFactoryFixture);
            const daoOwners = [owner.address, hre.ethers.ZeroAddress];
            const tokenInitialSupply = hre.ethers.parseUnits("1000", 18);
            await expect(daoFactory.createDAO(daoOwners, 1, "T", "T", 18, tokenInitialSupply, "")).to.be.revertedWithCustomError(
                await hre.ethers.getContractFactory("MultisigDAO"),
                "MultisigDAO_InvalidOwner"
            );
        });

        it("Should revert if owner list contains duplicate addresses", async function () {
            const { daoFactory, owner } = await loadFixture(deployDAOFactoryFixture);
            const daoOwners = [owner.address, owner.address];
            const tokenInitialSupply = hre.ethers.parseUnits("1000", 18);
            await expect(daoFactory.createDAO(daoOwners, 1, "T", "T", 18, tokenInitialSupply, "")).to.be.revertedWithCustomError(
                await hre.ethers.getContractFactory("MultisigDAO"),
                "MultisigDAO_AlreadyOwner"
            ).withArgs(owner.address);
        });
    });

    describe("DAO Proposals", function () {
        // Enum Action values from MultisigDAO contract
        const Action = {
            Distribute: 0,
            Burn: 1,
            Approve: 2,
            UpdateMetadata: 3
        };

        describe("Submit Proposal", function () {
            it("Should allow an owner to submit a Distribute proposal", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);

                await expect(multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    amount,
                    Action.Distribute,
                    "0x" // Empty data for Distribute
                )).to.emit(multisigDAO, "Submit").withArgs(0); // First proposal ID is 0

                const proposal = await multisigDAO.s_proposals(0);
                expect(proposal.to).to.equal(recipient.address);
                expect(proposal.value).to.equal(amount);
                expect(proposal.action).to.equal(Action.Distribute);
                expect(proposal.data).to.equal("0x");
                expect(proposal.isExecuted).to.be.false;
            });

            it("Should revert if a non-owner tries to submit a proposal", async function () {
                const { multisigDAO, otherAccount3, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);

                await expect(multisigDAO.connect(otherAccount3).submitProposal(
                    recipient.address,
                    amount,
                    Action.Distribute,
                    "0x"
                )).to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");
            });

            it("Should revert Distribute proposal if recipient is zero address", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    amount,
                    Action.Distribute,
                    "0x"
                )).to.be.revertedWith("MultisigDAO: Invalid recipient for Distribute");
            });
            it("Should revert Distribute proposal if value is zero", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                await expect(multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    0,
                    Action.Distribute,
                    "0x"
                )).to.be.revertedWith("MultisigDAO: Value must be greater than zero for Distribute");
            });
            it("Should revert Distribute proposal if data is not empty", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);
                const invalidData = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("invalid"));
                await expect(multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    amount,
                    Action.Distribute,
                    invalidData
                )).to.be.revertedWith("MultisigDAO: Data should be empty for Distribute");
            });

            it("Should allow an owner to submit a Burn proposal", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("50", 18);

                // Proposal ID 0 (Distribute), Proposal ID 1 will be Burn
                const recipient = hre.ethers.Wallet.createRandom().address; // Dummy recipient for first proposal
                await multisigDAO.connect(owner).submitProposal(recipient, hre.ethers.parseUnits("1", 18), Action.Distribute, "0x");

                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress, // 'to' should be zero for Burn
                    amount,
                    Action.Burn,
                    "0x" // Empty data for Burn
                )).to.emit(multisigDAO, "Submit").withArgs(1);

                const proposal = await multisigDAO.s_proposals(1);
                expect(proposal.to).to.equal(hre.ethers.ZeroAddress);
                expect(proposal.value).to.equal(amount);
                expect(proposal.action).to.equal(Action.Burn);
                expect(proposal.data).to.equal("0x");
                expect(proposal.isExecuted).to.be.false;
            });

            it("Should revert Burn proposal if value is zero", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    0,
                    Action.Burn,
                    "0x"
                )).to.be.revertedWith("MultisigDAO: Value must be greater than zero for Burn");
            });

            it("Should revert Burn proposal if 'to' is not zero address", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("50", 18);
                await expect(multisigDAO.connect(owner).submitProposal(
                    recipient.address, // Invalid 'to'
                    amount,
                    Action.Burn,
                    "0x"
                )).to.be.revertedWith("MultisigDAO: 'to' should be zero address for Burn");
            });

            it("Should revert Burn proposal if data is not empty", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("50", 18);
                const invalidData = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("invalid"));
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    amount,
                    Action.Burn,
                    invalidData
                )).to.be.revertedWith("MultisigDAO: Data should be empty for Burn");
            });

            it("Should allow an owner to submit an Approve proposal", async function () {
                const { multisigDAO, owner, otherAccount3 } = await loadFixture(deployDAOFactoryFixture);
                const spender = otherAccount3.address; // Who to approve
                const amount = hre.ethers.parseUnits("200", 18);

                // Make previous proposals (Distribute, Burn) to get to proposal ID 2
                const recipient = hre.ethers.Wallet.createRandom().address;
                await multisigDAO.connect(owner).submitProposal(recipient, hre.ethers.parseUnits("1", 18), Action.Distribute, "0x");
                await multisigDAO.connect(owner).submitProposal(hre.ethers.ZeroAddress, hre.ethers.parseUnits("1", 18), Action.Burn, "0x");

                await expect(multisigDAO.connect(owner).submitProposal(
                    spender,
                    amount,
                    Action.Approve,
                    "0x" // Empty data for Approve
                )).to.emit(multisigDAO, "Submit").withArgs(2);

                const proposal = await multisigDAO.s_proposals(2);
                expect(proposal.to).to.equal(spender);
                expect(proposal.value).to.equal(amount);
                expect(proposal.action).to.equal(Action.Approve);
                expect(proposal.data).to.equal("0x");
                expect(proposal.isExecuted).to.be.false;
            });

            it("Should revert Approve proposal if spender ('to') is zero address", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("200", 18);
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    amount,
                    Action.Approve,
                    "0x"
                )).to.be.revertedWith("MultisigDAO: Invalid spender for Approve");
            });

            // Note: Approving zero amount is allowed (to revoke approval)
            it("Should allow Approve proposal with zero value", async function () {
                const { multisigDAO, owner, otherAccount3 } = await loadFixture(deployDAOFactoryFixture);
                const spender = otherAccount3.address;
                await expect(multisigDAO.connect(owner).submitProposal(
                    spender,
                    0, // Zero amount
                    Action.Approve,
                    "0x"
                )).to.emit(multisigDAO, "Submit"); // No revert
            });

            it("Should revert Approve proposal if data is not empty", async function () {
                const { multisigDAO, owner, otherAccount3 } = await loadFixture(deployDAOFactoryFixture);
                const spender = otherAccount3.address;
                const amount = hre.ethers.parseUnits("200", 18);
                const invalidData = hre.ethers.hexlify(hre.ethers.toUtf8Bytes("invalid"));
                await expect(multisigDAO.connect(owner).submitProposal(
                    spender,
                    amount,
                    Action.Approve,
                    invalidData
                )).to.be.revertedWith("MultisigDAO: Data should be empty for Approve");
            });

            it("Should allow an owner to submit an UpdateMetadata proposal", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const newMetadata = "ipfs://new-metadata-hash";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);

                // Make previous proposals to get to proposal ID 3
                const recipient = hre.ethers.Wallet.createRandom().address;
                const spender = hre.ethers.Wallet.createRandom().address;
                await multisigDAO.connect(owner).submitProposal(recipient, hre.ethers.parseUnits("1", 18), Action.Distribute, "0x");
                await multisigDAO.connect(owner).submitProposal(hre.ethers.ZeroAddress, hre.ethers.parseUnits("1", 18), Action.Burn, "0x");
                await multisigDAO.connect(owner).submitProposal(spender, hre.ethers.parseUnits("1", 18), Action.Approve, "0x");

                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress, // 'to' must be zero
                    0, // 'value' must be zero
                    Action.UpdateMetadata,
                    encodedMetadata // Encoded string data
                )).to.emit(multisigDAO, "Submit").withArgs(3);

                const proposal = await multisigDAO.s_proposals(3);
                expect(proposal.to).to.equal(hre.ethers.ZeroAddress);
                expect(proposal.value).to.equal(0);
                expect(proposal.action).to.equal(Action.UpdateMetadata);
                expect(proposal.data).to.equal(encodedMetadata);
                expect(proposal.isExecuted).to.be.false;
            });

            it("Should revert UpdateMetadata proposal if data is empty", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    0,
                    Action.UpdateMetadata,
                    "0x" // Invalid empty data
                )).to.be.revertedWith("MultisigDAO: Data required for UpdateMetadata");
            });

            it("Should revert UpdateMetadata proposal if 'to' is not zero address", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                const newMetadata = "ipfs://new-metadata-hash";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);
                await expect(multisigDAO.connect(owner).submitProposal(
                    recipient.address, // Invalid 'to'
                    0,
                    Action.UpdateMetadata,
                    encodedMetadata
                )).to.be.revertedWith("MultisigDAO: 'to' should be zero address for UpdateMetadata");
            });

            it("Should revert UpdateMetadata proposal if 'value' is not zero", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                const newMetadata = "ipfs://new-metadata-hash";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);
                await expect(multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    1, // Invalid 'value'
                    Action.UpdateMetadata,
                    encodedMetadata
                )).to.be.revertedWith("MultisigDAO: 'value' should be zero for UpdateMetadata");
            });
        });

        describe("Approve Proposal", function () {
            it("Should allow owners to approve a submitted proposal", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);

                // Owner submits
                await multisigDAO.connect(owner).submitProposal(recipient.address, amount, Action.Distribute, "0x");
                const proposalId = 0;

                // Owner approves
                await expect(multisigDAO.connect(owner).approveProposal(proposalId))
                    .to.emit(multisigDAO, "Approve")
                    .withArgs(owner.address, proposalId);
                expect(await multisigDAO.s_isApproved(proposalId, owner.address)).to.be.true;

                // Another owner approves
                await expect(multisigDAO.connect(otherAccount1).approveProposal(proposalId))
                    .to.emit(multisigDAO, "Approve")
                    .withArgs(otherAccount1.address, proposalId);
                expect(await multisigDAO.s_isApproved(proposalId, otherAccount1.address)).to.be.true;
            });

            it("Should revert if non-owner tries to approve", async function () {
                const { multisigDAO, owner, otherAccount3, recipient } = await loadFixture(deployDAOFactoryFixture);
                await multisigDAO.connect(owner).submitProposal(recipient.address, hre.ethers.parseUnits("1", 18), Action.Distribute, "0x");
                await expect(multisigDAO.connect(otherAccount3).approveProposal(0))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");
            });

            it("Should revert if approving a non-existent proposal", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                await expect(multisigDAO.connect(owner).approveProposal(999))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_ProposalNotExist");
            });

            it("Should revert if owner tries to approve the same proposal twice", async function () {
                const { multisigDAO, owner, recipient } = await loadFixture(deployDAOFactoryFixture);
                await multisigDAO.connect(owner).submitProposal(recipient.address, hre.ethers.parseUnits("1", 18), Action.Distribute, "0x");
                await multisigDAO.connect(owner).approveProposal(0);
                await expect(multisigDAO.connect(owner).approveProposal(0))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_AlreadyApproved")
                    .withArgs(0);
            });

            it("Should revert if trying to approve an already executed proposal", async function () {
                const { multisigDAO, owner, otherAccount1, recipient, requiredConfirmations } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("10", 18);
                await multisigDAO.connect(owner).submitProposal(recipient.address, amount, Action.Distribute, "0x");
                const proposalId = 0;
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId); // Reach required approvals
                await multisigDAO.connect(owner).executeProposal(proposalId); // Execute

                // Try approving again (owner 1)
                await expect(multisigDAO.connect(owner).approveProposal(proposalId))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_AlreadyApproved") // Note: Typo in contract error name
                    .withArgs(proposalId);

                // Try approving again (owner 2 who hadn't approved yet)
                const { otherAccount2 } = await loadFixture(deployDAOFactoryFixture); // Get fresh instance if needed
                await expect(multisigDAO.connect(otherAccount2).approveProposal(proposalId))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_ProposalNotExist");
            });
        });

        describe("Execute Proposal (Distribute)", function () {
            it("Should execute a Distribute proposal after required approvals", async function () {
                const { multisigDAO, erc20DAO, owner, otherAccount1, recipient, tokenInitialSupply } = await loadFixture(deployDAOFactoryFixture);
                const amountToDistribute = hre.ethers.parseUnits("100", 18);
                const proposalId = 0;

                // Submit
                await multisigDAO.connect(owner).submitProposal(recipient.address, amountToDistribute, Action.Distribute, "0x");

                // Approve (enough)
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check balances before execution
                const daoBalanceBefore = await erc20DAO.balanceOf(multisigDAO.getAddress());
                const recipientBalanceBefore = await erc20DAO.balanceOf(recipient.address);
                expect(daoBalanceBefore).to.equal(tokenInitialSupply);
                expect(recipientBalanceBefore).to.equal(0);

                // Execute
                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.emit(multisigDAO, "Execute").withArgs(proposalId)
                    .to.emit(erc20DAO, "Transfer").withArgs(await multisigDAO.getAddress(), recipient.address, amountToDistribute);

                // Check state and balances after execution
                const proposal = await multisigDAO.s_proposals(proposalId);
                expect(proposal.isExecuted).to.be.true;
                const daoBalanceAfter = await erc20DAO.balanceOf(multisigDAO.getAddress());
                const recipientBalanceAfter = await erc20DAO.balanceOf(recipient.address);
                expect(daoBalanceAfter).to.equal(daoBalanceBefore - amountToDistribute);
                expect(recipientBalanceAfter).to.equal(recipientBalanceBefore + amountToDistribute);
            });

            it("Should revert if trying to execute without enough approvals", async function () {
                const { multisigDAO, owner, recipient, requiredConfirmations } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);
                const proposalId = 0;
                await multisigDAO.connect(owner).submitProposal(recipient.address, amount, Action.Distribute, "0x");
                await multisigDAO.connect(owner).approveProposal(proposalId); // Only 1 approval

                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_NotEnoughApprovals")
                    .withArgs(proposalId, requiredConfirmations, 1);
            });

            it("Should revert if trying to execute a non-existent proposal", async function () {
                const { multisigDAO, owner } = await loadFixture(deployDAOFactoryFixture);
                await expect(multisigDAO.connect(owner).executeProposal(999))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_ProposalNotExist");
            });

            it("Should revert if trying to execute an already executed proposal", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);
                const proposalId = 0;
                await multisigDAO.connect(owner).submitProposal(recipient.address, amount, Action.Distribute, "0x");
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);
                await multisigDAO.connect(owner).executeProposal(proposalId);

                // Try executing again
                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_AlreadyExecutedd") // Note: Typo in contract error name
                    .withArgs(proposalId);
            });

            it("Should revert if non-owner tries to execute", async function () {
                const { multisigDAO, owner, otherAccount1, otherAccount3, recipient } = await loadFixture(deployDAOFactoryFixture);
                const amount = hre.ethers.parseUnits("100", 18);
                const proposalId = 0;
                await multisigDAO.connect(owner).submitProposal(recipient.address, amount, Action.Distribute, "0x");
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Try executing with non-owner
                await expect(multisigDAO.connect(otherAccount3).executeProposal(proposalId))
                    .to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");
            });
        });

        describe("Execute Proposal (Burn)", function () {
            it("Should execute a Burn proposal after required approvals", async function () {
                const { multisigDAO, erc20DAO, owner, otherAccount1, tokenInitialSupply } = await loadFixture(deployDAOFactoryFixture);
                const amountToBurn = hre.ethers.parseUnits("50", 18);
                const proposalId = 0;

                // Submit Burn proposal
                await multisigDAO.connect(owner).submitProposal(hre.ethers.ZeroAddress, amountToBurn, Action.Burn, "0x");

                // Approve
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check supply and balance before execution
                const daoBalanceBefore = await erc20DAO.balanceOf(multisigDAO.getAddress());
                const totalSupplyBefore = await erc20DAO.totalSupply();
                expect(daoBalanceBefore).to.equal(tokenInitialSupply);
                expect(totalSupplyBefore).to.equal(tokenInitialSupply);

                // Execute
                const daoAddress = await multisigDAO.getAddress();
                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.emit(multisigDAO, "Execute").withArgs(proposalId)
                    // ERC20 Burn event: Transfer(from, to, value) where 'to' is address(0)
                    .to.emit(erc20DAO, "Transfer").withArgs(daoAddress, hre.ethers.ZeroAddress, amountToBurn);

                // Check state, balance, and supply after execution
                const proposal = await multisigDAO.s_proposals(proposalId);
                expect(proposal.isExecuted).to.be.true;
                const daoBalanceAfter = await erc20DAO.balanceOf(daoAddress);
                const totalSupplyAfter = await erc20DAO.totalSupply();
                expect(daoBalanceAfter).to.equal(daoBalanceBefore - amountToBurn);
                expect(totalSupplyAfter).to.equal(totalSupplyBefore - amountToBurn);
            });

            // Other execution failure cases (not enough approvals, already executed, etc.) are covered by Distribute tests
            // We only need to test the successful execution path specific to Burn
        });

        describe("Execute Proposal (Approve ERC20)", function () {
            it("Should execute an Approve proposal after required approvals", async function () {
                const { multisigDAO, erc20DAO, owner, otherAccount1, otherAccount3 } = await loadFixture(deployDAOFactoryFixture);
                const spender = otherAccount3.address;
                const amountToApprove = hre.ethers.parseUnits("200", 18);
                const proposalId = 0;

                // Submit Approve proposal
                await multisigDAO.connect(owner).submitProposal(spender, amountToApprove, Action.Approve, "0x");

                // Approve
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check allowance before execution
                const daoAddress = await multisigDAO.getAddress();
                const allowanceBefore = await erc20DAO.allowance(daoAddress, spender);
                expect(allowanceBefore).to.equal(0);

                // Execute
                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.emit(multisigDAO, "Execute").withArgs(proposalId)
                    .to.emit(erc20DAO, "Approval").withArgs(daoAddress, spender, amountToApprove);

                // Check state and allowance after execution
                const proposal = await multisigDAO.s_proposals(proposalId);
                expect(proposal.isExecuted).to.be.true;
                const allowanceAfter = await erc20DAO.allowance(daoAddress, spender);
                expect(allowanceAfter).to.equal(amountToApprove);
            });

            it("Should execute an Approve proposal with zero value to revoke approval", async function () {
                const { multisigDAO, erc20DAO, owner, otherAccount1, otherAccount3 } = await loadFixture(deployDAOFactoryFixture);
                const spender = otherAccount3.address;
                const initialAmount = hre.ethers.parseUnits("50", 18);
                const zeroAmount = 0n;
                const proposalId0 = 0;
                const proposalId1 = 1;
                const daoAddress = await multisigDAO.getAddress();

                // 1. Submit & execute approval for initialAmount
                await multisigDAO.connect(owner).submitProposal(spender, initialAmount, Action.Approve, "0x");
                await multisigDAO.connect(owner).approveProposal(proposalId0);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId0);
                await multisigDAO.connect(owner).executeProposal(proposalId0);
                expect(await erc20DAO.allowance(daoAddress, spender)).to.equal(initialAmount);

                // 2. Submit & execute approval for zeroAmount
                await multisigDAO.connect(owner).submitProposal(spender, zeroAmount, Action.Approve, "0x");
                await multisigDAO.connect(owner).approveProposal(proposalId1);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId1);

                // Execute second proposal
                await expect(multisigDAO.connect(owner).executeProposal(proposalId1))
                    .to.emit(multisigDAO, "Execute").withArgs(proposalId1)
                    .to.emit(erc20DAO, "Approval").withArgs(daoAddress, spender, zeroAmount);

                // Check final allowance
                expect(await erc20DAO.allowance(daoAddress, spender)).to.equal(zeroAmount);
            });

            // Other execution failure cases covered by Distribute tests
        });

        describe("Execute Proposal (Update Metadata)", function () {
            it("Should execute an UpdateMetadata proposal after required approvals", async function () {
                const { multisigDAO, owner, otherAccount1 } = await loadFixture(deployDAOFactoryFixture);
                const oldMetadata = await multisigDAO.s_metadata();
                const newMetadata = "ipfs://new-metadata-hash-executed";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);
                const proposalId = 0;

                // Submit UpdateMetadata proposal
                await multisigDAO.connect(owner).submitProposal(hre.ethers.ZeroAddress, 0, Action.UpdateMetadata, encodedMetadata);

                // Approve
                await multisigDAO.connect(owner).approveProposal(proposalId);
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check metadata before execution
                expect(await multisigDAO.s_metadata()).to.equal(oldMetadata);

                // Execute
                await expect(multisigDAO.connect(owner).executeProposal(proposalId))
                    .to.emit(multisigDAO, "Execute").withArgs(proposalId)
                    .to.emit(multisigDAO, "MetadataUpdated").withArgs(oldMetadata, newMetadata);

                // Check state and metadata after execution
                const proposal = await multisigDAO.s_proposals(proposalId);
                expect(proposal.isExecuted).to.be.true;
                expect(await multisigDAO.s_metadata()).to.equal(newMetadata);
            });

            // Other execution failure cases covered by Distribute tests
        });

        describe("Proposal List Retrieval", function () {
            it("Should retrieve an empty list when no proposals exist", async function () {
                // Deploy a fresh DAO for this test to ensure no proposals exist
                const { daoFactory, owner, otherAccount1, otherAccount2 } = await loadFixture(deployDAOFactoryFixture);

                const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
                const requiredConfirmations = 2;
                const tx = await daoFactory.createDAO(
                    daoOwners,
                    requiredConfirmations,
                    "Clean DAO",
                    "CDAO",
                    18,
                    hre.ethers.parseUnits("1000", 18),
                    "clean-dao-metadata"
                );
                const receipt = await tx.wait();

                // Extract DAO address from event
                let daoAddress = "";
                if (receipt?.logs) {
                    const daoFactoryInterface = await hre.ethers.getContractFactory("DAOFactory").then(f => f.interface);
                    for (const log of receipt.logs) {
                        try {
                            const parsedLog = daoFactoryInterface.parseLog(log as any);
                            if (parsedLog && parsedLog.name === "Create") {
                                daoAddress = parsedLog.args.daoAddress;
                                break;
                            }
                        } catch (e) { /* Ignore */ }
                    }
                }

                const newDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
                // Get the length of the proposals array - there should be no proposals yet
                // Using length() function if available, or checking if we can access a first element
                try {
                    // Check if proposal at index 0 exists
                    await newDAO.s_proposals(0);
                    // If it reaches here, it means a proposal was found
                    expect.fail("Expected no proposals to exist");
                } catch (error: any) {
                    // Expected to throw if proposal doesn't exist
                    expect(error.message).to.include("reverted");
                }
            });

            it("Should retrieve all proposals that have been submitted", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create multiple proposals of different types
                // Distribute proposal
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("100", 18),
                    Action.Distribute,
                    "0x"
                );

                // Burn proposal
                await multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    hre.ethers.parseUnits("50", 18),
                    Action.Burn,
                    "0x"
                );

                // Approve proposal
                await multisigDAO.connect(owner).submitProposal(
                    otherAccount1.address,
                    hre.ethers.parseUnits("75", 18),
                    Action.Approve,
                    "0x"
                );

                // UpdateMetadata proposal
                const newMetadata = "ipfs://updated-metadata-hash";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);
                await multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    0,
                    Action.UpdateMetadata,
                    encodedMetadata
                );

                // Check that we can retrieve all proposals
                // First check the total count
                let proposalCount = 0;
                // Count manually by accessing each index until we get an error
                let hasMoreProposals = true;
                while (hasMoreProposals) {
                    try {
                        await multisigDAO.s_proposals(proposalCount);
                        proposalCount++;
                    } catch (error: any) {
                        hasMoreProposals = false;
                    }
                }
                expect(proposalCount).to.equal(4);

                // Check each proposal
                for (let i = 0; i < proposalCount; i++) {
                    const proposal = await multisigDAO.s_proposals(i);
                    expect(proposal).to.not.be.undefined;

                    // Verify specific proposal details
                    if (i === 0) {
                        // Distribute proposal
                        expect(proposal.action).to.equal(Action.Distribute);
                        expect(proposal.to).to.equal(recipient.address);
                        expect(proposal.value).to.equal(hre.ethers.parseUnits("100", 18));
                    } else if (i === 1) {
                        // Burn proposal
                        expect(proposal.action).to.equal(Action.Burn);
                        expect(proposal.to).to.equal(hre.ethers.ZeroAddress);
                        expect(proposal.value).to.equal(hre.ethers.parseUnits("50", 18));
                    } else if (i === 2) {
                        // Approve proposal
                        expect(proposal.action).to.equal(Action.Approve);
                        expect(proposal.to).to.equal(otherAccount1.address);
                        expect(proposal.value).to.equal(hre.ethers.parseUnits("75", 18));
                    } else if (i === 3) {
                        // UpdateMetadata proposal
                        expect(proposal.action).to.equal(Action.UpdateMetadata);
                        expect(proposal.to).to.equal(hre.ethers.ZeroAddress);
                        expect(proposal.value).to.equal(0);
                        expect(proposal.data).to.equal(encodedMetadata);
                    }
                }
            });

            it("Should track executed status correctly for proposals", async function () {
                const { multisigDAO, erc20DAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create two proposals
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("10", 18),
                    Action.Distribute,
                    "0x"
                );

                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("20", 18),
                    Action.Distribute,
                    "0x"
                );

                // Approve and execute only the first proposal
                await multisigDAO.connect(owner).approveProposal(0);
                await multisigDAO.connect(otherAccount1).approveProposal(0);
                await multisigDAO.connect(owner).executeProposal(0);

                // Verify executed status for both proposals
                const proposal0 = await multisigDAO.s_proposals(0);
                const proposal1 = await multisigDAO.s_proposals(1);

                expect(proposal0.isExecuted).to.be.true;
                expect(proposal1.isExecuted).to.be.false;
            });

            it("Should allow filtering executed and pending proposals", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create multiple proposals
                for (let i = 0; i < 5; i++) {
                    await multisigDAO.connect(owner).submitProposal(
                        recipient.address,
                        hre.ethers.parseUnits((10 * (i + 1)).toString(), 18),
                        Action.Distribute,
                        "0x"
                    );
                }

                // Execute only proposals with even index
                for (let i = 0; i < 5; i += 2) {
                    await multisigDAO.connect(owner).approveProposal(i);
                    await multisigDAO.connect(otherAccount1).approveProposal(i);
                    await multisigDAO.connect(owner).executeProposal(i);
                }

                // Function to manually filter proposals
                async function filterProposals(executed: boolean) {
                    const result = [];
                    const count = 5; // We know we created 5 proposals

                    for (let i = 0; i < count; i++) {
                        const proposal = await multisigDAO.s_proposals(i);
                        if (proposal.isExecuted === executed) {
                            result.push({
                                id: i,
                                proposal
                            });
                        }
                    }
                    return result;
                }

                // Get executed and pending proposals
                const executedProposals = await filterProposals(true);
                const pendingProposals = await filterProposals(false);

                // Verify our filters
                expect(executedProposals.length).to.equal(3); // 0, 2, 4
                expect(pendingProposals.length).to.equal(2);  // 1, 3

                // Verify specific proposal IDs
                expect(executedProposals.map(p => p.id)).to.deep.equal([0, 2, 4]);
                expect(pendingProposals.map(p => p.id)).to.deep.equal([1, 3]);
            });

            it("Should correctly track and retrieve proposal approvals", async function () {
                const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create a proposal
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("50", 18),
                    Action.Distribute,
                    "0x"
                );
                const proposalId = 0;

                // Check initial proposal details before any approvals
                let details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.proposal.to).to.equal(recipient.address);
                expect(details.proposal.value).to.equal(hre.ethers.parseUnits("50", 18));
                expect(details.proposal.action).to.equal(Action.Distribute);
                expect(details.proposal.isExecuted).to.be.false;
                expect(details.approvalCount).to.equal(0);
                expect(details.isApprovedByCurrentSender).to.be.false;

                // Have the first owner approve
                await multisigDAO.connect(owner).approveProposal(proposalId);

                // Check details after first approval
                details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(1);
                expect(details.isApprovedByCurrentSender).to.be.true;

                // Check from a different owner's perspective
                details = await (multisigDAO.connect(otherAccount1) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(1); // Still 1 approval total
                expect(details.isApprovedByCurrentSender).to.be.false; // But this owner hasn't approved

                // Second owner approves
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check details after second approval
                details = await (multisigDAO.connect(otherAccount2) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(2);
                expect(details.isApprovedByCurrentSender).to.be.false; // Third owner hasn't approved

                // Execute the proposal
                await multisigDAO.connect(owner).executeProposal(proposalId);

                // Check details after execution
                details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.proposal.isExecuted).to.be.true;
                expect(details.approvalCount).to.equal(2); // Approval count unchanged
            });

            it("Should retrieve all proposals with getAllProposals function", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create multiple proposals of different types
                // Distribute proposal
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("100", 18),
                    Action.Distribute,
                    "0x"
                );

                // Burn proposal
                await multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    hre.ethers.parseUnits("50", 18),
                    Action.Burn,
                    "0x"
                );

                // Approve proposal
                await multisigDAO.connect(owner).submitProposal(
                    otherAccount1.address,
                    hre.ethers.parseUnits("75", 18),
                    Action.Approve,
                    "0x"
                );

                // UpdateMetadata proposal
                const newMetadata = "ipfs://updated-metadata-hash";
                const encodedMetadata = hre.ethers.AbiCoder.defaultAbiCoder().encode(["string"], [newMetadata]);
                await multisigDAO.connect(owner).submitProposal(
                    hre.ethers.ZeroAddress,
                    0,
                    Action.UpdateMetadata,
                    encodedMetadata
                );

                // Execute the first proposal
                await multisigDAO.connect(owner).approveProposal(0);
                await multisigDAO.connect(otherAccount1).approveProposal(0);
                await multisigDAO.connect(owner).executeProposal(0);

                // Get all proposals using our new function
                const allProposals = await (multisigDAO as unknown as MultisigDAOExtended).getAllProposals();

                // Verify the number of proposals
                expect(allProposals.length).to.equal(4);

                // Verify specific properties of each proposal
                // Proposal 1 (Distribute) - executed
                expect(allProposals[0].to).to.equal(recipient.address);
                expect(allProposals[0].value).to.equal(hre.ethers.parseUnits("100", 18));
                expect(allProposals[0].action).to.equal(Action.Distribute);
                expect(allProposals[0].isExecuted).to.be.true;

                // Proposal 2 (Burn) - not executed
                expect(allProposals[1].to).to.equal(hre.ethers.ZeroAddress);
                expect(allProposals[1].value).to.equal(hre.ethers.parseUnits("50", 18));
                expect(allProposals[1].action).to.equal(Action.Burn);
                expect(allProposals[1].isExecuted).to.be.false;

                // Proposal 3 (Approve) - not executed
                expect(allProposals[2].to).to.equal(otherAccount1.address);
                expect(allProposals[2].value).to.equal(hre.ethers.parseUnits("75", 18));
                expect(allProposals[2].action).to.equal(Action.Approve);
                expect(allProposals[2].isExecuted).to.be.false;

                // Proposal 4 (UpdateMetadata) - not executed
                expect(allProposals[3].to).to.equal(hre.ethers.ZeroAddress);
                expect(allProposals[3].value).to.equal(0);
                expect(allProposals[3].action).to.equal(Action.UpdateMetadata);
                expect(allProposals[3].data).to.equal(encodedMetadata);
                expect(allProposals[3].isExecuted).to.be.false;
            });

            it("Should return an empty array when no proposals exist", async function () {
                // Deploy a fresh DAO for this test to ensure no proposals exist
                const { daoFactory, owner, otherAccount1, otherAccount2 } = await loadFixture(deployDAOFactoryFixture);

                const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
                const requiredConfirmations = 2;
                const tx = await daoFactory.createDAO(
                    daoOwners,
                    requiredConfirmations,
                    "Empty DAO",
                    "EDAO",
                    18,
                    hre.ethers.parseUnits("1000", 18),
                    "empty-dao-metadata"
                );
                const receipt = await tx.wait();

                // Extract DAO address from event
                let daoAddress = "";
                if (receipt?.logs) {
                    const daoFactoryInterface = await hre.ethers.getContractFactory("DAOFactory").then(f => f.interface);
                    for (const log of receipt.logs) {
                        try {
                            const parsedLog = daoFactoryInterface.parseLog(log as any);
                            if (parsedLog && parsedLog.name === "Create") {
                                daoAddress = parsedLog.args.daoAddress;
                                break;
                            }
                        } catch (e) { /* Ignore */ }
                    }
                }

                const newDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);
                const proposals = await (newDAO as unknown as MultisigDAOExtended).getAllProposals();

                // Verify it's an empty array
                expect(proposals.length).to.equal(0);
            });

            it("Should filter proposals by execution status", async function () {
                const { multisigDAO, owner, otherAccount1, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create 5 proposals
                for (let i = 0; i < 5; i++) {
                    await multisigDAO.connect(owner).submitProposal(
                        recipient.address,
                        hre.ethers.parseUnits((10 * (i + 1)).toString(), 18),
                        Action.Distribute,
                        "0x"
                    );
                }

                // Execute only proposals with even index (0, 2, 4)
                for (let i = 0; i < 5; i += 2) {
                    await multisigDAO.connect(owner).approveProposal(i);
                    await multisigDAO.connect(otherAccount1).approveProposal(i);
                    await multisigDAO.connect(owner).executeProposal(i);
                }

                // Get executed proposals
                const executedProposals = await (multisigDAO as unknown as MultisigDAOExtended).getProposalsByStatus(true);

                // Get pending proposals
                const pendingProposals = await (multisigDAO as unknown as MultisigDAOExtended).getProposalsByStatus(false);

                // Verify counts
                expect(executedProposals.length).to.equal(3); // Proposals 0, 2, 4
                expect(pendingProposals.length).to.equal(2);  // Proposals 1, 3

                // Verify executed proposals are the right ones
                expect(executedProposals[0].value).to.equal(hre.ethers.parseUnits("10", 18)); // First proposal (index 0)
                expect(executedProposals[1].value).to.equal(hre.ethers.parseUnits("30", 18)); // Third proposal (index 2)
                expect(executedProposals[2].value).to.equal(hre.ethers.parseUnits("50", 18)); // Fifth proposal (index 4)

                // Verify pending proposals are the right ones
                expect(pendingProposals[0].value).to.equal(hre.ethers.parseUnits("20", 18)); // Second proposal (index 1)
                expect(pendingProposals[1].value).to.equal(hre.ethers.parseUnits("40", 18)); // Fourth proposal (index 3)

                // Verify all filtered proposals have the correct execution status
                for (const proposal of executedProposals) {
                    expect(proposal.isExecuted).to.be.true;
                }

                for (const proposal of pendingProposals) {
                    expect(proposal.isExecuted).to.be.false;
                }
            });

            it("Should retrieve detailed proposal information with getProposalDetails", async function () {
                const { multisigDAO, owner, otherAccount1, otherAccount2, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Create a proposal
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("50", 18),
                    Action.Distribute,
                    "0x"
                );
                const proposalId = 0;

                // Check initial proposal details before any approvals
                let details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.proposal.to).to.equal(recipient.address);
                expect(details.proposal.value).to.equal(hre.ethers.parseUnits("50", 18));
                expect(details.proposal.action).to.equal(Action.Distribute);
                expect(details.proposal.isExecuted).to.be.false;
                expect(details.approvalCount).to.equal(0);
                expect(details.isApprovedByCurrentSender).to.be.false;

                // Have the first owner approve
                await multisigDAO.connect(owner).approveProposal(proposalId);

                // Check details after first approval
                details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(1);
                expect(details.isApprovedByCurrentSender).to.be.true;

                // Check from a different owner's perspective
                details = await (multisigDAO.connect(otherAccount1) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(1); // Still 1 approval total
                expect(details.isApprovedByCurrentSender).to.be.false; // But this owner hasn't approved

                // Second owner approves
                await multisigDAO.connect(otherAccount1).approveProposal(proposalId);

                // Check details after second approval
                details = await (multisigDAO.connect(otherAccount2) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.approvalCount).to.equal(2);
                expect(details.isApprovedByCurrentSender).to.be.false; // Third owner hasn't approved

                // Execute the proposal
                await multisigDAO.connect(owner).executeProposal(proposalId);

                // Check details after execution
                details = await (multisigDAO.connect(owner) as unknown as MultisigDAOExtended).getProposalDetails(proposalId);
                expect(details.proposal.isExecuted).to.be.true;
                expect(details.approvalCount).to.equal(2); // Approval count unchanged
            });

            it("Should return the list of DAO owners", async function () {
                const { multisigDAO, owner, otherAccount1, otherAccount2 } = await loadFixture(deployDAOFactoryFixture);

                const owners = await (multisigDAO as unknown as MultisigDAOExtended).getOwners();

                // Verify owner count
                expect(owners.length).to.equal(3);

                // Verify specific owners
                expect(owners).to.include(owner.address);
                expect(owners).to.include(otherAccount1.address);
                expect(owners).to.include(otherAccount2.address);

                // Verify non-owner is not included
                const [, , , nonOwner] = await hre.ethers.getSigners();
                expect(owners).to.not.include(nonOwner.address);
            });
        });

        describe("DAO Ownership Management", function () {
            it("Should correctly set initial owners during DAO creation", async function () {
                const { daoFactory, owner, otherAccount1, otherAccount2 } = await loadFixture(deployDAOFactoryFixture);

                const daoOwners = [owner.address, otherAccount1.address, otherAccount2.address];
                const tokenName = "Ownership Test DAO";
                const tokenSymbol = "OTD";

                // Create new DAO
                const tx = await daoFactory.createDAO(
                    daoOwners,
                    2, // Required confirmations
                    tokenName,
                    tokenSymbol,
                    18,
                    hre.ethers.parseUnits("1000", 18),
                    "test-metadata"
                );
                const receipt = await tx.wait();

                // Extract DAO address
                let daoAddress = "";
                if (receipt?.logs) {
                    const daoFactoryInterface = await hre.ethers.getContractFactory("DAOFactory").then(f => f.interface);
                    for (const log of receipt.logs) {
                        try {
                            const parsedLog = daoFactoryInterface.parseLog(log as any);
                            if (parsedLog && parsedLog.name === "Create") {
                                daoAddress = parsedLog.args.daoAddress;
                                break;
                            }
                        } catch (e) { /* Ignore */ }
                    }
                }

                // Get DAO contract
                const multisigDAO = await hre.ethers.getContractAt("MultisigDAO", daoAddress);

                // Verify each owner
                for (const ownerAddress of daoOwners) {
                    expect(await multisigDAO.s_isOwner(ownerAddress)).to.be.true;
                }

                // Verify non-owners
                const [, , , nonOwner] = await hre.ethers.getSigners();
                expect(await multisigDAO.s_isOwner(nonOwner.address)).to.be.false;

                // Verify required confirmations
                expect(await multisigDAO.s_required()).to.equal(2);
            });

            it("Should restrict actions to owners only", async function () {
                const { multisigDAO, owner, otherAccount3, recipient } = await loadFixture(deployDAOFactoryFixture);

                // Try actions with non-owner
                await expect(
                    multisigDAO.connect(otherAccount3).submitProposal(
                        recipient.address,
                        hre.ethers.parseUnits("10", 18),
                        Action.Distribute,
                        "0x"
                    )
                ).to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");

                // Submit with valid owner
                await multisigDAO.connect(owner).submitProposal(
                    recipient.address,
                    hre.ethers.parseUnits("10", 18),
                    Action.Distribute,
                    "0x"
                );

                // Try approve with non-owner
                await expect(
                    multisigDAO.connect(otherAccount3).approveProposal(0)
                ).to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");

                // Try execute with non-owner
                await expect(
                    multisigDAO.connect(otherAccount3).executeProposal(0)
                ).to.be.revertedWithCustomError(multisigDAO, "MultisigDAO_InvalidOwner");
            });
        });
    });
});
