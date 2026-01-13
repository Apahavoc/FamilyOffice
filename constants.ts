import { AssetData, PerformanceData, RealEstateAsset } from './types';

export const APP_NAME = "NEXUS FAMILY OFFICE";
export const USER_NAME = "Oscar Ocampo";
export const USER_ROLE = "Responsable de Gestión";

export const MOCK_PERFORMANCE_DATA: PerformanceData[] = [
  { month: 'Ene', portfolio: 23.5, benchmark: 23.2 },
  { month: 'Feb', portfolio: 23.8, benchmark: 23.4 },
  { month: 'Mar', portfolio: 24.1, benchmark: 23.6 },
  { month: 'Abr', portfolio: 23.9, benchmark: 23.8 },
  { month: 'May', portfolio: 24.2, benchmark: 24.0 },
  { month: 'Jun', portfolio: 24.5, benchmark: 24.1 },
];

export const MOCK_ALLOCATION_DATA: AssetData[] = [
  { name: 'Inmobiliario', value: 45 },
  { name: 'Renta Variable', value: 25 },
  { name: 'Private Equity', value: 15 },
  { name: 'Renta Fija', value: 10 },
  { name: 'Liquidez', value: 5 },
];

export const ALLOCATION_COLORS = ['#6366f1', '#3b82f6', '#0ea5e9', '#94a3b8', '#cbd5e1'];

export const REAL_ESTATE_ASSETS: RealEstateAsset[] = [
  {
    id: '1',
    name: "Edificio Oficinas Castellón Centro",
    value: "4.500.000 €",
    yield: "5.2%",
    status: 'Occupado',
    occupancy: 100,
    location: "Castellón, ES"
  },
  {
    id: '2',
    name: "Nave Logística Vila-real",
    value: "2.100.000 €",
    yield: "6.8%",
    status: 'Occupado',
    occupancy: 90,
    location: "Vila-real, ES"
  },
  {
    id: '3',
    name: "Promoción Residencial Playa",
    value: "3.800.000 €",
    yield: "--",
    status: 'En Construcción',
    occupancy: 0,
    location: "Benicàssim, ES"
  }
];

export const MOCK_PORTFOLIO_HOLDINGS = [
  { ticker: "SPY", name: "S&P 500 ETF Trust", type: "ETF", value: "2.4M €", change: "+1.2%" },
  { ticker: "MSFT", name: "Microsoft Corp", type: "Equity", value: "1.8M €", change: "+0.8%" },
  { ticker: "V", name: "Visa Inc.", type: "Equity", value: "950k €", change: "-0.3%" },
  { ticker: "BRK.B", name: "Berkshire Hathaway", type: "Equity", value: "1.1M €", change: "+0.5%" },
];
