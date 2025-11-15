import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/check-models - Verifica qué modelos están disponibles
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY no está configurada',
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Lista completa de modelos a probar (actualizado Nov 2025)
    const modelsToTest = [
      // Modelos 2.5 (más recientes)
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.5-flash-lite',
      // Modelos 2.0
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'gemini-2.0-flash-exp',
      // Modelos 1.5
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-8b',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      // Legacy
      'gemini-pro',
      'gemini-pro-vision',
    ];

    const results: Array<{
      model: string;
      available: boolean;
      error?: string;
      tested: boolean;
    }> = [];

    // Probar cada modelo con una llamada simple
    for (const modelName of modelsToTest) {
      try {
        console.log(`[Check Models] Probando: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 10,
          },
        });

        // Intentar generar contenido simple
        const result = await model.generateContent('Hi');
        const response = result.response.text();
        
        if (response && response.length > 0) {
          results.push({
            model: modelName,
            available: true,
            tested: true,
          });
          console.log(`[Check Models] ✅ ${modelName} está disponible`);
        } else {
          results.push({
            model: modelName,
            available: false,
            error: 'Respuesta vacía',
            tested: true,
          });
        }
      } catch (error: any) {
        const errorMsg = error?.message || 'Error desconocido';
        results.push({
          model: modelName,
          available: false,
          error: errorMsg,
          tested: true,
        });
        console.log(`[Check Models] ❌ ${modelName} no disponible: ${errorMsg}`);
      }
    }

    const availableModels = results.filter(r => r.available).map(r => r.model);
    const unavailableModels = results.filter(r => !r.available);

    return NextResponse.json({
      success: true,
      availableModels,
      unavailableModels,
      totalTested: modelsToTest.length,
      recommendation: availableModels.length > 0 
        ? {
            primary: availableModels[0],
            fallback: availableModels.slice(1),
            message: `Usar ${availableModels[0]} como modelo principal`
          }
        : {
            message: 'Ningún modelo disponible. Verifica tu API key y permisos en Google Cloud Console.',
            suggestion: 'Asegúrate de que tu API key tenga acceso a Gemini API y que los modelos estén habilitados.'
          }
    });
  } catch (error: any) {
    console.error('[Check Models] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

