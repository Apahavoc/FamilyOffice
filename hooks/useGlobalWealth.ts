import { useMemo } from 'react';
import {
    REAL_ESTATE_ASSETS,
    MOCK_PORTFOLIO_HOLDINGS,
    MOCK_PE_FUNDS,
    MOCK_BUSINESS_METRICS,
    MOCK_PASSION_METRICS,
    MOCK_CRYPTO_HOLDINGS
} from '../constants';

export const useGlobalWealth = () => {

    // Helpers to parse currency strings
    const parseCurrency = (val: string | number) => {
        if (typeof val === 'number') return val;
        // Remove €, M, k, spaces
        let clean = val.replace(/[€\s]/g, '').replace(',', '.');
        let multiplier = 1;

        if (clean.includes('M')) {
            multiplier = 1000000;
            clean = clean.replace('M', '');
        } else if (clean.includes('k')) {
            multiplier = 1000;
            clean = clean.replace('k', '');
        }

        // Remove dots that act as thousand separators if no multiplier (e.g. 4.500.000)
        // If it looks like 4.500.000 (Spanish format), remove dots. 
        // Be careful with decimals like 2.4M (which is 2.4 * 1000000).
        // Simple heuristic: if it has multiplier, dots are decimals. If not, dots are thousands.

        if (multiplier === 1 && clean.match(/\./g)?.length && clean.match(/\./g)!.length > 1) {
            clean = clean.replace(/\./g, '');
        } else if (multiplier === 1 && clean.includes('.') && clean.split('.')[1].length === 3) {
            // likely thousand separator
            clean = clean.replace(/\./g, '');
        }

        return parseFloat(clean) * multiplier;
    };

    const wealthData = useMemo(() => {
        // 1. Real Estate
        const realEstateValue = REAL_ESTATE_ASSETS.reduce((acc, asset) => acc + parseCurrency(asset.value), 0);

        // 2. Financial Portfolio (Liquid)
        const portfolioValue = MOCK_PORTFOLIO_HOLDINGS.reduce((acc, asset) => acc + parseCurrency(asset.value), 0);
        // Add some mock cash/treasury not in holdings list but typical
        const treasuryValue = 5000000;

        // 3. Private Equity (NAV = Committed * TVPI roughly, or usually reported directly. Here checking funds logic)
        // Mock data has committed/called, but usually we value at current NAV. 
        // Let's assume NAV = Called * TVPI
        const peValue = MOCK_PE_FUNDS.reduce((acc, fund) => acc + (fund.called * fund.tvpi), 0);

        // 4. Family Business
        const businessValue = MOCK_BUSINESS_METRICS.valuation;

        // 5. Passion Assets
        const passionValue = MOCK_PASSION_METRICS.totalValue;

        // 6. Alternative/Environmental (Carbon Rights mock)
        const environmentalValue = 1200000; // Mock value for that module

        // 7. Crypto Assets
        const cryptoValue = MOCK_CRYPTO_HOLDINGS.reduce((acc, asset) => acc + (asset.amount * asset.price), 0);

        const totalWealth = realEstateValue + portfolioValue + treasuryValue + peValue + businessValue + passionValue + environmentalValue + cryptoValue;

        // --- CALCULATION OF WEIGHTED RETURN ---
        // 1. Real Estate: Avg yield ~5-6% (We'll assume 5.5% for now or parse from constants)
        // 2. Portfolio: ~8-9% (MOCK_PORTFOLIO_HOLDINGS changes are mostly +)
        // 3. PE: Avg IRR ~17.6% (calculated from MOCK_PE_FUNDS)
        // 4. Business: Growth 12.5%
        // 5. Passion: Appreciation 12.5%
        // 6. Treasury: 3.5%
        // 7. Environmental: 5.0%
        // 8. Crypto: ~15% (Conservative estimate for blended YTD)

        const peAvgIrr = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.irr, 0) / MOCK_PE_FUNDS.length;

        const weightedReturn = (
            (realEstateValue * 5.5) +  // Conservative RE yield
            (portfolioValue * 8.5) +   // Portfolio return
            (peValue * peAvgIrr) +     // Private Equity IRR
            (businessValue * MOCK_BUSINESS_METRICS.growth) + // Business Growth
            (passionValue * MOCK_PASSION_METRICS.appreciation) + // Passion Assets
            (treasuryValue * 3.5) +    // Cash yield
            (environmentalValue * 5.0) + // Green bonds/credits yield
            (cryptoValue * 15.0)       // Crypto yield
        ) / totalWealth;


        // --- CALCULATION OF LIQUIDITY RATIO ---
        // Liquidity = Treasury + Liquid Marketable Securities (Stocks, ETFs) + Crypto (Liquid)
        // PE, RE, Business, Passion are illiquid.
        const liquidAssets = treasuryValue + portfolioValue + cryptoValue;
        const liquidityRatio = (liquidAssets / totalWealth) * 100;


        const allocation = [
            { name: 'Negocio Familiar', value: businessValue, color: '#6366f1', route: '/family-business' }, // Indigo
            { name: 'Real Estate', value: realEstateValue, color: '#3b82f6', route: '/real-estate' }, // Blue
            { name: 'Private Equity', value: peValue, color: '#f59e0b', route: '/private-equity' }, // Amber
            { name: 'Mercados Financieros', value: portfolioValue, color: '#10b981', route: '/portfolio' }, // Emerald
            { name: 'Tesorería', value: treasuryValue, color: '#64748b', route: '/treasury' }, // Slate
            { name: 'Pasión y Arte', value: passionValue, color: '#d946ef', route: '/passion-assets' }, // Fuchsia
            { name: 'Criptoactivos', value: cryptoValue, color: '#f97316', route: '/crypto' }, // Orange
            { name: 'Otros (Impacto/Eco)', value: environmentalValue, color: '#06b6d4', route: '/environmental' }, // Cyan
        ].sort((a, b) => b.value - a.value);

        // Calculate percentages
        const allocationWithPct = allocation.map(item => ({
            ...item,
            percent: parseFloat(((item.value / totalWealth) * 100).toFixed(1))
        }));

        return {
            totalWealth,
            allocation: allocationWithPct,
            weightedReturn,
            liquidityRatio,
            // Deep Dive Data (Simulated/Calculated)
            benchmarks: {
                sp500: 12.5, // S&P 500 YTD
                inflation: 3.2, // CPI
                riskFree: 4.5 // US 10Y / Euribor + premium
            },
            history: [ // Simulated evolution for chart
                { year: 2022, wealth: totalWealth * 0.85, return: -5.2 },
                { year: 2023, wealth: totalWealth * 0.92, return: 8.4 },
                { year: 2024, wealth: totalWealth * 0.96, return: 9.1 },
                { year: 2025, wealth: totalWealth, return: weightedReturn }
            ],
            riskMetrics: {
                volatility: 8.4, // Portfolio Volatility
                sharpeRatio: 1.8, // Sharpe
                var: totalWealth * 0.05 // Value at Risk 5%
            }
        };
    }, []);

    return wealthData;
};
