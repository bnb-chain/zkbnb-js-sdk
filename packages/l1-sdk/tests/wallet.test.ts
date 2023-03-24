import 'dotenv/config';
import { expect } from 'chai';
import { BigNumber, ethers } from 'ethers';
import { ETHOperation, Wallet } from '../src/wallet';
import { getZkBNBDefaultProvider } from '../src/provider';

describe('Wallet with mock provider', function () {
    const ZERO_ADDRESS = ethers.constants.AddressZero;
    async function getWallet(ethPrivateKey: any): Promise<Wallet> {
        const ethWallet = new ethers.Wallet(
            ethPrivateKey,
            new ethers.providers.JsonRpcProvider(process.env.BSC_TESTNET_RPC || '')
        );
        const provider = await getZkBNBDefaultProvider('bscTestnet');
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

        describe('wallet methods', function () {
            describe('query basic information methods', function () {
                it('getZkBNBContract', async function () {
                    this.timeout(10000);

                    const result = await wallet.getZkBNBContract();

                    // In the following assertion, you can choose what is present
                    // in the contract to determine, here choose commitBlocks
                    expect(result).to.have.property('commitBlocks');
                });

                it('getPendingBalance', async function () {
                    this.timeout(10000);
                    const address = '0x2fE6e6b5A084fEcd0A5cC109F7d5B5bbE9f0fE54';
                    const assetAddress = '0x6E08fbE52Fe5374083E9F7Fab41737DF630946f0';

                    const result = await wallet.getPendingBalance(address, assetAddress);
                    expect(result).not.null;
                    // At the time of writing this unit test, the following result is 0,
                    // which can be changed according to your actual situation
                    expect(result.eq(BigNumber.from(0))).eq(true);
                });
            });

            describe('trading related methods', function () {
                it('approveERC20TokenDeposits', async function () {
                    this.timeout(10000);

                    // The parameter here should be a contract address that conforms to the erc20 specification
                    const result = await wallet.approveERC20TokenDeposits('0xcB218E49D71fd8B89076cB9269299E0D449BfbdE');
                    expect(result).not.null;
                });

                it('isERC20DepositsApproved', async function () {
                    this.timeout(10000);

                    const result = await wallet.isERC20DepositsApproved('0xcB218E49D71fd8B89076cB9269299E0D449BfbdE');
                    expect(result).not.null;
                    expect(result).eq(true);
                });

                it('deposit', async function () {
                    this.timeout(60 * 1000);

                    // approveDepositAmountForERC20 If this option is true, the approve operation will be
                    // executed during the recharge process, otherwise it will not be executed
                    const result = await wallet.deposit({
                        to: '0x8fC70c416ccd3344229192120c62EB117444C411',
                        tokenAddress: '0x45912B407438816819C150840Cc82b4588329266',
                        amount: ethers.utils.parseEther('0.001'),
                        approveDepositAmountForERC20: true
                    });

                    expect(result).not.null;
                    expect(result instanceof ETHOperation).true;

                    const receipt = await result.awaitReceipt();
                    expect(receipt).not.null;
                });

                it('depositNFT', async function () {
                    this.timeout(60 * 1000);

                    // TODO
                    const result = await wallet.depositNFT({
                        // to: '0x8fC70c416ccd3344229192120c62EB117444C411', // Another test account
                        to: '0xbD283e6Db5E817eAaC8fd7C2847199ebb2951f4a', // zkbnb contract address
                        tokenAddress: '0xba4e41cA7C970b1F463e836dEF0E4259344bAAA1',
                        tokenId: 4,
                        approveDepositNFT: true,
                    });

                    expect(result).not.null;
                    expect(result instanceof ETHOperation).true;

                    const receipt = await result.awaitReceipt();
                    console.log(receipt);
                });

                it('requestFullExit', async function () {
                    this.timeout(10000);

                    const result = await wallet.requestFullExit({
                        tokenAddress: '0xcB218E49D71fd8B89076cB9269299E0D449BfbdE',
                        accountIndex: 0
                    });

                    expect(result).not.null;
                    expect(result instanceof ETHOperation).true;
                });

                it('requestFullExitNft', async function () {
                    this.timeout(10000);

                    // TODO Here the corresponding contract content is not verified
                    const result = await wallet.requestFullExitNft({
                        tokenId: 45,
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
        });
    });

    describe('Governance', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        describe('query', function () {
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
                const token = '0xcB218E49D71fd8B89076cB9269299E0D449BfbdE';
                const assetId = await wallet.resolveTokenId(token);
                expect(assetId).not.null;
                expect(assetId > 0).eq(true);
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
                const tokenUri = await wallet.getNftTokenURI(1, ethers.utils.formatBytes32String('mock hash'));
                expect(tokenUri).eq('6d6f636b20686173680000000000000000000000000000000000000000000000');
            });

            it('validateAssetAddress', async function () {
                this.timeout(10000);
                // The following address can be retrieved from getAssetAddressByAssetId
                const address = '0xcB218E49D71fd8B89076cB9269299E0D449BfbdE';
                const assetId = await wallet.validateAssetAddress(address);

                expect(assetId).not.null;
                expect(assetId > 0).eq(true);
            });
        });

        describe('modify', function() {
            it('deployAndRegisterNFTFactory', async function () {
                const collectionId = 1;
                const name = 'testFactory';
                const symbol = 'tf';
                await wallet.deployAndRegisterNFTFactory(collectionId, name, symbol);
            })

            it('registerNFTFactory', async function() {
                // Just select a collectionId that does not exist
                const collectionId = 2;
                // factoryAddress get method: deployAndRegisterNFTFactory after execution,
                // by 'query nftFactory' unit test code to get
                const factoryAddress = '0x4f7821Fda15854760952E778e56A79f797B0573F';
                await wallet.registerNFTFactory(collectionId, factoryAddress);
            })
        })
    });

    describe('defaultNFTFactory', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        describe('query', function () {
            it('resolve creator', async function () {
                this.timeout(10000);
                const creator = await wallet.resolveCreator(1);

                // Because mintFromZkBNB needs to be called by zkbnb to generate
                // the information corresponding to the tokenId, this case is written
                // without filling the information, so it returns 0 address
                expect(creator).eq(ZERO_ADDRESS);
            });

            it('resolve tokenURI', async function() {
                this.timeout(10000);

                const tokenURI = await wallet.resolveTokenURI(1);
                expect(tokenURI).not.null;
            })
        });
    });

    describe('assetGovernance', function() {

        let wallet: Wallet;

        beforeEach(async function () {
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        describe('modify', function () {
            it('addAsset', async function() {
                const assetAddress = '0xba4e41cA7C970b1F463e836dEF0E4259344bAAA1';
                await wallet.addAsset(assetAddress);
            })
        })
    })
});
