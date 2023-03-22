/*
 * @Description provider
 * @Author: rain.z
 * @Date: 2023/3/17 09:55
 */
import 'dotenv/config';
import { Provider, getZkBNBDefaultProvider } from '../src/provider';
import { expect } from 'chai';

describe('Provide test', () => {
    describe('get zkBnb default provider', function () {
        const network = 'bscTestnet'; // The options here are bscTestnet or bsc

        it('pollIntervalMilliSecs uses the default value', async () => {
            const provider = await getZkBNBDefaultProvider(network);
            expect(provider).to.be.not.null;
        });

        it(' pollIntervalMilliSecs uses custom values', async () => {
            const pollIntervalMilliSecs = 2000;
            const provider = await getZkBNBDefaultProvider(network, pollIntervalMilliSecs);
            expect(provider).to.be.not.null;
        });
    });

    describe('commonly used methods', function () {
        const network = 'bscTestnet';
        let provider: Provider;

        beforeEach(async function () {
            provider = await getZkBNBDefaultProvider(network);
        });

        it('getContractAddress', async function () {
            const contractAddress = await provider.getContractAddress();
            expect(contractAddress).to.have.property('zkBNBContract');
            expect(contractAddress).to.have.property('governanceContract');
            expect(contractAddress).to.have.property('defaultNftFactory');
            expect(contractAddress).to.have.property('assetGovernanceContract');
        });
    });
});
