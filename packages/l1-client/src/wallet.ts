import { ethers } from 'ethers';
import { EthMessageSigner } from './eth-message-signer';
import { Address, EthSignerType } from './types';
import { AbstractWallet } from './abstract-wallet';
import { ZkBNBProvider } from './provider-interface';

export { ETHOperation } from './operations';

export class Wallet extends AbstractWallet {
    protected constructor(
        public _ethSigner: ethers.Signer,
        private _ethMessageSigner: EthMessageSigner,
        cachedAddress: Address
    ) {
        super(cachedAddress);
    }

    // ************
    // Constructors
    //

    static async fromEthSigner(
        ethWallet: ethers.Signer,
        provider: ZkBNBProvider,
        ethSignerType: EthSignerType
    ): Promise<Wallet> {
        const ethMessageSigner = new EthMessageSigner(ethWallet, ethSignerType);
        const wallet = new Wallet(ethWallet, ethMessageSigner, await ethWallet.getAddress());

        wallet.connect(provider);
        await wallet.verifyNetworks();
        return wallet;
    }

    static async fromZkBNBSigner(ethWallet: ethers.Signer, provider: ZkBNBProvider) {
        return await Wallet.fromEthSigner(ethWallet, provider, {
            verificationMethod: 'ERC-1271',
            isSignedMsgPrefixed: true
        });
    }

    // ****************
    // Abstract getters
    //

    override ethSigner(): ethers.Signer {
        return this._ethSigner;
    }

    override ethMessageSigner(): EthMessageSigner {
        return this._ethMessageSigner;
    }
}
