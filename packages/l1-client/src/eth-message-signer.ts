import * as ethers from 'ethers';
import { TxEthSignature, EthSignerType } from './types';
import { getSignedBytesFromMessage, signMessagePersonalAPI } from './utils';

/**
 * Wrapper around `ethers.Signer` which provides convenient methods to get and sign messages required for zkBNB.
 */
export class EthMessageSigner {
    constructor(private ethSigner: ethers.Signer, private ethSignerType?: EthSignerType) {}

    async getEthMessageSignature(message: ethers.utils.BytesLike): Promise<TxEthSignature> {
        if (this.ethSignerType == null) {
            throw new Error('ethSignerType is unknown');
        }

        const signedBytes = getSignedBytesFromMessage(message, !this.ethSignerType.isSignedMsgPrefixed);
        const signature = await signMessagePersonalAPI(this.ethSigner, signedBytes);

        return {
            type: this.ethSignerType.verificationMethod === 'ECDSA' ? 'EthereumSignature' : 'EIP1271Signature',
            signature
        };
    }
}
