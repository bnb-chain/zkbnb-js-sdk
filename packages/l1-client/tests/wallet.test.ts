import 'dotenv/config';
import { expect } from 'chai';
import { ethers } from 'ethers';
import { Wallet } from '../src/wallet';
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

        beforeEach(async function() {
            console.log((process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0]);
            const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
            wallet = await getWallet(privateKey);
        })

        it('depositToL2', async function () {
            this.timeout(10000);

            const result = await wallet.depositToL2({
                to: '0xa7F23Ad2b0473Bd05012753624eDD77B4CAcdfa3',
                tokenAddress: 'ETH',
                amount: ethers.utils.parseEther('0.001')
            });
            console.log(result);
        });

        it('depositNFTToL2', async function () {
            this.timeout(10000);

            const result = await wallet.depositNFTToL2({
                to: '0xa7F23Ad2b0473Bd05012753624eDD77B4CAcdfa3',
                tokenAddress: '0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0',
                tokenId: 247070
            });
            console.log(result);
        });

        it('requestFullExit', async function() {
            this.timeout(10000);

            const result = await wallet.requestFullExit({
                tokenAddress: '0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0',
                accountIndex: 0,
            });

            console.log(result);
        })

        it('requestFullExitNft', async function() {
            this.timeout(10000);

            const result = await wallet.requestFullExitNft({
                tokenId: 247070,
                accountIndex: 0,
            });

            console.log(result);
        })

        it('ethMessageSigner', async function() {
            this.timeout(10000);

            const result = await wallet.ethMessageSigner();

            console.log(result);
        })

        it('approveERC20TokenDeposits', async function() {
            this.timeout(10000);

            const result = await wallet.approveERC20TokenDeposits('0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0');

            console.log(result);
        })

        it('isERC20DepositsApproved', async function() {
            this.timeout(10000);

            const result = await wallet.isERC20DepositsApproved('0x587f2b09b12e81b1fcbe4fbf652c92fe4ca392f0');

            console.log(result);
        })

        it('getZkBNBContract', async function() {
            this.timeout(10000);

            const result = await wallet.getZkBNBContract();


        })
    })
});
