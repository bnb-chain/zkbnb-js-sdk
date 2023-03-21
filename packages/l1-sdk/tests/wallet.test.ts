import 'dotenv/config';
import { expect } from 'chai';
import { BigNumber, ethers } from 'ethers';
import { Wallet } from '../src/wallet';
import { getZkBNBDefaultProvider } from '../src/provider';
import { parseEther } from '@ethersproject/units/src.ts';

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

    it('depositToL2', async function () {
        console.log((process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0]);
        const privateKey = (process.env.BSC_TESTNET_PRIVATE_KEY || '').split(',')[0];
        const wallet = await getWallet(privateKey);
        const result = await wallet.depositToL2({
            to: '0xa7F23Ad2b0473Bd05012753624eDD77B4CAcdfa3',
            tokenAddress: 'ETH',
            amount: ethers.utils.parseEther('0.001')
        });
        console.log(result);
    });
});
