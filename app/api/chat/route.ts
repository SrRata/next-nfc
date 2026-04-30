import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, context } = await req.json();

    const result = await streamText({
        model: google('gemini-1.5-flash'),
        system: `Eres LUMEN, un asistente de IA minimalista y eficiente. 
    Tu propósito es ayudar con el registro de asistencia de estudiantes.
    Conoce el contexto de la pantalla actual: ${context}.
    Responde de forma amable, breve y profesional.`,
        messages,
    });

    // OPCIÓN A: Si usas la versión más nueva de 'ai'
    // return result.toDataStreamResponse();

    // OPCIÓN B: (Si la A falla) La forma manual ultra-compatible:
    return result.toTextStreamResponse();
}
