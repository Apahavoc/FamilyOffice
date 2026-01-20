import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import {
    MOCK_PE_FUNDS,
    APP_NAME,
    MOCK_ALLOCATION_DATA,
    MOCK_PERFORMANCE_DATA,
    REAL_ESTATE_ASSETS,
    MOCK_PORTFOLIO_HOLDINGS,
    MOCK_BUSINESS_METRICS,
    MOCK_PHILANTHROPY_PROJECTS,
    MOCK_CRYPTO_HOLDINGS,
    MOCK_PASSION_METRICS,
    PASSION_PORTFOLIO,
    MOCK_TREASURY_CASH_FLOW,
    MOCK_TREASURY_LIQUIDITY,
    MOCK_RISK_DATA,
    MOCK_RISK_SCENARIOS,
    MOCK_ENV_TRANSACTIONS,
    MOCK_EXECUTIVE_SUMMARY,
    MOCK_BENCHMARKS,
    MOCK_FEES_STRUCTURE,
    MOCK_PE_CAPITAL_CALLS,
    MOCK_RE_OPERATING_DATA
} from '../constants';




export interface ReportData {
    totalWealth: number;
    weightedReturn: number;
    liquidityRatio: number;
    allocation: {
        name: string;
        value: number;
        percent: number;
        color: string;
    }[];
    // New fields for Deep Dive
    benchmarks?: {
        sp500: number; // YTD
        inflation: number;
        riskFree: number;
    };
    history?: {
        year: number;
        wealth: number;
        return: number;
    }[]; // For Evolution Chart
    riskMetrics?: {
        volatility: number;
        sharpeRatio: number;
        var: number; // Value at Risk
    };
}

export interface AIReportAnalysis {
    executiveSummary: string;
    macroAnalysis: string;
    strategyNotes: string;
    sectorFocus: string; // NEW
    geoStrategy: string; // NEW
    portfolioPerformance: string;
    riskAnalysis: string;
    cashFlowAnalysis: string;
    philanthropySpotlight: string;
}

export const triggerDownload = async (doc: jsPDF, filename: string) => {
    try {
        console.log(`Attempting download via file-saver for: ${filename}`);
        // Strategy: file-saver (Standard)
        // We use the library specifically designed to solve these browser inconsistencies.
        const blob = doc.output('blob');
        saveAs(blob, filename);
    } catch (e: any) {
        console.error("file-saver download failed", e);
        // Last resort fallback
        doc.save(filename);
    }
};

// ... (rest of file) ...




// --- SHARED UTILS ---

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};


const MOCK_PIPELINE = [
    { name: 'Thoma Bravo Fund XVI', strategy: 'Tech Buyout', stage: 'Due Diligence', targetCommitment: 2000000, expectedClose: 'Q2 2026' },
    { name: 'A16Z Crypto Fund IV', strategy: 'Venture / Crypto', stage: 'Initial Review', targetCommitment: 1000000, expectedClose: 'Q3 2026' },
    { name: 'Brookfield Infrastructure V', strategy: 'Infrastructure', stage: 'Approved', targetCommitment: 3000000, expectedClose: 'Q1 2026' }
];

const MOCK_COMPARATIVE = {
    currentQ: { irr: 17.6, tvpi: 1.40 },
    prevQ: { irr: 16.8, tvpi: 1.35 },
    yearAgo: { irr: 14.2, tvpi: 1.25 }
};

const COLORS: { [key: string]: [number, number, number] } = {
    primary: [15, 23, 42],       // Slate 900
    secondary: [51, 65, 85],     // Slate 700
    accent: [37, 99, 235],       // Blue 600
    success: [16, 185, 129],     // Emerald 500
    warning: [245, 158, 11],     // Amber 500
    alert: [225, 29, 72],        // Rose 600
    text: [71, 85, 105],         // Slate 600
    lightBg: [248, 250, 252]     // Slate 50
};
// --- VISUAL ENGINE & PREMIUM STYLE ---

const PREMIUM_COLORS = {
    navy: [15, 23, 42],       // #0F172A (Slate 900) - Primary Background
    slate: [51, 65, 85],      // #334155 (Slate 700) - Secondary/Headers
    gold: [203, 166, 96],     // #CBA660         - Luxury Accent
    white: [255, 255, 255],
    lightGray: [241, 245, 249], // #F1F5F9 (Slate 100)
    chart: [
        [59, 130, 246],  // Blue
        [16, 185, 129],  // Emerald
        [245, 158, 11],  // Amber
        [239, 68, 68],   // Red
        [139, 92, 246],  // Violet
        [6, 182, 212],   // Cyan
    ]
};

// Vector Graphics Helpers
const drawPieChart = (doc: jsPDF, x: number, y: number, radius: number, data: { value: number, color: string }[]) => {
    let total = data.reduce((acc, item) => acc + item.value, 0);
    let startAngle = 0;

    data.forEach(slice => {
        const sliceAngle = (slice.value / total) * 360;
        const endAngle = startAngle + sliceAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        // Draw Slice (Arc)
        doc.setFillColor(slice.color);
        doc.lines(
            [
                [radius * Math.cos(startRad), radius * Math.sin(startRad)],
                [radius * Math.cos(endRad), radius * Math.sin(endRad)], // Arc approximation needed for perfect circles, but using triangles for simplicity in standard jsPDF if not using path api.
                // Actually proper arc:
            ],
            x,
            y,
            [1, 1],
            'F',
            true // Closed loop
        );

        // Simpler solid circle sector using built-in hooks if available, or approximating:
        // Using built-in logic for sectors is hard in raw jsPDF without the 'context2d' shim.
        // Let's use a simpler approach: Lines.
        // Or better: use `doc.circle` clips? No.
        // Strategy: "Pizza Slices" approximated by triangles for small slices or native 'pie' plugin if present.
        // Fallback to simpler implementation: Circle with segment lines?
        // Let's actually implement a robust "Donut" using arcs if possible, or just a bar chart which is safer.
        // DECISION: REVERT TO BAR CHART FOR RELIABILITY IF PIE IS COMPLEX WITHOUT CANTEVAS.
        // WAIT: jsPDF has `sector` method in plugins. Assuming standard build.
        // If not, let's do a "Review Bar" (Stacked Bar) which is very premium.
    });
};

// Helper to convert Hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
};

const drawStackedBar = (doc: jsPDF, x: number, y: number, width: number, height: number, data: { value: number, color: string }[]) => {
    let currentX = x;
    const total = data.reduce((acc, item) => acc + item.value, 0);

    // Background
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(x, y, width, height, 2, 2, 'F');

    data.forEach(item => {
        const itemWidth = (item.value / total) * width;

        // Handle Color (Hex to RGB)
        if (item.color.startsWith('#')) {
            const rgb = hexToRgb(item.color);
            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
        } else {
            // Fallback if somehow using one of our RGB arrays (unlikely for this data path but safe)
            // If it's not a string, we assume it's handled or we'd need more logic. 
            // But data.allocation has strings. 
            doc.setFillColor(item.color);
        }

        // We don't have rounding on individual segments to avoid gaps, only simple rects
        doc.rect(currentX, y, itemWidth, height, 'F');
        currentX += itemWidth;
    });

    // Border overlay for cleanliness
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(x, y, width, height, 2, 2, 'D');
};


const addPremiumCover = (doc: jsPDF, title: string) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // 1. Background
    doc.setFillColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.rect(0, 0, width, height, 'F');

    // 2. Gold Accent Line
    doc.setDrawColor(PREMIUM_COLORS.gold[0], PREMIUM_COLORS.gold[1], PREMIUM_COLORS.gold[2]);
    doc.setLineWidth(2);
    doc.line(20, 40, width - 20, 40);

    // 3. Logo / Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.text("NEXUS", width / 2, height / 2 - 20, { align: 'center', charSpace: 3 });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text("FAMILY OFFICE INTELLIGENCE", width / 2, height / 2, { align: 'center', charSpace: 2 });

    // 4. Report Title & Date
    doc.setFontSize(28); // Larger
    doc.setTextColor(PREMIUM_COLORS.gold[0], PREMIUM_COLORS.gold[1], PREMIUM_COLORS.gold[2]);
    doc.text(title.toUpperCase(), width / 2, height - 70, { align: 'center' }); // Moved up

    doc.setLineWidth(0.5);
    doc.line(width / 2 - 40, height - 60, width / 2 + 40, height - 60); // Underline

    doc.setFontSize(14); // Larger date
    doc.setTextColor(220, 220, 220); // Brighter
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    doc.text(date.toUpperCase(), width / 2, height - 50, { align: 'center' });

    // 5. Confidential Footer
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("INFORME ESTRATÉGICO CONFIDENCIAL | NEXUS FAMILY OFFICE", width / 2, height - 15, { align: 'center' });
};

const addPremiumHeader = (doc: jsPDF, title: string) => {
    const width = doc.internal.pageSize.getWidth();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, width, 25, 'F'); // Clean white header

    // Logo Left
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("NEXUS", 14, 15);

    // Title Right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(PREMIUM_COLORS.slate[0], PREMIUM_COLORS.slate[1], PREMIUM_COLORS.slate[2]);
    doc.text(title, width - 14, 15, { align: 'right' });

    // Gold separator
    doc.setDrawColor(PREMIUM_COLORS.gold[0], PREMIUM_COLORS.gold[1], PREMIUM_COLORS.gold[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 20, width - 14, 20);
};

const addPremiumFooter = (doc: jsPDF, pageNumber: number) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Nexus Family Office | Página ${pageNumber}`, 14, height - 10);
    doc.text("Confidencial", width - 14, height - 10, { align: 'right' });
};

const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(title, 14, y);
    // Underline
    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 80, y + 2);
    return y + 10;
};

// --- MODULE GENERATORS ---



// --- NEW DASHBOARD SECTION (PAGE 3) ---

const addDashboardSection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = addSectionTitle(doc, "2. Cuadro de Mando Integral (Dashboard)", startY);

    // --- EXECUTIVE DASHBOARD (TRAFFIC LIGHTS) ---
    const startDashboardY = y;

    // 1. Top Movers
    doc.setFontSize(12);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Top Movers (Impacto)", 14, y);
    y += 8;

    MOCK_EXECUTIVE_SUMMARY.topMovers.forEach(mover => {
        // Dot Color
        let dotColor = PREMIUM_COLORS.slate;
        if (mover.impact === 'high_positive') dotColor = PREMIUM_COLORS.chart[1]; // Emerald
        if (mover.impact === 'positive') dotColor = PREMIUM_COLORS.chart[0]; // Blue
        if (mover.impact === 'negative') dotColor = PREMIUM_COLORS.chart[3]; // Red

        doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.circle(16, y - 1, 1.5, 'F');

        doc.setFontSize(9);
        doc.setTextColor(50);
        doc.setFont('helvetica', 'normal');
        doc.text(mover.name, 20, y);

        doc.setFont('helvetica', 'bold');
        doc.text(mover.change, 100, y, { align: 'right' });
        y += 6;
    });

    // 2. Critical Alerts (Right Side)
    let alertY = startDashboardY;
    const alertX = 110;

    doc.setFontSize(12);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Alertas Gerenciales", alertX, alertY);
    alertY += 8;

    MOCK_EXECUTIVE_SUMMARY.alerts.forEach(alert => {
        // Box
        doc.setDrawColor(PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]);
        if (alert.severity === 'high') {
            doc.setFillColor(254, 242, 242); // Light Red
            doc.setDrawColor(220, 38, 38);
        } else {
            doc.setFillColor(255, 251, 235); // Light Amber
            doc.setDrawColor(217, 119, 6);
        }

        doc.roundedRect(alertX, alertY - 4, 85, 12, 1, 1, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(50);
        doc.text(alert.message, alertX + 4, alertY + 3);
        alertY += 16;
    });

    y = Math.max(y, alertY) + 20;

    doc.setFontSize(12);
    doc.text("Distribución de Activos (Allocation)", 14, y);
    y += 5;

    // Prepare data for Chart
    const chartData = data.allocation.map(a => ({
        value: a.percent,
        color: a.color
    }));

    drawStackedBar(doc, 14, y, 180, 15, chartData);
    y += 25;

    // Legend for Chart
    let legendX = 14;
    let legendY = y;
    data.allocation.forEach(a => {
        if (a.color.startsWith('#')) {
            const rgb = hexToRgb(a.color);
            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
        } else {
            doc.setFillColor(a.color);
        }

        doc.rect(legendX, legendY, 3, 3, 'F');
        doc.setFontSize(8);
        doc.setTextColor(50);
        doc.text(`${a.name} (${a.percent}%)`, legendX + 5, legendY + 2.5);
        legendX += 45;
        if (legendX > 180) { legendX = 14; legendY += 5; }
    });

    y = legendY + 15;

    // Detailed Table
    const allocData = data.allocation.map(a => [a.name, `${a.percent}%`]);
    autoTable(doc, {
        startY: y,
        head: [['Clase de Activo', '% Asignación']],
        body: allocData,
        theme: 'grid',
        headStyles: { fillColor: [PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]] },
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

// --- SUMMARY SECTION (PAGE 2) ---

const addSummarySection = (doc: jsPDF, startY: number, data: ReportData) => {
    // Note: Premium Header is already added by main orchestrator
    let y = startY + 10;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Resumen Ejecutivo Patrimonial", 14, y);
    y += 15;

    // Total Wealth Big Number (Use REAL data) - MOVED UP
    const totalWealth = data.totalWealth;

    doc.setFontSize(10);
    doc.setTextColor(PREMIUM_COLORS.slate[0], PREMIUM_COLORS.slate[1], PREMIUM_COLORS.slate[2]);
    doc.text("Patrimonio Neto Total (NAV):", 14, y);
    y += 10;

    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text(formatCurrency(totalWealth), 14, y);

    // Add Year-Over-Year Growth
    doc.setFontSize(14); // Larger for visibility
    const yoyChange = MOCK_EXECUTIVE_SUMMARY.ytdReturn; // Use constant or calculate
    const isPositive = yoyChange >= 0;
    doc.setTextColor(isPositive ? COLORS.success[0] : COLORS.alert[0], isPositive ? COLORS.success[1] : COLORS.alert[1], isPositive ? COLORS.success[2] : COLORS.alert[2]);

    doc.text(`${isPositive ? '+' : ''}${yoyChange}% YTD`, 110, y);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("vs. Inicio de Año", 110, y + 5);

    y += 25;

    // Horizontal Line
    doc.setDrawColor(200);
    doc.line(14, y, 196, y);
    y += 15;

    // AI INJECTION: Executive Summary Narrative
    if ((data as any).aiContent?.executiveSummary) {
        doc.setFontSize(11); // Slightly larger
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const splitText = doc.splitTextToSize((data as any).aiContent.executiveSummary, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 6) + 10;
    }

    return y;
};

// --- NEW DEEP DIVE SECTIONS FOR ARIETE STYLE ---

const addMacroAnalysisSection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = addSectionTitle(doc, "2. Entorno Macroeconómico Global", startY);

    const aiContent = (data as any).aiContent as AIReportAnalysis | undefined;

    if (aiContent?.macroAnalysis) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        // Split text to fill the page
        const text = doc.splitTextToSize(aiContent.macroAnalysis, 180);
        doc.text(text, 14, y);
        y += (text.length * 5) + 15;
    } else {
        doc.text("Análisis macroeconómico detallado no disponible.", 14, y);
        y += 20;
    }
    return y;
};

const addStrategySection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = addSectionTitle(doc, "3. Estrategia de Inversión (Comité Mensual)", startY);

    const aiContent = (data as any).aiContent as AIReportAnalysis | undefined;

    if (aiContent?.strategyNotes) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const text = doc.splitTextToSize(aiContent.strategyNotes, 180);
        doc.text(text, 14, y);
        y += (text.length * 5) + 15;
    } else {
        doc.text("Estrategia detallada no disponible.", 14, y);
        y += 20;
    }
    return y;
};

const addSectorAndGeoSection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = addSectionTitle(doc, "4. Análisis Sectorial y Geográfico", startY);

    const aiContent = (data as any).aiContent as AIReportAnalysis | undefined;

    if (aiContent) {
        // Sector Focus
        doc.setFontSize(12);
        doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
        doc.setFont('helvetica', 'bold');
        doc.text("Foco Sectorial (Deep Dive)", 14, y);
        y += 8;

        if (aiContent.sectorFocus) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50);
            const text = doc.splitTextToSize(aiContent.sectorFocus, 180);
            doc.text(text, 14, y);
            y += (text.length * 5) + 15;
        }

        // Geo Strategy
        doc.setFontSize(12);
        doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
        doc.setFont('helvetica', 'bold');
        doc.text("Estrategia Geográfica", 14, y);
        y += 8;

        if (aiContent.geoStrategy) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50);
            const text = doc.splitTextToSize(aiContent.geoStrategy, 180);
            doc.text(text, 14, y);
            y += (text.length * 5) + 15;
        }

    } else {
        doc.text("Análisis avanzado no disponible.", 14, y);
        y += 20;
    }
    return y;
};

const addStrategicAnalysis = (doc: jsPDF, startY: number, data: ReportData) => {
    // This section is now LEGACY/Merged into the new pages, but kept for fallback or specific recommendations
    let y = addSectionTitle(doc, "5. Recomendaciones Tácticas (Resumen)", startY);

    const aiContent = (data as any).aiContent as AIReportAnalysis | undefined;

    if (aiContent) {
        // Portfolio Performance (Moved here since marketContext is gone)
        doc.setFontSize(11);
        doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
        doc.setFont('helvetica', 'bold');
        doc.text("Desempeño de Cartera", 14, y);
        y += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const perfText = doc.splitTextToSize(aiContent.portfolioPerformance, 180);
        doc.text(perfText, 14, y);
        y += (perfText.length * 5) + 15;
    } else {
        // Fallback to static text if no AI
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(50);
        doc.text("Generado automáticamente por Nexus AI Engine.", 14, y);
        y += 10;
    }

    const recommendations = [];

    // 1. Liquidity Check
    if (data.liquidityRatio < 10) {
        recommendations.push({
            type: 'warning',
            title: 'Alerta de Liquidez',
            text: `Su ratio de liquidez actual es del ${data.liquidityRatio.toFixed(1)}%, por debajo del objetivo recomendado del 10-15%. Se recomienda aumentar posiciones en Tesorería o evitar nuevos compromisos de capital ilíquido a corto plazo.`
        });
    } else {
        recommendations.push({
            type: 'success',
            title: 'Solidez de Liquidez',
            text: `Mantiene un nivel saludable de liquidez (${data.liquidityRatio.toFixed(1)}%), permitiendo cubrir compromisos de capital (Capital Calls) y gastos operativos durante los próximos 18 meses sin estrés.`
        });
    }

    // 2. Diversification / Concentration
    const sortedAllocation = [...data.allocation].sort((a, b) => b.value - a.value);
    const topAsset = sortedAllocation[0];
    if (topAsset.percent > 40) {
        recommendations.push({
            type: 'info',
            title: 'Concentración de Activos',
            text: `Existe una concentración significativa en ${topAsset.name} (${topAsset.percent}%). Considere rebalancear la cartera hacia activos descorrelacionados (ej. Private Equity secundario o Renta Fija) para mitigar riesgos sectoriales.`
        });
    }

    // 3. Performance / Outlook
    if (data.weightedReturn > 8) {
        recommendations.push({
            type: 'success',
            title: 'Rendimiento Superior',
            text: `La rentabilidad ponderada del portafolio (${data.weightedReturn.toFixed(1)}%) supera el benchmark compuesto (7.5%). La estrategia de crecimiento en Mercados Privados está aportando el alpha esperado.`
        });
    } else {
        recommendations.push({
            type: 'warning',
            title: 'Revisión de Rendimiento',
            text: `La rentabilidad actual (${data.weightedReturn.toFixed(1)}%) está por debajo del objetivo estratégico inflacionario. Se sugiere revisar los gestores de Renta Variable y las posiciones de bajo rendimiento en Real Estate.`
        });
    }

    // Render Recommendations
    recommendations.forEach(rec => {
        // Badge Color
        let badgeColor = COLORS.accent;
        if (rec.type === 'warning') badgeColor = COLORS.warning;
        if (rec.type === 'success') badgeColor = COLORS.success;
        if (rec.type === 'info') badgeColor = COLORS.accent;

        // Draw Badge Background
        doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
        doc.roundedRect(14, y, 3, 18, 1, 1, 'F');

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text(rec.title, 20, y + 5);

        // Text
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const splitText = doc.splitTextToSize(rec.text, 170);
        doc.text(splitText, 20, y + 10);

        y += 25;
    });

    return y + 10;
};

const addPortfolioSection = (doc: jsPDF, startY: number, data: ReportData) => {
    // Header is added by main orchestrator
    let y = startY + 10;

    // 1. KPI Cards (Simulated)
    doc.setFontSize(16);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Desempeño Financiero vs Mercado", 14, y);
    y += 10;

    // Benchmark Comparison Bar Chart
    // Use Executive Benchmark Data
    const portfolioRet = data.weightedReturn;
    const sp500 = MOCK_BENCHMARKS.sp500;
    const inflation = MOCK_BENCHMARKS.inflation;
    const riskFree = MOCK_BENCHMARKS.risk_free;

    const chartData = [
        { label: 'Cartera Nexus', value: portfolioRet, color: PREMIUM_COLORS.chart[1] }, // Emerald
        { label: sp500.name, value: sp500.ytd, color: PREMIUM_COLORS.chart[0] }, // Blue
        { label: inflation.name, value: inflation.ytd, color: PREMIUM_COLORS.chart[2] }, // Amber
        { label: riskFree.name, value: riskFree.ytd, color: PREMIUM_COLORS.chart[4] } // Violet
    ];

    // Draw Bar Chart Manually
    const chartHeight = 40;
    const barWidth = 15;
    const spacing = 20;
    const startX = 20;
    const baselineY = y + 45;

    // Draw Axis
    doc.setDrawColor(200);
    doc.line(14, baselineY, 150, baselineY); // X Axis

    // Draw Bars
    chartData.forEach((item, index) => {
        const xPos = startX + (index * (barWidth + spacing));
        const barHeight = (item.value / 20) * chartHeight; // Scale: 20% max

        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.rect(xPos, baselineY - barHeight, barWidth, barHeight, 'F');

        // Label Value
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`${item.value.toFixed(1)}%`, xPos + barWidth / 2, baselineY - barHeight - 2, { align: 'center' });

        // Label Name
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(item.label, xPos + barWidth / 2, baselineY + 5, { align: 'center' });
    });

    y = baselineY + 20;

    // 2. Detailed Holdings Table
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Posiciones Detalladas", 14, y);
    y += 5;

    const portfolioData = MOCK_PORTFOLIO_HOLDINGS.map(h => [
        h.ticker,
        h.name,
        h.type,
        formatCurrency(typeof h.value === 'string' ? parseFloat(h.value.replace(/[^0-9.-]+/g, "")) : h.value as number), // Safety cast
        h.change
    ]);

    // Typecast to satisfy linter issues with strict number[] vs Tuple
    const successColor = [PREMIUM_COLORS.chart[1][0], PREMIUM_COLORS.chart[1][1], PREMIUM_COLORS.chart[1][2]] as [number, number, number];
    const alertColor = [PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]] as [number, number, number];

    autoTable(doc, {
        startY: y,
        head: [['Ticker', 'Nombre', 'Tipo', 'Valor Mercado', 'YTD']],
        body: portfolioData,
        theme: 'grid',
        headStyles: { fillColor: [PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]] },
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' },
            4: { halign: 'right', textColor: successColor } // Default Success
        },
        didParseCell: (data) => {
            if (data.column.index === 4) {
                if ((data.cell.raw as string).includes('-')) data.cell.styles.textColor = alertColor; // Red
            }
        }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // 3. Fee Analysis Table (New)
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Análisis de Costes y Comisiones", 14, y);
    y += 5;

    const feeData = MOCK_FEES_STRUCTURE.map(f => [
        f.assetClass,
        `${f.mgmtFee}%`,
        `${f.perfFee}%`,
        formatCurrency(f.totalCost)
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Clase de Activo', 'Mgmt Fee', 'Perf. Fee', 'Coste Est. Anual']],
        body: feeData,
        theme: 'striped',
        headStyles: { fillColor: [PREMIUM_COLORS.slate[0], PREMIUM_COLORS.slate[1], PREMIUM_COLORS.slate[2]] },
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // 4. AI Strategic Analysis (Manager-Ready)
    doc.setFillColor(240, 248, 255); // Alice Blue
    doc.setDrawColor(200);
    doc.roundedRect(14, y, 180, 25, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Análisis Estratégico & Recomendaciones", 20, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    doc.text([
        "• REBALANCEO: La exposición a Renta Variable (25%) está por debajo del objetivo estratégico (30%). Se recomienda aumentar la posición en ETFs S&P 500 aprovechando la corrección actual.",
        "• EFICIENCIA: Los costes de gestión en Hedge Funds (1.8% + 15%) son elevados comparados con el retorno (-1.2% YTD). Valorar rotación hacia vehículos más eficientes."
    ], 20, y + 15, { maxWidth: 170, lineHeightFactor: 1.5 });

    return y + 35;
};

const addRealEstateSection = (doc: jsPDF, startY: number) => {
    let y = addSectionTitle(doc, "Cartera Inmobiliaria (Real Estate)", startY);

    // Merge static asset data with new Operating Data
    const reData = REAL_ESTATE_ASSETS.map((a, i) => {
        const opData = MOCK_RE_OPERATING_DATA.find(o => o.id === a.id) || { noi: 0, capRate: 0, leaseExpiry: 'N/A' };
        return [
            a.name,
            a.status,
            `${a.occupancy}%`,
            formatCurrency(opData.noi), // Net Operating Income
            `${opData.capRate}%`,
            opData.leaseExpiry,
            a.value
        ];
    });

    autoTable(doc, {
        startY: y,
        head: [['Activo', 'Estado', 'Ocupación', 'NOI (Anual)', 'Cap Rate', 'Vencimiento', 'Valoración']],
        body: reData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // Emeraldish
        columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            5: { halign: 'center' },
            6: { halign: 'right', fontStyle: 'bold' }
        }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // AI Analysis Block
    doc.setFillColor(240, 253, 244); // Mint Cream
    doc.setDrawColor(16, 185, 129); // Emerald
    doc.roundedRect(14, y, 180, 25, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(10, 80, 40); // Dark Green
    doc.setFont('helvetica', 'bold');
    doc.text("Optimización de Activos (AI Insights)", 20, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    doc.text([
        "• OPORTUNIDAD: El 'Edificio Castellón' presenta un Yield (5.2%) inferior al mercado (6.0%). Evaluar posible refinanciación o venta parcial para reinvertir en logística.",
        "• CAPEX: Se prevee una inversión de 200k en 'Residencial Playa' para finalizar obra antes de Q3 2026."
    ], 20, y + 15, { maxWidth: 170, lineHeightFactor: 1.5 });

    return y + 35;
};

const addPESection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = startY + 10;

    // Header
    doc.setFontSize(16);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Análisis de Curva-J (Cash Flow Forecast)", 14, y);
    y += 10;

    // Chart: Capital Calls vs Distributions (Simulated Forecast)
    const years = ['2023', '2024', '2025', '2026(E)', '2027(E)'];
    const calls = [2.5, 3.2, 4.1, 1.8, 0.5]; // Millions called
    const dists = [0.2, 0.5, 1.2, 3.5, 5.8]; // Millions returned

    const chartHeight = 50;
    const barW = 12;
    const spacing = 25;
    const startX = 30;
    const zeroY = y + 45;

    // Axis
    doc.setDrawColor(200);
    doc.line(14, zeroY, 180, zeroY); // X Axis
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Millones €", 14, y + 5);

    years.forEach((year, i) => {
        const x = startX + (i * spacing);
        const callH = (calls[i] / 6) * chartHeight; // Scale max 6M
        const distH = (dists[i] / 6) * chartHeight;

        // Calls (Negative-ish visually, but we plot upward in separate color for comparison or stacked?) 
        // Let's plot side-by-side. 
        // Red bars for Calls (Out-flows), Green for Distributions (In-flows)

        // Calls
        doc.setFillColor(PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]);
        doc.rect(x, zeroY - callH, barW / 2, callH, 'F');

        // Distribution
        doc.setFillColor(PREMIUM_COLORS.chart[1][0], PREMIUM_COLORS.chart[1][1], PREMIUM_COLORS.chart[1][2]);
        doc.rect(x + barW / 2, zeroY - distH, barW / 2, distH, 'F');

        // Label
        doc.setTextColor(100);
        doc.text(year, x + barW / 2, zeroY + 5, { align: 'center' });
    });

    // Legend
    doc.setFillColor(PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]);
    doc.rect(140, y, 4, 4, 'F');
    doc.text("Capital Calls", 146, y + 3);

    doc.setFillColor(PREMIUM_COLORS.chart[1][0], PREMIUM_COLORS.chart[1][1], PREMIUM_COLORS.chart[1][2]);
    doc.rect(140, y + 6, 4, 4, 'F');
    doc.text("Distribuciones", 146, y + 9);


    y = zeroY + 20;

    // Table
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Detalle de Fondos", 14, y);
    y += 5;

    const peData = MOCK_PE_FUNDS.map(f => [
        f.name,
        f.vintage,
        formatCurrency(f.committed),
        `${Math.round((f.called / f.committed) * 100)}%`,
        `${f.tvpi}x`,
        `${f.irr}%`
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Fondo', 'Vintage', 'Commitment', '% Funded', 'TVPI', 'IRR']],
        body: peData,
        theme: 'grid',
        headStyles: { fillColor: [PREMIUM_COLORS.chart[2][0], PREMIUM_COLORS.chart[2][1], PREMIUM_COLORS.chart[2][2]] }, // Amber/Orange
        columnStyles: {
            2: { halign: 'right' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center', fontStyle: 'bold' }
        }
    });



    y = (doc as any).lastAutoTable.finalY + 15;

    // 2. Capital Call Forecast (New Manager-Ready Feature)
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Previsión de Llamadas de Capital (Capital Calls)", 14, y);
    y += 5;

    const callData = MOCK_PE_CAPITAL_CALLS.map(c => [
        c.fund,
        c.date,
        c.status,
        formatCurrency(c.amount)
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Fondo', 'Fecha Est.', 'Estado', 'Importe Previsto']],
        body: callData,
        theme: 'grid',
        headStyles: { fillColor: [PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]] }, // Red for outflows
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold', textColor: [PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]] }
        },
        didParseCell: (data) => {
            if (data.column.index === 2) {
                if (data.cell.raw === 'Confirmed') data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addCryptoSection = (doc: jsPDF, startY: number) => {
    let y = addSectionTitle(doc, "Criptoactivos & Activos Digitales", startY);

    const cryptoData = MOCK_CRYPTO_HOLDINGS.map(c => [
        c.name,
        c.symbol,
        c.amount.toString(),
        formatCurrency(c.price),
        formatCurrency(c.amount * c.price),
        c.change
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Activo', 'Símbolo', 'Tenencia', 'Precio Unit.', 'Valor Total', '24h Change']],
        body: cryptoData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] }, // Indigo
        columnStyles: {
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right', fontStyle: 'bold' },
            5: { halign: 'right', textColor: [COLORS.success[0], COLORS.success[1], COLORS.success[2]] }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addPhilanthropySection = (doc: jsPDF, startY: number, data?: ReportData) => {
    let y = addSectionTitle(doc, "Filantropía e Impacto (Fundación Nexus)", startY);

    // AI INJECTION: Philanthropy Spotlight
    if ((data as any)?.aiContent?.philanthropySpotlight) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const splitText = doc.splitTextToSize((data as any).aiContent.philanthropySpotlight, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 5) + 10;
    }

    // Filter active projects for brevity
    const projects = MOCK_PHILANTHROPY_PROJECTS.map(p => [
        p.title,
        p.category,
        p.location,
        formatCurrency(p.budget),
        p.sdg.split(':')[0] // Just SDG Number
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Proyecto / Iniciativa', 'Categoría', 'Ubicación', 'Presupuesto', 'ODS Principal']],
        body: projects,
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153] }, // Pink
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' },
            4: { halign: 'center' }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addBusinessSection = (doc: jsPDF, startY: number) => {
    let y = addSectionTitle(doc, "Negocio Familiar (Operating Company)", startY);

    const metrics = [
        ['Facturación (Revenue)', formatCurrency(MOCK_BUSINESS_METRICS.revenue)],
        ['EBITDA', formatCurrency(MOCK_BUSINESS_METRICS.ebitda)],
        ['Margen Neto', `${MOCK_BUSINESS_METRICS.netMargin}%`],
        ['Valoración Estimada', formatCurrency(MOCK_BUSINESS_METRICS.valuation)],
        ['Plantilla', `${MOCK_BUSINESS_METRICS.employees} Empleados`]
    ];

    autoTable(doc, {
        startY: y,
        head: [['KPI Operativo', 'Valor Actual']],
        body: metrics,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }, // Blue
        columnStyles: {
            0: { fontStyle: 'bold' },
            1: { halign: 'right' }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addTreasurySection = (doc: jsPDF, startY: number, data?: ReportData) => {
    let y = addSectionTitle(doc, "Tesorería y Gestión de Liquidez", startY);

    // AI INJECTION: Cash Flow Analysis
    if ((data as any)?.aiContent?.cashFlowAnalysis) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const splitText = doc.splitTextToSize((data as any).aiContent.cashFlowAnalysis, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 5) + 10;
    }

    // Liquidity Summary
    doc.setFontSize(11);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Posición Global de Liquidez:", 14, y);
    y += 8;

    const liqData = MOCK_TREASURY_LIQUIDITY.map(l => [
        l.currency,
        `${l.percentage}%`,
        formatCurrency(l.amount)
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Divisa', 'Ponderación', 'Importe Disponible']],
        body: liqData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // Blue
        columnStyles: {
            2: { halign: 'right', fontStyle: 'bold' }
        },
        tableWidth: 100
    });

    let tableY = (doc as any).lastAutoTable.finalY + 20;

    // --- CASH RUNWAY VISUALIZATION (Manager-Ready) ---
    const dashboardY = tableY;
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Cash Runway & Burn Rate", 14, dashboardY);

    // Calculated Metrics (Mocked for now based on Constants)
    const monthlyBurn = 280000; // Mock avg from expenses
    const runwayMonths = 6.4;
    const isCritical = runwayMonths < 6;

    // Visual Box
    doc.setDrawColor(200);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, dashboardY + 5, 180, 25, 2, 2, 'S');

    // 1. Runway Metric
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Runway Estimado", 20, dashboardY + 15);
    doc.setFontSize(16);
    doc.setTextColor(isCritical ? COLORS.alert[0] : COLORS.success[0], isCritical ? COLORS.alert[1] : COLORS.success[1], isCritical ? COLORS.alert[2] : COLORS.success[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${runwayMonths} Meses`, 20, dashboardY + 24);

    // 2. Burn Rate Metric
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text("Burn Rate Mensual", 80, dashboardY + 15);
    doc.setFontSize(16);
    doc.setTextColor(50);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(monthlyBurn), 80, dashboardY + 24);

    // 3. Status Badge
    doc.setFillColor(isCritical ? COLORS.alert[0] : COLORS.success[0], isCritical ? COLORS.alert[1] : COLORS.success[1], isCritical ? COLORS.alert[2] : COLORS.success[2]);
    doc.roundedRect(150, dashboardY + 12, 30, 10, 1, 1, 'F');
    doc.setTextColor(255);
    doc.setFontSize(9);
    doc.text(isCritical ? "ALERTA" : "SALUDABLE", 165, dashboardY + 18, { align: 'center' });

    tableY = dashboardY + 40;

    // Cash Flow Table (Right side simulated or below)
    doc.text("Flujo de Caja Mensual (Proyectado):", 14, tableY);
    tableY += 8;

    const cashData = MOCK_TREASURY_CASH_FLOW.map(c => [
        c.month,
        formatCurrency(c.income),
        formatCurrency(c.expense),
        formatCurrency(c.net)
    ]);

    autoTable(doc, {
        startY: tableY,
        head: [['Mes', 'Entradas', 'Salidas', 'Neto']],
        body: cashData,
        theme: 'grid',
        headStyles: { fillColor: [COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]] },
        columnStyles: {
            1: { halign: 'right', textColor: [COLORS.success[0], COLORS.success[1], COLORS.success[2]] },
            2: { halign: 'right', textColor: [COLORS.alert[0], COLORS.alert[1], COLORS.alert[2]] },
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addRiskSection = (doc: jsPDF, startY: number, data: ReportData) => {
    let y = startY + 10;

    doc.setFontSize(16);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Mapa de Calor de Riesgos (Risk Heatmap)", 14, y);
    y += 15;

    // AI INJECTION: Risk Analysis
    if ((data as any).aiContent?.riskAnalysis) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const splitText = doc.splitTextToSize((data as any).aiContent.riskAnalysis, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 5) + 10;
    }

    // --- VISUALIZATION: RISK HEATMAP ---
    // Draw 3x3 Grid
    const gridSize = 30;
    const startX = 60;

    // Axis Labels
    doc.setFontSize(10);
    doc.text("Probabilidad", startX + 45, y + (gridSize * 3) + 15, { align: 'center' }); // X Label

    doc.text("Impacto", startX - 10, y + 45, { align: 'center', angle: 90 }); // Y Label

    const levels = ['Baja', 'Media', 'Alta'];
    levels.forEach((l, i) => {
        // X Axis Ticks
        doc.text(l, startX + 15 + (i * 30), y + (gridSize * 3) + 5, { align: 'center' });
        // Y Axis Ticks (Reversed for Impact: High top)
        doc.text(levels[2 - i], startX - 5, y + 15 + (i * 30), { align: 'right' });
    });

    // Draw Grid Cells
    for (let row = 0; row < 3; row++) { // Impact (0=High, 1=Med, 2=Low)
        for (let col = 0; col < 3; col++) { // Prob (0=Low, 1=Med, 2=High)
            const cellX = startX + (col * gridSize);
            const cellY = y + (row * gridSize);

            // Color Logic based on severity (High/High = Red)
            let severity = (2 - row) + col; // 0 to 4
            let color = [240, 240, 240]; // Default gray

            if (row === 0 && col === 2) color = PREMIUM_COLORS.chart[3]; // High/High (Red)
            else if (row === 0 && col === 1) color = PREMIUM_COLORS.chart[2]; // High/Med (Amber)
            else if (row === 1 && col === 2) color = PREMIUM_COLORS.chart[2]; // Med/High (Amber)
            else if (row === 2 && col === 0) color = PREMIUM_COLORS.chart[1]; // Low/Low (Green)

            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(cellX, cellY, gridSize, gridSize, 'F');
            doc.setDrawColor(255);
            doc.rect(cellX, cellY, gridSize, gridSize, 'D');

            // PLACEHOLDERS (Dots) for Risks
            // Simulated logic: Place dots based on mock data
            if (row === 0 && col === 2) {
                // High Impact / High Prob
                doc.setFillColor(0, 0, 0);
                doc.circle(cellX + 15, cellY + 15, 3, 'F');
                doc.setTextColor(255); doc.setFontSize(8); doc.text("1", cellX + 15, cellY + 16, { align: 'center' });
            }
        }
    }

    y += (gridSize * 3) + 25;

    // Risk Table
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Evaluación Detallada de Amenazas", 14, y);
    y += 5;

    const riskData = MOCK_RISK_DATA.map((r, i) => [
        `${i + 1}. ${r.subject}`, // Index matches heatmap
        `${r.A}/100`,
        r.A > 70 ? 'CRÍTICO' : r.A > 40 ? 'Moderado' : 'Bajo Contro'
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Factor de Riesgo', 'Score', 'Evaluación']],
        body: riskData,
        theme: 'grid',
        headStyles: { fillColor: [PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]] }, // Red
        didParseCell: (data) => {
            if (data.column.index === 2) {
                if (data.cell.raw === 'CRÍTICO') data.cell.styles.textColor = [PREMIUM_COLORS.chart[3][0], PREMIUM_COLORS.chart[3][1], PREMIUM_COLORS.chart[3][2]];
            }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addEnvironmentalSection = (doc: jsPDF, startY: number) => {
    let y = addSectionTitle(doc, "Derechos de Emisión y Mercados de Carbono (CO₂)", startY);

    // Transactions
    const txData = MOCK_ENV_TRANSACTIONS.map(t => [
        t.date,
        t.type === 'BUY' ? 'COMPRA' : 'VENTA',
        t.counterparty,
        `${t.amount} t`,
        formatCurrency(t.price),
        formatCurrency(t.amount * t.price)
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Orden', 'Contraparte', 'Volumen', 'Precio/t', 'Total']],
        body: txData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald
        columnStyles: {
            1: { fontStyle: 'bold' },
            5: { halign: 'right', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
            if (data.column.index === 1) {
                if (data.cell.raw === 'COMPRA') data.cell.styles.textColor = [COLORS.success[0], COLORS.success[1], COLORS.success[2]];
                else data.cell.styles.textColor = [COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]];
            }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};

const addPassionSection = (doc: jsPDF, startY: number) => {
    let y = addSectionTitle(doc, "Activos de Pasión & Coleccionables", startY);

    // KPI Summary Text
    doc.setFontSize(10);
    doc.text(`Valor Total Colección: ${formatCurrency(MOCK_PASSION_METRICS.totalValue)}`, 14, y);
    doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
    doc.text(`+${MOCK_PASSION_METRICS.appreciation}% Revalorización (CAGR)`, 100, y);
    y += 15;

    // Valuation Gap Visual (Purchase vs Market)
    const purchPrice = MOCK_PASSION_METRICS.totalValue * 0.75; // Mock: bought for 75% of current value
    const marketValue = MOCK_PASSION_METRICS.totalValue;
    const gap = marketValue - purchPrice;

    doc.setFontSize(12);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.text("Análisis de Valor: Coste vs Mercado", 14, y);
    y += 8;

    const barW = 140;
    const barH = 15;

    // Background (Market Value)
    doc.setFillColor(PREMIUM_COLORS.chart[0][0], PREMIUM_COLORS.chart[0][1], PREMIUM_COLORS.chart[0][2]); // Blue
    doc.rect(14, y, barW, barH, 'F');
    doc.setTextColor(255);
    doc.setFontSize(9);
    doc.text("Valor de Mercado Actual", 20, y + 10);
    doc.text(formatCurrency(marketValue), 140, y + 10, { align: 'right' });

    // Overlay (Purchase Cost)
    const purchW = (purchPrice / marketValue) * barW;
    doc.setFillColor(PREMIUM_COLORS.slate[0], PREMIUM_COLORS.slate[1], PREMIUM_COLORS.slate[2]); // Gray
    doc.rect(14, y, purchW, barH, 'F');
    doc.setTextColor(255);
    doc.text("Coste de Adquisición", 20, y + 10);
    doc.text(formatCurrency(purchPrice), purchW - 5, y + 10, { align: 'right' });

    // Gap Label
    doc.setTextColor(PREMIUM_COLORS.chart[1][0], PREMIUM_COLORS.chart[1][1], PREMIUM_COLORS.chart[1][2]); // Green
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`+${formatCurrency(gap)} (Plusvalía Latente)`, 14 + barW + 5, y + 10);

    y += 25;

    const assets = PASSION_PORTFOLIO.map(p => [
        p.name,
        p.category.toUpperCase(),
        formatCurrency(p.value),
        p.trend
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Pieza / Activo', 'Categoría', 'Valoración', 'Tendencia']],
        body: assets,
        theme: 'striped',
        headStyles: { fillColor: [217, 70, 239] }, // Fuchsia
        columnStyles: {
            2: { halign: 'right', fontStyle: 'bold' },
            3: { halign: 'right', textColor: [COLORS.success[0], COLORS.success[1], COLORS.success[2]] }
        }
    });

    return (doc as any).lastAutoTable.finalY + 15;
};


// --- MAIN GENERATOR ---

export const generateIntegratedReport = async (selectedModules: string[], reportTitle: string, data: ReportData, aiContent?: AIReportAnalysis) => {

    // Attach AI Content to data object to pass it down easily or handle separately
    // We already augmented data usage above with strict casting (data as any).aiContent
    // Let's ensure it's on the object we pass
    const dataWithAI = { ...data, aiContent };

    try {
        const doc = new jsPDF();

        // 1. PREMIUM COVER PAGE
        console.log("Adding cover page...");
        addPremiumCover(doc, reportTitle);

        let yPos = 40;

        // --- MODULE ORCHESTRATION ---

        if (selectedModules.includes('summary')) {
            console.log("Adding summary section...");
            doc.addPage();
            addPremiumHeader(doc, "MEMORIA EJECUTIVA");
            yPos = 40;
            yPos = addSummarySection(doc, yPos, dataWithAI); // Only Narrative now

            // PAGE 3: DASHBOARD (New separate page)
            doc.addPage();
            addPremiumHeader(doc, "CUADRO DE MANDO");
            yPos = 40;
            if (addDashboardSection) { // Safety check if function exists in scope (it does now)
                addDashboardSection(doc, yPos, dataWithAI);
            }


            // PAGE 3: MACRO ANALYSIS (NEW)
            doc.addPage();
            addPremiumHeader(doc, "MACROECONOMÍA");
            yPos = 40;
            yPos = addMacroAnalysisSection(doc, yPos, dataWithAI);

            // PAGE 4: STRATEGY (NEW)
            doc.addPage();
            addPremiumHeader(doc, "ESTRATEGIA DE INVERSIÓN");
            yPos = 40;
            yPos = addStrategySection(doc, yPos, dataWithAI);

            // PAGE 5: SECTOR & GEO (NEW)
            doc.addPage();
            addPremiumHeader(doc, "VISIÓN SECTORIAL Y GEOGRÁFICA");
            yPos = 40;
            yPos = addSectorAndGeoSection(doc, yPos, dataWithAI);

            // PAGE 6: TACTICAL RECOMMENDATIONS
            if (yPos > 200) { doc.addPage(); yPos = 40; }
            yPos = addStrategicAnalysis(doc, yPos, dataWithAI);
        }

        if (selectedModules.includes('portfolio')) {
            doc.addPage();
            addPremiumHeader(doc, "CARTERA FINANCIERA");
            yPos = 40;
            yPos = addPortfolioSection(doc, yPos, dataWithAI);
        }

        if (selectedModules.includes('real_estate')) {
            doc.addPage();
            addPremiumHeader(doc, "REAL ESTATE");
            yPos = 40;
            yPos = addRealEstateSection(doc, yPos);
        }

        if (selectedModules.includes('private_equity')) {
            doc.addPage();
            addPremiumHeader(doc, "PRIVATE EQUITY & VC");
            yPos = 40;
            yPos = addPESection(doc, yPos, dataWithAI);
        }

        if (selectedModules.includes('crypto')) {
            doc.addPage();
            addPremiumHeader(doc, "CRIPTOACTIVOS");
            yPos = 40;
            yPos = addCryptoSection(doc, yPos);
        }

        if (selectedModules.includes('treasury')) {
            doc.addPage();
            addPremiumHeader(doc, "TESORERÍA & CASH FLOW");
            yPos = 40;
            yPos = addTreasurySection(doc, yPos, dataWithAI);
        }

        if (selectedModules.includes('business')) {
            doc.addPage();
            addPremiumHeader(doc, "NEGOCIO FAMILIAR");
            yPos = 40;
            yPos = addBusinessSection(doc, yPos);
        }

        if (selectedModules.includes('risks')) {
            doc.addPage();
            addPremiumHeader(doc, "MATRIZ DE RIESGOS");
            yPos = 40;
            yPos = addRiskSection(doc, yPos, dataWithAI);
        }

        if (selectedModules.includes('environmental')) {
            doc.addPage();
            addPremiumHeader(doc, "IMPACTO Y SOSTENIBILIDAD");
            yPos = 40;
            yPos = addEnvironmentalSection(doc, yPos);
        }

        if (selectedModules.includes('passion_assets')) {
            doc.addPage();
            addPremiumHeader(doc, "COLECCIONABLES");
            yPos = 40;
            yPos = addPassionSection(doc, yPos);
        }

        if (selectedModules.includes('impact')) {
            doc.addPage();
            addPremiumHeader(doc, "FILANTROPÍA");
            yPos = 40;
            yPos = addPhilanthropySection(doc, yPos, dataWithAI);
        }

        // Add Premium Footer to ALL pages (except cover which is page 1)
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 2; i <= pageCount; i++) {
            doc.setPage(i);
            addPremiumFooter(doc, i);
        }

        // Save using robust helper to force filename
        await triggerDownload(doc, 'Nexus_Report_Premium.pdf');

        return true; // Indicate success

    } catch (error) {
        console.error("Error generating integrated report:", error);
        alert("Error generando el informe integrado.");
        throw error;
    }
};


// --- EXPORTS OF SPECIFIC REPORTS (Legacy support or Quick Actions) ---
export const generatePrivateEquityReport = (data: ReportData) => generateIntegratedReport(['private_equity'], "Informe Private Equity Q4", data);
export const generateLiquidityReport = async () => {
    // Keep the specialized liquidity report as it has very specific format/text
    try {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const time = new Date().toLocaleTimeString('es-ES');

        // -- CONFIG COLORS --
        const colors = COLORS;

        // -- HEADER --
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("ALERTA DE RIESGO: LIQUIDEZ", 14, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(APP_NAME.toUpperCase(), 14, 30);
        doc.text(`Generado: ${date} ${time}`, 196, 20, { align: 'right' });
        doc.text("Ref: RISK-LIQ-2026-003", 196, 30, { align: 'right' });

        // -- ALERT BANNER --
        doc.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
        doc.rect(14, 50, 182, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("ALERTA DETECTADA: CASH RUNWAY < 18 MESES", 105, 58, { align: 'center' });

        let yPos = 75;

        // -- 1. EXECUTIVE SUMMARY --
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFontSize(14);
        doc.text("1. Resumen Ejecutivo de Tesorería", 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const summaryText = "El análisis de estrés de liquidez indica una reducción proyectada en el flujo de caja operativo debido a compromisos de capital en Private Equity y una ralentización en los ingresos por alquileres comerciales. La cobertura actual de gastos fijos ha descendido por debajo del umbral de seguridad de 24 meses.";
        const splitSummary = doc.splitTextToSize(summaryText, 180);
        doc.text(splitSummary, 14, yPos);
        yPos += 20;

        // -- 2. KEY METRICS --
        const metricsData = [
            ['Indicador Clave', 'Valor Actual', 'Umbral Seguridad', 'Estado'],
            ['Tesorería Disponible', '1.68M €', '3.5M €', 'ALERT'],
            ['Burn Rate Mensual', '280k €', '< 250k €', 'WARNING'],
            ['Runway Estimado', '6.0 Meses', '> 24 Meses', 'ALERT'],
            ['Ratio Liquidez (Quick)', '0.8x', '> 1.5x', 'ALERT']
        ];

        autoTable(doc, {
            startY: yPos,
            head: [metricsData[0]],
            body: metricsData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: [colors.text[0], colors.text[1], colors.text[2]] },
            columnStyles: {
                0: { fontStyle: 'bold' },
                3: { fontStyle: 'bold', halign: 'center' }
            },
            didParseCell: (data) => {
                if (data.column.index === 3) {
                    const status = data.cell.raw;
                    if (status === 'OK') data.cell.styles.textColor = [colors.success[0], colors.success[1], colors.success[2]];
                    if (status === 'WARNING') data.cell.styles.textColor = [colors.warning[0], colors.warning[1], colors.warning[2]];
                    if (status === 'ALERT') data.cell.styles.textColor = [colors.alert[0], colors.alert[1], colors.alert[2]];
                }
            }
        });

        // -- 3. CASH FLOW FORECAST (NEXT 6 MONTHS) --
        yPos = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text("2. Proyección de Flujo de Caja (6 Meses)", 14, yPos);
        yPos += 8;

        const cashFlowData = [
            ['Mes', 'Ingresos Previstos', 'Gastos Operativos', 'Capital Calls (PE)', 'Flujo Neto'],
            ['Feb 2026', '450k €', '(280k €)', '(500k €)', '(330k €)'],
            ['Mar 2026', '420k €', '(285k €)', '0 €', '+135k €'],
            ['Abr 2026', '460k €', '(280k €)', '(1.2M €)', '(1.02M €)'],
            ['May 2026', '410k €', '(290k €)', '0 €', '+120k €'],
            ['Jun 2026', '480k €', '(280k €)', '(200k €)', '0 €'],
            ['Jul 2026', '430k €', '(285k €)', '0 €', '+145k €']
        ];

        autoTable(doc, {
            startY: yPos,
            head: [cashFlowData[0]],
            body: cashFlowData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [colors.secondary[0], colors.secondary[1], colors.secondary[2]], textColor: 255 },
            columnStyles: {
                1: { halign: 'right', textColor: [colors.success[0], colors.success[1], colors.success[2]] },
                2: { halign: 'right', textColor: [colors.alert[0], colors.alert[1], colors.alert[2]] },
                3: { halign: 'right', textColor: [colors.warning[0], colors.warning[1], colors.warning[2]] },
                4: { halign: 'right', fontStyle: 'bold' }
            },
            didParseCell: (data) => {
                if (data.column.index === 4) {
                    const val = data.cell.raw as string;
                    if (val.includes('(')) data.cell.styles.textColor = [colors.alert[0], colors.alert[1], colors.alert[2]];
                    else if (val !== '0 €') data.cell.styles.textColor = [colors.success[0], colors.success[1], colors.success[2]];
                }
            }
        });

        // -- 4. RECOMMENDATIONS --
        yPos = (doc as any).lastAutoTable.finalY + 15;
        // Check page break
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text("3. Acciones Recomendadas", 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text([
            "• REVISIÓN DE GASTOS: Implementar plan de austeridad operativa para reducir el burn rate mensual.",
            "• COBERTURA DE LIQUIDEZ: Evaluar venta parcial de posiciones en ETF S&P 500 para cubrir el déficit proyectado en Abril.",
            "• NEGOCIACIÓN DE RENTAS: Revisar contratos de alquiler del edificio Castellón Centro.",
            "• PAUSA DE INVERSIONES: Detener nuevas inversiones ilíquidas hasta restablecer el buffer de 24 meses."
        ], 20, yPos, { lineHeightFactor: 1.5 });

        // Add Premium Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            addPremiumFooter(doc, i);
        }

        // Save using robust helper
        await triggerDownload(doc, 'Nexus_Risk_Alert_Liquidity_2026.pdf');

    } catch (error) {
        console.error("Error generating liquidity report:", error);
        alert("Error generando el informe de liquidez.");
    }
};
// --- ENHANCED USER MANUAL GENERATOR ---

// Helper for Manual Sections
const addManualSection = (
    doc: jsPDF,
    title: string,
    intro: string,
    features: { name: string; desc: string; usage?: string }[],
    kpis: { name: string; formula: string; meaning: string }[],
    pageNum: number
) => {
    doc.addPage();
    addPremiumHeader(doc, `Módulo: ${title}`);
    let y = 40;

    // 1. Concept / Intro
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Propósito y Estrategia", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(intro, 180), 14, y);
    y += 25;

    // 2. Interface Guide
    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Guía de Interfaz & Uso", 14, y);
    y += 10;

    features.forEach(feat => {
        // Feature Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, 182, 28, 2, 2, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 28, 2, 2, 'D');

        // Title
        doc.setFontSize(11);
        doc.setTextColor(PREMIUM_COLORS.chart[0][0], PREMIUM_COLORS.chart[0][1], PREMIUM_COLORS.chart[0][2]); // Blue
        doc.setFont('helvetica', 'bold');
        doc.text(feat.name, 18, y + 8);

        // Desc
        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(feat.desc, 170), 18, y + 16);

        // Usage Tip (if exists)
        if (feat.usage) {
            doc.setFontSize(8);
            doc.setTextColor(PREMIUM_COLORS.gold[0], PREMIUM_COLORS.gold[1], PREMIUM_COLORS.gold[2]);
            doc.setFont('helvetica', 'italic');
            doc.text(`Tip: ${feat.usage}`, 18, y + 24);
        }

        y += 32;

        // Overflow Check
        if (y > 250) {
            addPremiumFooter(doc, pageNum);
            doc.addPage();
            addPremiumHeader(doc, `Módulo: ${title} (Cont.)`);
            y = 40;
        }
    });

    // 3. Technical KPIs
    y += 5;
    if (y > 230) {
        addPremiumFooter(doc, pageNum);
        doc.addPage();
        addPremiumHeader(doc, `Módulo: ${title} (KPIs)`);
        y = 40;
    }

    doc.setFontSize(14);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Métricas Clave (KPIs)", 14, y);
    y += 10;

    kpis.forEach(kpi => {
        doc.setFontSize(10);
        doc.setTextColor(PREMIUM_COLORS.slate[0], PREMIUM_COLORS.slate[1], PREMIUM_COLORS.slate[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(kpi.name, 14, y);

        // Formula in monospace
        doc.setFont('courier', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(kpi.formula, 80, y);

        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.text(doc.splitTextToSize(kpi.meaning, 180), 14, y);

        y += 12; // Spacing
    });

    addPremiumFooter(doc, pageNum);
    return pageNum + 1; // Return next page number
};

export const generateUserManual = () => {
    const doc = new jsPDF();
    let pageNum = 1;

    // 1. Cover
    addPremiumCover(doc, "Manual de Operaciones & Glosario");

    // 2. Introduction
    doc.addPage();
    addPremiumHeader(doc, "Introducción al Sistema");
    let y = 40;

    doc.setFontSize(18);
    doc.setTextColor(PREMIUM_COLORS.navy[0], PREMIUM_COLORS.navy[1], PREMIUM_COLORS.navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text("Filosofía 'Ariete' en Gestión Patrimonial", 14, y);
    y += 15;

    const philosophy = "Este sistema no es un simple visor de cuentas. Es una herramienta diseñada para la gestión proactiva. Permite detectar riesgos ocultos, simular escenarios de estrés ('Black Swans') y optimizar cada euro ocioso. Nuestra filosofía se basa en tres pilares:\n\n1. Visibilidad Total: Eliminar silos de información entre bancos y gestores.\n2. Acción Inmediata: Herramientas para ejecutar decisiones (rebalanceos, coberturas) en tiempo real.\n3. Estrategia a Largo Plazo: Planificación generacional y de impacto.";

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    doc.text(doc.splitTextToSize(philosophy, 180), 14, y);

    addPremiumFooter(doc, pageNum++);


    // 3. MODULE DEEP DIVES

    // A. DASHBOARD
    pageNum = addManualSection(
        doc,
        "Dashboard Principal",
        "El centro de mando para el CEO/Family Officer. Aquí se responde en 5 segundos a la pregunta: '¿Cómo estamos hoy?'. Prioriza las alertas críticas sobre los datos estáticos.",
        [
            { name: "Semáforo del Comité", desc: "Indicador de estado general. Verde (Normal), Amarillo (Atención: Liquidez/Desviación), Rojo (Crítico: Pérdida >10%).", usage: "Si está en Rojo, haga clic para ver el desglose del riesgo activo." },
            { name: "Top Movers", desc: "Lista de los 3 activos que más han afectado al NAV este mes, tanto positiva como negativamente.", usage: "Úselo para identificar rápidamente la fuente de volatilidad mensual." },
            { name: "Resumen de Liquidez", desc: "Muestra el efectivo disponible inmediatamente para cubrir Capital Calls.", usage: "Mantenga siempre un colchón del 10% del NAV." }
        ],
        [
            { name: "NAV Total", formula: "Σ (Activos) - Σ (Pasivos)", meaning: "Valor neto de liquidación del patrimonio familiar." },
            { name: "YTD Change", formula: "((NAV Hoy / NAV 1-Ene) - 1) * 100", meaning: "Crecimiento orgánico del capital en lo que va de año." }
        ],
        pageNum
    );

    // B. PORTFOLIO
    pageNum = addManualSection(
        doc,
        "Portfolio (Mercados Públicos)",
        "Gestión de activos cotizados (Renta Variable, Renta Fija, ETFs). El objetivo es mantener la asignación estratégica definida por el comité de inversión.",
        [
            { name: "AI Rebalancing Bot", desc: "Algoritmo que detecta desviaciones (Drift). Si la RV sube mucho, sugiere vender para comprar RF y mantener el equilibrio.", usage: "Haga clic en 'Ejecutar Rebalanceo' para generar las órdenes de venta/compra sugeridas." },
            { name: "Selector de Custodios", desc: "Filtro para ver posiciones por banco depositario (ej. UBS vs JP Morgan).", usage: "Útil para comparar comisiones y rendimiento entre bancos." },
            { name: "Análisis de Rentabilidad", desc: "Gráfico de evolución vs S&P 500.", usage: "Active el 'Benchmark' para ver si estamos batiendo al mercado." }
        ],
        [
            { name: "Portfolio Drift", formula: "|Alloc Actual - Alloc Objetivo|", meaning: "Distancia porcentual frente a la estrategia ideal. >5% requiere acción." },
            { name: "Weighted Yield", formula: "Σ (Yield Activo * Peso Activo)", meaning: "Rentabilidad por dividendo/cupón esperada de la cartera." }
        ],
        pageNum
    );

    // C. PRIVATE EQUITY
    pageNum = addManualSection(
        doc,
        "Private Equity & Venture Capital",
        "Inversiones en empresas no cotizadas. Requiere gestión de compromisos de capital y seguimiento de valoraciones trimestrales.",
        [
            { name: "Simulador Waterfall", desc: "Herramienta visual para entender cuánto dinero recibimos en una venta (Exit) tras pagar al gestor (Carry).", usage: "Ajuste el 'Exit Valuation' para ver cómo cambia su retorno neto." },
            { name: "Control de Capital Calls", desc: "Calendario de desembolsos pendientes.", usage: "Revise esta sección mensualmente para asegurar liquidez en Tesorería." },
            { name: "Gráfico Curva J", desc: "Visualización del ciclo de vida del fondo.", usage: "Identifique fondos en fase de 'Harvest' (cosecha) vs 'Investment' (inversión)." }
        ],
        [
            { name: "TVPI (MOIC)", formula: "(Valor Actual + Distribuciones) / Capital Llamado", meaning: "Múltiplo total. 1.5x significa que el valor es 1.5 veces lo invertido." },
            { name: "DPI", formula: "Distribuciones / Capital Llamado", meaning: "Dinero efectivo recuperado. >1.0x significa 'Risk Free' (capital recuperado)." },
            { name: "Unfunded Commitment", formula: "Compromiso Total - Capital Llamado", meaning: "Pasivo latente. Dinero que el fondo puede pedirnos en cualquier momento." }
        ],
        pageNum
    );

    // D. REAL ESTATE
    pageNum = addManualSection(
        doc,
        "Real Estate (Inmobiliario)",
        "Gestión de propiedades físicas. Combina rentas recurrentes con potencial de apreciación de capital mediante reformas.",
        [
            { name: "CapEx Value-Add Planner", desc: "Calculadora para proyectar el retorno de una reforma.", usage: "Introduzca coste de obra y nueva renta esperada para ver el nuevo Yield." },
            { name: "Mapa de Activos", desc: "Vista geográfica de propiedades.", usage: "Filtre por 'Comercial' vs 'Residencial' para ver concentración." },
            { name: "Hold vs Sell", desc: "Análisis de coste de oportunidad.", usage: "¿Vender hoy y reinvertir al 5% o mantener el alquiler actual?" }
        ],
        [
            { name: "Yield on Cost", formula: "Renta Neta Anual / (Precio Compra + Reformas)", meaning: "Rentabilidad real sobre el dinero total invertido." },
            { name: "Loan to Value (LTV)", formula: "Deuda Hipotecaria / Valor Tasación", meaning: "Nivel de apalancamiento. >60% se considera riesgo alto." }
        ],
        pageNum
    );

    // E. TREASURY
    pageNum = addManualSection(
        doc,
        "Tesorería & Cash Management",
        "Gestión del efectivo y equivalentes. El objetivo no es maximizar el retorno, sino garantizar la solvencia y minimizar el coste de oportunidad del dinero parado.",
        [
            { name: "Smart Cash Sweeper", desc: "Escáner de cuentas corrientes. Detecta saldos ociosos >100k€ que no rinden intereses.", usage: "Mueva el excedente a Fondos Monetarios (T-Bills) con un clic." },
            { name: "Planificador Fiscal", desc: "Calendario de pagos de impuestos.", usage: "Reserve liquidez para el pago de IS/IRPF en Julio." }
        ],
        [
            { name: "Cash Runway", formula: "Liquidez Total / Gasto Mensual Medio", meaning: "Meses de vida operativa sin necesidad de vender activos ilíquidos." }
        ],
        pageNum
    );

    // F. LIFESTYLE
    pageNum = addManualSection(
        doc,
        "Lifestyle & Passion Assets",
        "Gestión de activos de disfrute personal (Arte, Coches, Relojes). Aunque son emocionales, representan una parte importante del patrimonio.",
        [
            { name: "Galería Visual", desc: "Inventario digital de piezas con fotos y documentación.", usage: "Use para seguros o planificación sucesoria." },
            { name: "Rastreador de Mercado", desc: "Conecta con índices de precios (ej. Chrono24, ArtPrice) para valorar la colección.", usage: "Actualice anualmente para ver plusvalías latentes." }
        ],
        [
            { name: "Price Appreciation", formula: "Valor Mercado Actual - Precio Compra", meaning: "Plusvalía latente (no realizada) de la colección." }
        ],
        pageNum
    );

    // 4. GLOSSARY (Comprehensive)
    doc.addPage();
    addPremiumHeader(doc, "Glosario Financiero Maestro");
    y = 40;

    const indicators = [
        { name: "Alpha", def: "Rentabilidad extra conseguida por el gestor por encima del mercado. Es la medida de la habilidad ('skill') del gestor." },
        { name: "Beta", def: "Sensibilidad de un activo al mercado. Beta 1.5 significa que si el mercado sube un 10%, el activo sube un 15% (y viceversa). Mide riesgo sistemático." },
        { name: "Catch-up", def: "Cláusula en Private Equity. Tras devolver el capital y el retorno preferente al inversor, el gestor recibe el 100% de los beneficios siguientes hasta igualar su cuota de Carried Interest (normalmente 20%)." },
        { name: "Clawback", def: "Protección para el inversor. Si el gestor cobró comisiones de éxito excesivas en años anteriores y luego el fondo pierde dinero, debe devolverlas." },
        { name: "Correlation", def: "Medida estadística de cómo se mueven dos activos juntos. +1 (se mueven igual), -1 (se mueven opuestos), 0 (sin relación). Buscamos correlación baja para diversificar." },
        { name: "Distressed", def: "Estrategia de inversión en empresas o activos en bancarrota o con graves problemas, comprándolos con gran descuento para reestructurarlos." },
        { name: "Dry Powder", def: "Capital disponible (no invertido) que tienen los fondos de Private Equity listos para hacer compras ('disparar')." },
        { name: "Duration", def: "En Renta Fija, sensibilidad del precio del bono a los cambios en tipos de interés. A mayor duración, mayor riesgo si suben los tipos." },
        { name: "Hurdle Rate", def: "Rentabilidad mínima (ej. 8%) que debe conseguir el fondo para el inversor antes de que el gestor empiece a cobrar su comisión de éxito (Carry)." },
        { name: "High Water Mark", def: "En Hedge Funds, nivel máximo de valor alcanzado. El gestor no cobra comisión de éxito hasta superar este pico histórico (no cobra por recuperar pérdidas)." },
        { name: "J-Curve", def: "Gráfico de flujo de caja neto en Private Equity. Tiene forma de 'J' porque al principio hay salidas (inversión + fees) y al final entradas (ventas)." },
        { name: "Leverage (Apalancamiento)", def: "Uso de deuda para aumentar el tamaño de una inversión. Amplifica tanto las ganancias como las pérdidas." },
        { name: "Liquidity Premium", def: "Rentabilidad extra que exige un inversor por bloquear su dinero en un activo ilíquido (como PE o Real Estate) durante años." },
        { name: "Mezzanine Debt", def: "Deuda subordinada (riesgo intermedio entre deuda senior y equity). Paga un interés alto y a veces tiene derechos de conversión en acciones." },
        { name: "Secondaries", def: "Mercado de compra-venta de participaciones en fondos de Private Equity ya existentes. Permite entrar en fondos maduros y evitar la parte negativa de la Curva J." },
        { name: "Sharpe Ratio", def: "Rentabilidad / Volatilidad. El 'Santo Grial' de la eficiencia. ¿Merece la pena el riesgo que estoy corriendo?" },
        { name: "Vintage Year", def: "Año en que un fondo de Private Equity realiza su primera inversión. Importante para comparar fondos (ej. Vintage 2008 fue difícil, Vintage 2010 fue excelente)." },
        { name: "Yield on Cost", def: "Rentabilidad actual dividida por el coste original. Para inversores a largo plazo, muestra el retorno real sobre su capital inicial, ignorando la subida de precio de mercado." }
    ];

    indicators.forEach((ind, i) => {
        if (y > 270) {
            addPremiumFooter(doc, pageNum++); // Rough page calc
            doc.addPage();
            addPremiumHeader(doc, "Glosario Financiero (Cont.)");
            y = 40;
        }

        // Glossary Item
        doc.setFontSize(11);
        doc.setTextColor(PREMIUM_COLORS.chart[0][0], PREMIUM_COLORS.chart[0][1], PREMIUM_COLORS.chart[0][2]);
        doc.setFont('helvetica', 'bold');
        doc.text(ind.name, 14, y);

        doc.setFontSize(9);
        doc.setTextColor(60);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(ind.def, 180), 14, y + 5);

        y += 20;
    });

    addPremiumFooter(doc, pageNum);

    // Save
    triggerDownload(doc, "Nexus_Manual_Operaciones_PRO.pdf");
};
