import { ethers, utils } from 'ethers';

export const ZkBNBInterface = new ethers.utils.Interface(require('./ZkBNB.json'));
export const AssetGovernanceInterface = new ethers.utils.Interface(require('./AssetGovernance.json'));
export const GovernanceInterface = new ethers.utils.Interface(require('./Governance.json'));
export const ZkBNBNFTFactoryInterface = new ethers.utils.Interface(require('./ZkBNBNFTFactory.json'));

export const IERC20_INTERFACE = new utils.Interface(require('./IERC20.json'));
