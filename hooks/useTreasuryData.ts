import { MOCK_TREASURY_CASH_FLOW, MOCK_TREASURY_LIQUIDITY } from '../constants';

export const useTreasuryData = () => {
    const cashFlowData = MOCK_TREASURY_CASH_FLOW;
    const liquidityData = MOCK_TREASURY_LIQUIDITY;

    return {
        cashFlowData,
        liquidityData
    };
};
