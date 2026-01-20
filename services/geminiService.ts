import { GoogleGenerativeAI } from "@google/generative-ai";

import { getComprehensiveWealthData } from "./aiContext";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

// Lazy initialization to avoid top-level crashes if env is missing
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

const initGemini = () => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
        return null; // Handle gracefully in UI
    }
    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY);
        // Using the flash model for speed/cost effectiveness for the report generation too
        model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: {
                maxOutputTokens: 4000, // Large context for report
                responseMimeType: "application/json" // Force JSON output for the report
            }
        });
    }
    return model;
};

export const generateReportAnalysis = async (dynamicContext: any = {}) => {
    const aiModel = initGemini();
    if (!aiModel) throw new Error("AI Setup Failed");

    const fullData = getComprehensiveWealthData(dynamicContext);
    const dataString = JSON.stringify(fullData);

    const prompt = `
    Role: Eres el Chief Investment Officer (CIO) de Nexus Family Office.
    Task: Generar una "Memoria Mensual" ejecutiva basada estrictamente en los datos JSON proporcionados.
    
    CRITICAL INSTRUCTION: **TODO EL TEXTO DEBE ESTAR EN ESPAÑOL PERFECTO Y PROFESIONAL.** NO USES INGLÉS.
    
    Style: Autoridad de banca privada, exhaustivo, estratégico ("Estilo Ariete Family Office").

    Output Format: JSON con los siguientes campos conteniendo TEXTO EN MARKDOWN (usar negritas **texto** para énfasis):
    {
        "executiveSummary": "Un resumen ejecutivo estrátegico de 1 página entera (aprox 400 palabras). DEBES CITAR el Patrimonio Total (${fullData.totalWealth}) y explicar los cambios. Inventa una 'Decisión del Comité' reciente.",
        "macroAnalysis": "Análisis Macroeconómico Global de 2 páginas (aprox 600 palabras). Profundiza en políticas de Bancos Centrales (BCE/Fed), Inflación, y Geopolítica. Usa jerga financiera avanzada en español ('Ajuste Cuantitativo', 'Curva de Tipos').",
        "strategyNotes": "Informe detallado de Estrategia de Asignación de Activos (600 palabras). Explica POR QUÉ estamos sobre/infraponderados en ciertos sectores. Inventa un 'Giro Táctico' para el trimestre.",
        "sectorFocus": "Nuevo: Análisis sectorial a fondo. Elige un sector (ej. Tecnología o Real Estate) y analízalo en detalle relacionándolo con la cartera.",
        "geoStrategy": "Nuevo: Análisis de exposición geográfica. Comenta sobre riesgos en mercados emergentes vs desarrollados basándote en la cartera.",
        "portfolioPerformance": "Comentario detallado de rendimiento (500 palabras). OBLIGATORIO: Mencionar activos específicos por nombre (ej. '${fullData.assets.realEstate?.[0]?.name || 'Activo Inmobiliario'}'). Inventa razones coherentes para su valoración.",
        "riskAnalysis": "Deep dive en Gestión de Riesgos (400 palabras). Analiza 'Riesgo de Liquidez', 'Beta de Mercado'. Inventa un 'Escenario de Cola' específico que estamos cubriendo.",
        "cashFlowAnalysis": "Análisis de Tesorería. Menciona Capital Calls específicos previstos y cobertura de Burn Rate.",
        "philanthropySpotlight": "Párrafo sobre la Fundación. Inventa un hito reciente logrado este mes."
    }

    Data Context:
    ${dataString}

    Instructions:
    - IDIOMA: SOLO ESPAÑOL.
    - Sé realista pero CREATIVO. El usuario quiere un reporte que parezca escrito por un humano experto, no un robot.
    - INVENTA DETALLES COHERENTES si faltan datos. (Ej: 'La baja en Real Estate se debe a la estacionalidad del Q1').
    - Usa el tono "Nosotros" (El equipo de Family Office).
    - MENCIONA "Comité de Inversiones" y "Revisión Estratégica".
    `;

    try {
        const result = await aiModel.generateContent(prompt);
        const responseText = result.response.text();

        console.log("Full Gemini Response:", responseText); // Full log for debugging

        // 1. Extract JSON block using Regex (Robust against markdown descriptions)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in response");
            throw new Error("Invalid AI Response Format: No JSON block found");
        }

        let cleanText = jsonMatch[0];

        // 2. Sanitize common JSON errors
        // Remove markdown remnants inside the block if any
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');

        try {
            return JSON.parse(cleanText);
        } catch (parseError) {
            console.error("JSON Parse Error on:", cleanText);
            // Attempt simple cleanup of trailing commas (simple case)
            cleanText = cleanText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
            return JSON.parse(cleanText);
        }

    } catch (error) {
        console.error("Gemini Report Gen Error:", error);
        // Fallback Object to prevent "Content Unavailable" blank sections
        return {
            executiveSummary: "Error: No se pudo generar el análisis. Detalle: " + (error as any).message,
            macroAnalysis: "El análisis macroeconómico no se pudo generar correctamente. Por favor intente de nuevo.",
            strategyNotes: "Notas de estrategia no disponibles.",
            sectorFocus: "",
            geoStrategy: "",
            portfolioPerformance: "Datos no disponibles.",
            riskAnalysis: "",
            cashFlowAnalysis: "",
            philanthropySpotlight: ""
        };
    }
};


export const getGeminiResponse = async (
    history: ChatMessage[],
    newMessage: string,
    contextData: any
): Promise<string> => {
    try {
        const aiModel = initGemini();

        // Construct System Prompt with Context
        const systemPrompt = `
        You are Nexus, an elite AI Wealth Advisor for a high-net-worth Family Office.
        Your goal is to provide strategic, data-driven advice based on the user's real-time portfolio data.

        CONTEXT - CURRENT PORTFOLIO STATE:
        ${JSON.stringify(contextData, null, 2)}

        RULES:
        1. BE ACCURATE: Use the provided JSON data as the absolute source of truth. Do not invent numbers.
        2. BE PROFESSIONAL: Tone should be sophisticated, reassuring, and objective (Private Banker style).
        3. BE CONCISE: Executives are busy. Get to the point. Use bullet points for lists.
        4. CURRENCY: Always use Euros (€) and format millions as "M €" (e.g., 138.4M €).
        5. DO NOT mention you are an AI model unless asked. You are "Nexus" or "The System".
        
        If the user asks about something not in the data, politely say you don't have that information yet.
        `;

        // Start Chat Session
        const chat = aiModel.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt + "\n\nHello Nexus." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hello. I am ready to analyze the portfolio." }],
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 2000,
            },
        });

        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        // Return actual error message for debugging
        return `[SYSTEM ERROR] Details: ${error.message || JSON.stringify(error)}`;
    }
};
