import { REAL_ESTATE_ASSETS } from '../constants';

export const useRealEstateData = () => {
    const getAssets = () => REAL_ESTATE_ASSETS;

    const getSummaryMetrics = () => {
        return {
            totalValue: "10.4M €",
            averageYield: "5.85%",
            occupancyRate: "95%"
        };
    };

    return {
        assets: getAssets(),
        metrics: getSummaryMetrics()
    };
};
