import {
    MOCK_ALLOCATION_DATA,
    REAL_ESTATE_ASSETS,
    MOCK_PORTFOLIO_HOLDINGS,
    MOCK_PE_FUNDS,
    MOCK_BUSINESS_METRICS,
    MOCK_PASSION_METRICS,
    MOCK_CRYPTO_HOLDINGS,
    MOCK_PHILANTHROPY_PROJECTS,
    MOCK_TREASURY_CASH_FLOW,
    MOCK_RISK_DATA,
    MOCK_EXECUTIVE_SUMMARY,
    MOCK_BENCHMARKS
} from '../constants';

export const getComprehensiveWealthData = (dynamicData: any = {}) => {
    // Aggregating all data into a structured object for the AI
    // We prioritize dynamicData (from Dashboard) over static mocks where possible
    return {
        executiveSummary: MOCK_EXECUTIVE_SUMMARY,
        benchmarks: MOCK_BENCHMARKS,
        allocation: dynamicData.allocation || MOCK_ALLOCATION_DATA,
        totalWealth: dynamicData.totalWealth || "Calculated in UI",
        assets: {
            realEstate: REAL_ESTATE_ASSETS,
            financialPortfolio: MOCK_PORTFOLIO_HOLDINGS,
            privateEquity: MOCK_PE_FUNDS,
            familyBusiness: MOCK_BUSINESS_METRICS,
            passionAssets: MOCK_PASSION_METRICS,
            crypto: MOCK_CRYPTO_HOLDINGS
        },
        treasury: {
            cashFlow: MOCK_TREASURY_CASH_FLOW,
        },
        philanthropy: MOCK_PHILANTHROPY_PROJECTS,
        risk: MOCK_RISK_DATA,
        reportContext: {
            entityName: "NEXUS FAMILY OFFICE",
            period: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
            currency: "EUR",
            ...dynamicData
        }
    };
};
