import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ERC20Factory", function () {

    async function deployFixture() {
        const ERC20Factory = await hre.ethers.getContractFactory("ERC20Factory");
        const erc20Factory = await ERC20Factory.deploy();
        return { erc20Factory };
    }

    describe("Deployment", function () {
        it("Should deploy ERC20Factory", async function () {
            const { erc20Factory } = await loadFixture(deployFixture);
            expect(await erc20Factory.getAddress()).to.be.properAddress;
        });
    });

    describe("Mint ERC20", function () {
        it("Should allow anyone to mint a new ERC20 token", async function () {
            const { erc20Factory } = await loadFixture(deployFixture);
            const [owner, otherAccount] = await hre.ethers.getSigners();

            const tokenName = "My Test Token";
            const tokenSymbol = "MTT";
            const tokenDecimals = 18; // Standard, though not set in constructor
            const tokenInitialSupply = hre.ethers.parseUnits("10000", tokenDecimals);

            // Call mintERC20 from the owner account
            const tx = await erc20Factory.connect(owner).mintERC20(
                tokenName,
                tokenSymbol,
                tokenInitialSupply
            );
            const receipt = await tx.wait();

            // Find the emitted event to get the token address
            let tokenAddress = "";
            let ownerAddress = "";
            let amountEmitted = 0n;
            if (receipt?.logs) {
                const erc20FactoryInterface = await hre.ethers.getContractFactory("ERC20Factory").then(f => f.interface);
                for (const log of receipt.logs) {
                    try {
                        const parsedLog = erc20FactoryInterface.parseLog(log as any);
                        if (parsedLog && parsedLog.name === "Create") {
                            ownerAddress = parsedLog.args.owner;
                            tokenAddress = parsedLog.args.token;
                            amountEmitted = parsedLog.args.supply;
                            break;
                        }
                    } catch (e) { /* Ignore */ }
                }
            }

            expect(tokenAddress).to.be.properAddress;
            expect(ownerAddress).to.equal(owner.address);
            expect(amountEmitted).to.equal(tokenInitialSupply);

            // Verify factory state
            const allTokens = await erc20Factory.getListOfERC20Created();
            const ownerTokens = await erc20Factory.getListOfERC20(owner.address);
            expect(allTokens).to.include(tokenAddress);
            expect(ownerTokens).to.include(tokenAddress);
            expect(await erc20Factory.getOwnerOfERC20(tokenAddress)).to.equal(owner.address);

            // Verify deployed ERC20Template token state
            const erc20Token = await hre.ethers.getContractAt("ERC20Template", tokenAddress);
            expect(await erc20Token.name()).to.equal(tokenName);
            expect(await erc20Token.symbol()).to.equal(tokenSymbol);
            expect(await erc20Token.decimals()).to.equal(tokenDecimals);
            expect(await erc20Token.totalSupply()).to.equal(tokenInitialSupply);
            expect(await erc20Token.owner()).to.equal(owner.address); // Minter owns the token
            expect(await erc20Token.balanceOf(owner.address)).to.equal(tokenInitialSupply);
        });

        it("Should allow different users to mint tokens", async function () {
            const { erc20Factory } = await loadFixture(deployFixture);
            const [owner, otherAccount] = await hre.ethers.getSigners();

            // Owner mints
            await erc20Factory.connect(owner).mintERC20("Token A", "TKA", hre.ethers.parseUnits("100", 18));
            const ownerTokensBefore = await erc20Factory.getListOfERC20(owner.address);
            const otherTokensBefore = await erc20Factory.getListOfERC20(otherAccount.address);
            const allTokensBefore = await erc20Factory.getListOfERC20Created();
            expect(ownerTokensBefore.length).to.equal(1);
            expect(otherTokensBefore.length).to.equal(0);

            // OtherAccount mints
            await erc20Factory.connect(otherAccount).mintERC20("Token B", "TKB", hre.ethers.parseUnits("200", 18));
            const ownerTokensAfter = await erc20Factory.getListOfERC20(owner.address);
            const otherTokensAfter = await erc20Factory.getListOfERC20(otherAccount.address);
            const allTokensAfter = await erc20Factory.getListOfERC20Created();

            expect(ownerTokensAfter.length).to.equal(1);
            expect(otherTokensAfter.length).to.equal(1);
            expect(allTokensAfter.length).to.equal(2);

            const tokenBAddress = otherTokensAfter[0];
            expect(await erc20Factory.getOwnerOfERC20(tokenBAddress)).to.equal(otherAccount.address);
        });
    });
});
