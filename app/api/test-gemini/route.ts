import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Endpoint de prueba para validar la conectividad con Gemini AI
 * GET /api/test-gemini
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'GEMINI_API_KEY no está configurada',
          modelUsed: null,
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Intentar con el modelo más compatible y estable
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const prompt = 'Responde solo con "OK" si puedes leer este mensaje.';
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      data: {
        message: 'Conexión exitosa con Gemini AI',
        response: responseText,
        apiKeyConfigured: true,
        apiKeyLength: process.env.GEMINI_API_KEY.length,
      },
      modelUsed: 'gemini-1.5-flash',
    });
  } catch (error: any) {
    console.error('[Test Gemini] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        modelUsed: null,
        details: {
          apiKeyConfigured: !!process.env.GEMINI_API_KEY,
          apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/test-gemini - Prueba con un prompt personalizado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt: customPrompt } = body;

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
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const prompt = customPrompt || 'Di "Hola" en español.';
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      data: {
        prompt: prompt,
        response: responseText,
      },
      modelUsed: 'gemini-1.5-flash',
    });
  } catch (error: any) {
    console.error('[Test Gemini] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

