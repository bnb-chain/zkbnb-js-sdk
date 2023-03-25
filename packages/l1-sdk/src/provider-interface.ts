import { ContractAddress, PriorityOperationReceipt, Network } from './types';

export abstract class ZkBNBProvider {
  contractAddress: ContractAddress;
  public providerType: 'RPC' | 'HTTP';
  // For HTTP provider
  public network?: Network;

  abstract notifyPriorityOp(
    hashOrSerialId: string | number,
    action: 'COMMIT' | 'VERIFY'
  ): Promise<PriorityOperationReceipt>;
  abstract disconnect();
}
