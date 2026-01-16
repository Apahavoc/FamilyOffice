import { AssetData, PerformanceData, RealEstateAsset, PortfolioHolding } from './types';

export const APP_NAME = "NEXUS FAMILY OFFICE";
export const USER_NAME = "Oscar Ocampo";
export const USER_ROLE = "Responsable de Gestión";

export const MOCK_PERFORMANCE_DATA: PerformanceData[] = [
  { month: 'Ene', portfolio: 128.5, benchmark: 125.0 },
  { month: 'Feb', portfolio: 130.2, benchmark: 126.5 },
  { month: 'Mar', portfolio: 132.8, benchmark: 128.0 },
  { month: 'Abr', portfolio: 133.5, benchmark: 129.5 },
  { month: 'May', portfolio: 135.2, benchmark: 131.0 },
  { month: 'Jun', portfolio: 136.2, benchmark: 132.5 }, // Matches calculated Total Wealth
];

// --- NEW EXECUTIVE DATA LAYERS ---

export const MOCK_EXECUTIVE_SUMMARY = {
  totalAUM: 136200000,
  ytdReturn: 8.5,
  prevYearReturn: 12.4,
  volatility: 6.2,
  sharpeRatio: 1.8,
  topMovers: [
    { name: "Private Equity (KKR)", change: "+14.5%", impact: "high_positive" },
    { name: "Bitcoin (BTC)", change: "+12.5%", impact: "positive" },
    { name: "Castellón Office", change: "-2.1%", impact: "negative" }
  ],
  alerts: [
    { type: "liquidity", message: "Cash Buffer < 6 Months", severity: "high" },
    { type: "compliance", message: "ESG Audit Pending", severity: "medium" }
  ]
};

export const MOCK_BENCHMARKS = {
  sp500: { name: "S&P 500", ytd: 12.4, color: "#3b82f6" },
  msci_world: { name: "MSCI World", ytd: 9.8, color: "#6366f1" },
  inflation: { name: "IPC Eurozone", ytd: 3.2, color: "#f59e0b" },
  risk_free: { name: "Euribor 3M", ytd: 3.8, color: "#94a3b8" }
};

export const MOCK_FEES_STRUCTURE = [
  { assetClass: "Renta Variable (ETFs)", mgmtFee: 0.15, perfFee: 0, totalCost: 12500 },
  { assetClass: "Private Equity", mgmtFee: 2.0, perfFee: 20, totalCost: 240000 },
  { assetClass: "Real Estate", mgmtFee: 1.5, perfFee: 0, totalCost: 156000 },
  { assetClass: "Hedge Funds", mgmtFee: 1.8, perfFee: 15, totalCost: 85000 },
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
    location: "Castellón, ES",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '2',
    name: "Nave Logística Vila-real",
    value: "2.100.000 €",
    yield: "6.8%",
    status: 'Occupado',
    occupancy: 90,
    location: "Vila-real, ES",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: '3',
    name: "Promoción Residencial Playa",
    value: "3.800.000 €",
    yield: "--",
    status: 'En Construcción',
    occupancy: 0,
    location: "Benicàssim, ES",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
  }
];

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { ticker: "SPY", name: "S&P 500 ETF Trust", type: "ETF", value: "2.4M €", change: "+1.2%" },
  { ticker: "MSFT", name: "Microsoft Corp", type: "Equity", value: "1.8M €", change: "+0.8%" },
  { ticker: "V", name: "Visa Inc.", type: "Equity", value: "950k €", change: "-0.3%" },
  { ticker: "BRK.B", name: "Berkshire Hathaway", type: "Equity", value: "1.1M €", change: "+0.5%" },
];

export const MOCK_PE_CAPITAL_CALLS = [
  { fund: "Blackstone RE X", date: "Q1 2026", amount: 1500000, status: "Confirmed" },
  { fund: "KKR NA XIII", date: "Q2 2026", amount: 500000, status: "Estimated" },
  { fund: "Carlyle Europe V", date: "Q3 2026", amount: 250000, status: "Projected" },
];

export const MOCK_RE_OPERATING_DATA = [
  { id: '1', name: "Edificio Castellón", noi: 234000, capRate: 5.2, leaseExpiry: "2028" },
  { id: '2', name: "Nave Vila-real", noi: 142800, capRate: 6.8, leaseExpiry: "2030" },
  { id: '3', name: "Residencial Playa", noi: 0, capRate: 0, leaseExpiry: "N/A" }, // Development
];


export const MOCK_PE_FUNDS = [
  { name: 'Blackstone Real Estate Partners X', vintage: 2023, committed: 5000000, called: 1500000, tvpi: 1.15, irr: 12.5 },
  { name: 'KKR North America Fund XIII', vintage: 2022, committed: 3000000, called: 2800000, tvpi: 1.35, irr: 18.2 },
  { name: 'Sequoia Capital Global Growth', vintage: 2021, committed: 2000000, called: 1800000, tvpi: 1.60, irr: 24.0 },
  { name: 'Carlyle Europe Partners V', vintage: 2020, committed: 4000000, called: 4000000, tvpi: 1.45, irr: 15.8 },
];

export const MOCK_BUSINESS_METRICS = {
  revenue: 45000000,
  ebitda: 12000000,
  netMargin: 18.5,
  valuation: 96000000, // 8x EBITDA
  employees: 340,
  growth: 12.5,
  sector: "Industrial Manufacturing"
};

export const MOCK_PASSION_METRICS = {
  totalValue: 3200000,
  appreciation: 12.5,
  items: 14
};

export const PASSION_PORTFOLIO = [
  {
    id: 1,
    name: "Porsche 911 Carrera RS 2.7",
    category: "vintage_cars",
    value: 850000,
    trend: "+15%",
    image: "/assets/porsche_911.png"
  },
  {
    id: 2,
    name: "Patek Philippe Nautilus",
    category: "watches",
    value: 120000,
    trend: "+8%",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Basquiat - Untitled (1982)",
    category: "art",
    value: 1800000,
    trend: "+22%",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Château Pétrus 1989",
    category: "wine",
    value: 45000,
    trend: "+5%",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
  }
];

export const MOCK_CRYPTO_HOLDINGS = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', amount: 12.5, price: 95400, change: '+12.5%', allocation: 55 },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', amount: 150, price: 3350, change: '+8.2%', allocation: 25 },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', amount: 2500, price: 145, change: '+25.4%', allocation: 10 },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP', amount: 60000, price: 2.15, change: '+18.7%', allocation: 10 },
];

export const MOCK_CRYPTO_PERFORMANCE = [
  { month: 'Ago 25', value: 1850000 },
  { month: 'Sep 25', value: 1920000 },
  { month: 'Oct 25', value: 2100000 },
  { month: 'Nov 25', value: 2350000 },
  { month: 'Dic 25', value: 2520000 },
  { month: 'Ene 26', value: 2650000 },
];
export const MOCK_PHILANTHROPY_PROJECTS = [
  {
    id: 1,
    title: "Becas Excelencia STEM",
    category: "Educación",
    budget: 120000,
    impact: "50 estudiantes universitarios apoyados",
    location: "Madrid, España",
    status: "Activo",
    description: "Programa de becas destinado a estudiantes de bajos recursos con alto rendimiento académico en carreras de Ciencia, Tecnología, Ingeniería y Matemáticas. Cubre matrícula, alojamiento y materiales, además de ofrecer mentoría personalizada con profesionales del sector tecnológico.",
    sdg: "SDG 4: Educación de Calidad"
  },
  {
    id: 2,
    title: "Hospital Móvil Senegal",
    category: "Salud",
    budget: 85000,
    impact: "12,000 pacientes atendidos anualmente",
    location: "Dakar, Senegal",
    status: "Activo",
    description: "Unidad médica móvil equipada para proporcionar atención primaria y preventiva en zonas rurales de difícil acceso. Incluye servicios de vacunación, atención materno-infantil y tratamiento de enfermedades infecciosas comunes, reduciendo la mortalidad en comunidades vulnerables.",
    sdg: "SDG 3: Salud y Bienestar"
  },
  {
    id: 3,
    title: "Reforestación Galicia",
    category: "Medio Ambiente",
    budget: 60000,
    impact: "10,000 árboles plantados",
    location: "Ourense, España",
    status: "Activo",
    description: "Iniciativa para restaurar bosques autóctonos afectados por incendios forestales. El proyecto utiliza especies nativas ricas en biodiversidad y emplea a población local en riesgo de exclusión social para las tareas de plantación y mantenimiento, garantizando sostenibilidad ecológica y social.",
    sdg: "SDG 13: Acción por el Clima"
  },
  {
    id: 4,
    title: "Conservación Románico",
    category: "Cultura",
    budget: 45000,
    impact: "3 iglesias restauradas",
    location: "Palencia, España",
    status: "Activo",
    description: "Proyecto de restauración y preservación del patrimonio arquitectónico románico en zonas rurales despobladas. Financia intervenciones de urgencia en cubiertas y estructuras, además de digitalizar el patrimonio para su difusión turística y cultural.",
    sdg: "SDG 11: Ciudades y Comunidades Sostenibles"
  },
  {
    id: 5,
    title: "Agua Potable Kenia",
    category: "Medio Ambiente",
    budget: 55000,
    impact: "3 pozos construidos",
    location: "Turkana, Kenia",
    status: "Activo",
    description: "Construcción de pozos solares para el acceso a agua potable segura en comunidades áridas. El sistema bombeo solar reduce costes operativos y garantiza suministro continuo para consumo humano y pequeña agricultura de subsistencia.",
    sdg: "SDG 6: Agua Limpia y Saneamiento"
  },
  {
    id: 6,
    title: "Escuela Música Inclusiva",
    category: "Cultura",
    budget: 30000,
    impact: "75 niños beneficiados",
    location: "Valencia, España",
    status: "Planificado",
    description: "Creación de una orquesta infantil inclusiva para niños con diversidad funcional y neurotípicos. Utiliza la música como herramienta de integración social, desarrollo cognitivo y expresión emocional, fomentando la convivencia desde edades tempranas.",
    sdg: "SDG 10: Reducción de las Desigualdades"
  },
  {
    id: 7,
    title: "Ocean Clean Up Med",
    category: "Medio Ambiente",
    budget: 40000,
    impact: "5 toneladas de plástico retiradas",
    location: "Islas Baleares, España",
    status: "Activo",
    description: "Financiación de expediciones de limpieza marina y campañas de sensibilización sobre residuos plásticos. Colaboración con pescadores locales para la recogida de redes fantasma y plásticos flotantes que amenazan la biodiversidad marina.",
    sdg: "SDG 14: Vida Submarina"
  },
  {
    id: 8,
    title: "Investigación Alzheimer",
    category: "Salud",
    budget: 15000,
    impact: "1 proyecto de investigación financiado",
    location: "Barcelona, España",
    status: "Activo",
    description: "Beca de investigación para jóvenes doctores centrada en la detección precoz del Alzheimer mediante biomarcadores en sangre. Apoyo directo a grupos de investigación clínica en hospitales públicos de referencia.",
    sdg: "SDG 3: Salud y Bienestar"
  }
];

// --- TREASURY DATA ---
export const MOCK_TREASURY_CASH_FLOW = [
  { month: 'Ene', income: 120000, expense: 80000, net: 40000 },
  { month: 'Feb', income: 150000, expense: 90000, net: 60000 },
  { month: 'Mar', income: 90000, expense: 85000, net: 5000 },
  { month: 'Abr', income: 200000, expense: 110000, net: 90000 },
  { month: 'May', income: 130000, expense: 95000, net: 35000 },
  { month: 'Jun', income: 160000, expense: 88000, net: 72000 },
];

export const MOCK_TREASURY_LIQUIDITY = [
  { currency: 'EUR', amount: 1250000, percentage: 75 },
  { currency: 'USD', amount: 350000, percentage: 20 },
  { currency: 'GBP', amount: 85000, percentage: 5 },
];

// --- RISK DATA ---
export const MOCK_RISK_DATA = [
  { subject: 'Market', A: 65, fullMark: 100 },
  { subject: 'Liquidity', A: 85, fullMark: 100 },
  { subject: 'Credit', A: 40, fullMark: 100 },
  { subject: 'Geopol.', A: 30, fullMark: 100 },
  { subject: 'Climate', A: 55, fullMark: 100 },
];

export const MOCK_RISK_GEO_EXPOSURE = [
  { name: 'Eurozone', value: 65 },
  { name: 'USA', value: 25 },
  { name: 'Emerging', value: 10 },
];

export const MOCK_RISK_SCENARIOS = {
  base: { value: "32.4M", change: "0%" },
  crash: { value: "25.9M", change: "-20.0%" },
  rates: { value: "30.1M", change: "-7.1%" },
  re_slump: { value: "29.8M", change: "-8.0%" }
};

// --- ENVIRONMENTAL DATA ---
export const MOCK_ENV_TRANSACTIONS = [
  { id: 'TX-001', date: '12/01/2026', type: 'BUY', counterparty: 'EcoShare Mobility', sector: 'Movilidad', amount: 5000, price: 90.50, status: 'Completed' },
  { id: 'TX-002', date: '05/01/2026', type: 'SELL', counterparty: 'Cerámicas Villarreal', sector: 'Industria', amount: 2000, price: 92.15, status: 'Completed' },
  { id: 'TX-003', date: '02/01/2026', type: 'BUY', counterparty: 'GreenFleet Madrid', sector: 'Movilidad', amount: 3500, price: 89.80, status: 'Completed' },
  { id: 'TX-004', date: '28/12/2025', type: 'SELL', counterparty: 'Azulejos & Pavimentos', sector: 'Industria', amount: 4000, price: 85.50, status: 'Completed' },
  { id: 'TX-005', date: '15/12/2025', type: 'BUY', counterparty: 'ElectricRide', sector: 'Movilidad', amount: 6000, price: 78.20, status: 'Settled' },
];

export const MOCK_ENV_PRICE_DATA = [
  { month: 'Ago', spot: 68.5, portfolio: 72.0 },
  { month: 'Sep', spot: 71.2, portfolio: 75.5 },
  { month: 'Oct', spot: 75.8, portfolio: 79.0 },
  { month: 'Nov', spot: 82.4, portfolio: 84.5 },
  { month: 'Dic', spot: 85.5, portfolio: 88.0 },
  { month: 'Ene', spot: 90.7, portfolio: 92.5 },
];
