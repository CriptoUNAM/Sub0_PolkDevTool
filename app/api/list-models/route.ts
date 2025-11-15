import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * GET /api/list-models - Lista los modelos disponibles en la API
 */
export async function GET(request: NextRequest) {
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
    
    // Intentar obtener la lista de modelos disponibles
    // Nota: La API puede no tener un endpoint directo para listar modelos
    // Vamos a probar modelos conocidos
    const modelsToTest = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-8b',
      'gemini-pro',
      'gemini-pro-vision',
    ];

    const availableModels: string[] = [];
    const unavailableModels: Array<{ model: string; error: string }> = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
        });
        
        // Intentar una llamada simple para verificar si el modelo existe
        const result = await model.generateContent('test');
        const response = result.response.text();
        
        if (response) {
          availableModels.push(modelName);
        }
      } catch (error: any) {
        unavailableModels.push({
          model: modelName,
          error: error.message || 'Error desconocido'
        });
      }
    }

    return NextResponse.json({
      success: true,
      availableModels,
      unavailableModels,
      totalTested: modelsToTest.length,
      recommendation: availableModels.length > 0 
        ? `Usar: ${availableModels[0]}` 
        : 'Ningún modelo disponible. Verifica tu API key y permisos.'
    });
  } catch (error: any) {
    console.error('[List Models] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

