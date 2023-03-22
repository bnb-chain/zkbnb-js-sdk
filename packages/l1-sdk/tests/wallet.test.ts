import 'dotenv/config';
import { expect } from 'chai';
import { ethers } from 'ethers';
import { ETHOperation, Wallet } from '../src/wallet';
import { getZkBNBDefaultProvider } from '../src/provider';

describe('Wallet with mock provider', function () {
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

    describe('wallet methods', function () {
        let wallet: Wallet;

        beforeEach(async function () {
            console.log((process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0]);
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        });

        it('approveERC20TokenDeposits', async function () {
            this.timeout(10000);

            // TODO 不确定这里是不是这个地址，我是从 /api/v1/layer2BasicInfo 拿的 zkbnbContract
            const result = await wallet.approveERC20TokenDeposits('0x1ecb4fa9ff17835a10485350a05f53668783383a');

            expect(result).not.null;
        });

        it('isERC20DepositsApproved', async function () {
            this.timeout(10000);

            // TODO 有错误
            const result = await wallet.isERC20DepositsApproved('0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0');

            expect(result).not.null;
        });

        it('deposit', async function () {
            this.timeout(10000);

            const result = await wallet.deposit({
                to: '0xa7F23Ad2b0473Bd05012753624eDD77B4CAcdfa3',
                tokenAddress: 'ETH',
                amount: ethers.utils.parseEther('0.001')
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;
        });

        it('depositNFT', async function () {
            this.timeout(60 * 1000);

            // TODO 现在是这里有问题，前面的 deposit 暂时没有管他，先测的充值 nft 的
            await wallet.approveERC20TokenDeposits('0x1ecb4fa9ff17835a10485350a05f53668783383a');

            const result = await wallet.depositNFT({
                to: '0x8fC70c416ccd3344229192120c62EB117444C411',
                tokenAddress: '0x1ecb4fa9ff17835a10485350a05f53668783383a',
                tokenId: 45
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;

            const receipt = await result.awaitReceipt();
            console.log(receipt);
        });

        it('requestFullExit', async function () {
            this.timeout(10000);

            const result = await wallet.requestFullExit({
                tokenAddress: '0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0',
                accountIndex: 0
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;
        });

        it('requestFullExitNft', async function () {
            this.timeout(10000);

            const result = await wallet.requestFullExitNft({
                tokenId: 247070,
                accountIndex: 0
            });

            expect(result).not.null;
            expect(result instanceof ETHOperation).true;
        });

        it('ethMessageSigner', async function () {
            this.timeout(10000);

            const result = await wallet.ethMessageSigner();

            expect(result).not.null;
        });

        it('getZkBNBContract', async function () {
            this.timeout(10000);

            const result = await wallet.getZkBNBContract();

            // In the following assertion, you can choose what is present
            // in the contract to determine, here choose commitBlocks
            expect(result).to.have.property('commitBlocks');
        });
    });
});
