import { BigNumber, ContractTransaction } from 'ethers';
import { ZkBNBProvider } from './provider-interface';
import { PriorityOperationReceipt, TransactionReceipt } from './types';
import { ZkBNBInterface } from './abi';

export class ZkBNBTxError extends Error {
    constructor(message: string, public value: PriorityOperationReceipt | TransactionReceipt) {
        super(message);
    }
}

export class ETHOperation {
    state: 'Sent' | 'Mined' | 'Committed' | 'Verified' | 'Failed';
    error?: ZkBNBTxError;
    priorityOpId?: BigNumber;

    constructor(public ethTx: ContractTransaction, public zkZkBNBProvider: ZkBNBProvider) {
        this.state = 'Sent';
    }

    async awaitEthereumTxCommit() {
        if (this.state !== 'Sent') return;

        const txReceipt = await this.ethTx.wait();
        for (const log of txReceipt.logs) {
            try {
                const priorityQueueLog = ZkBNBInterface.parseLog(log);
                if (priorityQueueLog && priorityQueueLog.args.serialId != null) {
                    this.priorityOpId = priorityQueueLog.args.serialId;
                }
            } catch {
                /* empty */
            }
        }
        if (!this.priorityOpId) {
            throw new Error('Failed to parse tx logs');
        }

        this.state = 'Mined';
        return txReceipt;
    }

    async awaitReceipt(): Promise<PriorityOperationReceipt> {
        this.throwErrorIfFailedState();

        await this.awaitEthereumTxCommit();
        if (this.state !== 'Mined') return;

        let query: number | string;
        if (this.zkZkBNBProvider.providerType === 'RPC') {
            query = this.priorityOpId.toNumber();
        } else {
            query = this.ethTx.hash;
        }
        const receipt = await this.zkZkBNBProvider.notifyPriorityOp(query, 'COMMIT');

        if (!receipt.executed) {
            this.setErrorState(new ZkBNBTxError('Priority operation failed', receipt));
            this.throwErrorIfFailedState();
        }

        this.state = 'Committed';
        return receipt;
    }

    async awaitVerifyReceipt(): Promise<PriorityOperationReceipt> {
        await this.awaitReceipt();
        if (this.state !== 'Committed') return;

        let query: number | string;
        if (this.zkZkBNBProvider.providerType === 'RPC') {
            query = this.priorityOpId.toNumber();
        } else {
            query = this.ethTx.hash;
        }
        const receipt = await this.zkZkBNBProvider.notifyPriorityOp(query, 'VERIFY');

        this.state = 'Verified';

        return receipt;
    }

    private setErrorState(error: ZkBNBTxError) {
        this.state = 'Failed';
        this.error = error;
    }

    private throwErrorIfFailedState() {
        if (this.state === 'Failed') throw this.error;
    }
}
