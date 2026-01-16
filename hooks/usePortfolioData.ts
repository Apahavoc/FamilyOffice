import { useTranslation } from 'react-i18next';
import { MOCK_PERFORMANCE_DATA, MOCK_ALLOCATION_DATA, MOCK_PORTFOLIO_HOLDINGS } from '../constants';

export const usePortfolioData = () => {
    const { t } = useTranslation();

    const getKPIs = () => [
        {
            title: t('dashboard.kpis.total_wealth'),
            value: "136.8M €",
            subtext: "+6.5% YTD",
            trend: "+6.5%",
            icon: "dollar" // Icon logic handled in component for now or map string to icon
        },
        {
            title: t('dashboard.kpis.annual_return'),
            value: "8.15%",
            subtext: `vs 6.5% ${t('dashboard.benchmark')}`,
            trend: "+1.65%",
            icon: "trending"
        },
        {
            title: t('dashboard.kpis.liquidity_ratio'),
            value: "13%",
            subtext: `${t('dashboard.target')}: 10-15%`,
            icon: "activity"
        }
    ];

    return {
        performanceData: MOCK_PERFORMANCE_DATA,
        allocationData: MOCK_ALLOCATION_DATA,
        holdings: MOCK_PORTFOLIO_HOLDINGS,
        getKPIs
    };
};
