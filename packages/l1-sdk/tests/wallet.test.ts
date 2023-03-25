import 'dotenv/config';
import { expect } from 'chai';
import { BigNumber, Contract, ethers } from 'ethers';
import { ETHOperation, Wallet } from '../src/wallet';
import { Provider } from '../src/provider';
import { BEP20Interface } from '../src/abi';

describe('Wallet with mock provider', function () {
    const ZERO_ADDRESS = ethers.constants.AddressZero;

    async function getWallet(ethPrivateKey: any): Promise<Wallet> {
        const ethWallet = new ethers.Wallet(
            ethPrivateKey,
            new ethers.providers.JsonRpcProvider(process.env.BSC_TESTNET_RPC || '')
        );
        const provider = await Provider.newHttpProvider(process.env.ZKBNB_PROVIDER_ENDPOINT || '');
        const wallet = await Wallet.fromZkBNBSigner(ethWallet, provider);
        return wallet;
    }

    it('Wallet has valid address', async function () {
        const key = new Uint8Array(new Array(32).fill(5));
        const wallet = await getWallet(key);
        expect(wallet.address()).eq('0xd09Ad14080d4b257a819a4f579b8485Be88f086c', 'Wallet address does not match');
    });

    describe('ZkBNB', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        it('getZkBNBContract', async function () {
            this.timeout(10000);

            const result = await wallet.getZkBNBContract();

            // In the following assertion, you can choose what is present
            // in the contract to determine, here choose commitBlocks
            expect(result).to.have.property('commitBlocks');
        });

        it('getPendingBalance', async function () {
            this.timeout(10000);
            const address = ZERO_ADDRESS;
            const assetAddress = ZERO_ADDRESS;

            const result = await wallet.getPendingBalance(address, assetAddress);
            expect(result).not.null;
            // At the time of writing this unit test, the following result is 0,
            // which can be changed according to your actual situation
            expect(result.eq(BigNumber.from(0))).eq(true);
        });

        it('approveBEP20TokenDeposits', async function () {
            this.timeout(10000);

            // The parameter here should be a contract address that conforms to the erc20 specification
            const address = await wallet.resolveTokenAddress(1);
            const result = await wallet.approveBEP20TokenDeposits(address);
            expect(result).not.null;
            const isApproved = await wallet.isBEP20DepositsApproved(address);
            expect(isApproved).eq(true);
        });

        it('isERC20DepositsApproved', async function () {
            this.timeout(10000);
            const address = await wallet.resolveTokenAddress(1);
            await wallet.isBEP20DepositsApproved(address);
        });

        it('depositBNB', async function () {
            this.timeout(60 * 1000);
            const tokenAddress = await wallet.resolveTokenAddress(0);
            const result = await wallet.deposit({
                to: wallet.address(),
                tokenAddress,
                amount: ethers.utils.parseEther('0.001')
            });

            expect(result instanceof ETHOperation).true;

            const receipt = await result.awaitReceipt();
            expect(receipt).not.null;
        });

        it('depositBEP20', async function () {
            this.timeout(60 * 1000);
            const tokenAddress = await wallet.resolveTokenAddress(1);
            // transfer asset from governor to this test wallet
            const governorWallet = await getWallet(process.env.ZKBNB_GOVERNOR_PRIVATE_KEY);
            const erc20contract = new Contract(tokenAddress, BEP20Interface, governorWallet.ethSigner());
            const amount = ethers.utils.parseEther('0.001');
            const transferResult = await erc20contract.transfer(wallet.address(), amount);
            await transferResult.wait();

            // approveDepositAmountForBEP20 If this option is true, the approval operation will be
            // executed during the recharge process, otherwise it will not be executed
            const result = await wallet.deposit({
                to: wallet.address(),
                tokenAddress,
                amount,
                approveDepositAmountForBEP20: true
            });

            expect(result instanceof ETHOperation).true;

            const receipt = await result.awaitReceipt();
            expect(receipt).not.null;
        });

        it('depositNFT', async function () {
            this.timeout(60 * 1000);

            // you need withdrawal this nft from L2 to your wallet first
            const tokenAddress = wallet.provider.contractAddress.defaultNftFactoryContract;
            const tokenId = 1;
            const result = await wallet.depositNFT({
                to: wallet.address(), // zkbnb contract address
                tokenAddress,
                tokenId,
                approveDepositAllNFT: true
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;

            const receipt = await result.awaitReceipt();
            console.log(receipt);
        });

        it('requestFullExit', async function () {
            this.timeout(10000);

            const tokenAddress = await wallet.resolveTokenAddress(1);
            const result = await wallet.requestFullExit({
                tokenAddress,
                accountIndex: 0
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;
        });

        it('requestFullExitNft', async function () {
            this.timeout(10000);

            // TODO Here the corresponding contract content is not verified
            const result = await wallet.requestFullExitNft({
                tokenId: 1,
                accountIndex: 0
            });

            console.log(result);
            expect(result).not.null;
            expect(result instanceof ETHOperation).true;

            const receipt = await result.awaitReceipt();
            expect(receipt).not.null;
        });

        it('withdrawPendingNFTBalance', async function () {
            // TODO Waiting for perfection
        });

        it('withdrawPendingBalance', async function () {
            // TODO Waiting for perfection
        });

        it('ethMessageSigner', async function () {
            this.timeout(10000);

            const result = await wallet.ethMessageSigner();

            expect(result).not.null;
        });
    });

    describe('Governance', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        it('query assetAddresses by assetId', async function () {
            this.timeout(10000);
            let assetAddress = await wallet.resolveTokenAddress(1);
            console.log(assetAddress);
            assetAddress = await wallet.resolveTokenAddress(2);
            console.log(assetAddress);
            assetAddress = await wallet.resolveTokenAddress(3);
            console.log(assetAddress);
            expect(assetAddress).not.null;
            expect(assetAddress).not.eq(ZERO_ADDRESS);
        });

        it('query assetId by assetAddress', async function () {
            this.timeout(10000);
            // The following token address can be retrieved from getAssetAddressByAssetId
            const assetAddress = await wallet.resolveTokenAddress(1);
            const assetId = await wallet.resolveTokenId(assetAddress);
            expect(assetId).not.null;
            expect(assetId).eq(1);
        });

        it('query nftFactory', async function () {
            this.timeout(10000);
            // Since the following address must not exist, the default factory address will be returned
            const nftFactory = await wallet.getNFTFactory('0x2fE6e6b5A084fEcd0A5cC109F7d5B5bbE9f0fE54', 1);
            expect(nftFactory).not.null;
            expect(nftFactory).not.eq(ZERO_ADDRESS);
        });

        it('query nft token uri', async function () {
            this.timeout(10000);
            // Since getNftTokenURI gets its result by calculation, the return result remains the same if the parameters remain the same here
            const tokenUri = await wallet.getNftTokenURI(0, ethers.utils.formatBytes32String('mock hash'));
            expect(tokenUri).eq('ipfs://f017012206d6f636b20686173680000000000000000000000000000000000000000000000');
        });

        it('validateAssetAddress', async function () {
            this.timeout(10000);
            // The following address can be retrieved from getAssetAddressByAssetId
            const address = await wallet.resolveTokenAddress(1);
            const assetId = await wallet.validateAssetAddress(address);

            expect(assetId).eq(1);
        });

        it('deployAndRegisterNFTFactory', async function () {
            async function getUnusedCollectionId(): Promise<number> {
                const collectionId = Math.ceil(10000 * Math.random());
                const factoryAddress = await wallet.getNFTFactory(wallet.address(), collectionId);
                if (factoryAddress === wallet.provider.contractAddress.defaultNftFactoryContract) {
                    return collectionId;
                }
                return getUnusedCollectionId();
            }

            const name = 'testFactory';
            const symbol = 'tf';
            let collectionId = await getUnusedCollectionId();
            await wallet.deployAndRegisterNFTFactory({
                collectionId,
                name,
                symbol
            });

            // factoryAddress get method: deployAndRegisterNFTFactory after execution,
            // by 'query nftFactory' unit test code to get
            const factoryAddress = await wallet.getNFTFactory(wallet.address(), collectionId);
            // Just select a collectionId that does not exist
            collectionId = await getUnusedCollectionId();
            await wallet.registerNFTFactory({ collectionId, factoryAddress });
        });
    });

    describe('assetGovernance', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        it('addAsset', async function () {
            // query token lister
            const canAdd = await wallet.isTokenLister(ZERO_ADDRESS);
            const tokenAddress = '0xba4e41cA7C970b1F463e836dEF0E4259344bAAA1'; // change to the token address
            let isAdded;
            try {
                await wallet.resolveTokenId(tokenAddress);
                isAdded = true;
            } catch (e) {
                isAdded = false;
            }
            if (canAdd && !isAdded) {
                await wallet.addAsset({ tokenAddress });
            }
        });
    });
});
