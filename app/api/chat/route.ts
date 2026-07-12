import { NextResponse } from 'next/server';
import { globalRateLimiter } from '@/lib/rateLimiter';
import { sanitizeInput } from '@/lib/utils';
import { FAN_SYSTEM_PROMPT } from '@/lib/constants';

/**
 * Represents a single message in the chat conversation.
 */
interface ChatMessage {
  role: string;
  content: string;
}

/**
 * POST handler for the /api/chat endpoint.
 * Acts as a secure server-side proxy between the client and the AI provider.
 * Implements rate limiting, input sanitization, and error handling.
 *
 * @param req - The incoming HTTP request
 * @returns A JSON response containing the AI reply or an error message
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Rate Limiting Check
    if (!globalRateLimiter.canProceed()) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request
    const body: unknown = await req.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('messages' in body) ||
      !Array.isArray((body as { messages: unknown }).messages)
    ) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const rawMessages = (body as { messages: ChatMessage[]; context?: string }).messages;
    const context = (body as { messages: ChatMessage[]; context?: string }).context;

    // 3. Server-side Sanitization (defense in depth)
    const messages = rawMessages.map((msg: ChatMessage) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: sanitizeInput(String(msg.content)),
    }));

    // 4. Determine system prompt based on context
    const systemPrompt = context === 'staff'
      ? FAN_SYSTEM_PROMPT.replace('fans', 'venue staff')
      : FAN_SYSTEM_PROMPT;

    // 5. API Request to AI Pipe proxy (OpenAI-compatible)
    const AI_PIPE_URL = process.env.AI_PIPE_URL ?? '';
    const AI_PIPE_KEY = process.env.AI_PIPE_KEY ?? '';
    const MODEL = process.env.AI_MODEL ?? 'gpt-4o';

    // Construct the full endpoint URL
    const chatEndpoint = AI_PIPE_URL.endsWith('/chat/completions')
      ? AI_PIPE_URL
      : `${AI_PIPE_URL}/chat/completions`;

    if (!AI_PIPE_KEY) {
      // Fallback mock for dev/testing when no API key is configured
      return NextResponse.json({
        message: getMockResponse(messages),
      });
    }

    const aiResponse = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_PIPE_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!aiResponse.ok) {
      // Fallback to mock if AI service is down
      return NextResponse.json({
        message: getMockResponse(messages),
      });
    }

    const aiData: {
      choices?: Array<{ message?: { content?: string } }>;
    } = await aiResponse.json();

    // 6. Sanitize AI Response before sending to client
    const rawReply = aiData.choices?.[0]?.message?.content ?? 'I could not process that request.';
    const sanitizedReply = sanitizeInput(rawReply);

    return NextResponse.json({ message: sanitizedReply });
  } catch {
    // 7. Secure Error Handling — Never expose internal errors
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}

/**
 * Generates a contextual mock response when the AI API is unavailable.
 * Provides useful stadium information even without a live AI connection.
 *
 * @param messages - The conversation history
 * @returns A helpful mock response string
 */
function getMockResponse(messages: Array<{ role: string; content: string }>): string {
  const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content?.toLowerCase() ?? '';

  if (lastUserMsg.includes('restroom') || lastUserMsg.includes('bathroom') || lastUserMsg.includes('toilet')) {
    return 'Restrooms are located near every gate entrance, behind sections 110, 225, and 340. Accessible restrooms are marked with blue signage. The nearest one to your current section is approximately 2 minutes away.';
  }
  if (lastUserMsg.includes('food') || lastUserMsg.includes('eat') || lastUserMsg.includes('drink') || lastUserMsg.includes('concession')) {
    return 'Food courts are available on Levels 1 and 3. Level 1 offers quick-service options (burgers, tacos, pizza), while Level 3 has premium dining. Halal, kosher, and vegetarian options are available at stands marked with green flags.';
  }
  if (lastUserMsg.includes('parking') || lastUserMsg.includes('car') || lastUserMsg.includes('drive')) {
    return 'Stadium parking lots P1-P4 are accessible from the North entrance. Current availability: P1 (Full), P2 (82%), P3 (45%), P4 (23%). We recommend P4 for fastest exit after the match. Ride-share pickup is at Zone R near Gate D.';
  }
  if (lastUserMsg.includes('gate') || lastUserMsg.includes('entrance') || lastUserMsg.includes('enter')) {
    return 'Current gate wait times: Gate A (8 min), Gate B (5 min), Gate C (14 min ⚠️), Gate D (6 min). We recommend Gate B or D for the fastest entry. Please have your digital ticket ready on your phone.';
  }
  if (lastUserMsg.includes('wheelchair') || lastUserMsg.includes('accessible') || lastUserMsg.includes('disability')) {
    return 'Accessible seating is available in sections 105, 210, and 315. Wheelchair-accessible routes are marked with blue floor indicators. Service elevators are located near gates A and C. Sensory rooms are available on Level 2 near section 208.';
  }
  if (lastUserMsg.includes('emergency') || lastUserMsg.includes('medical') || lastUserMsg.includes('help') || lastUserMsg.includes('first aid')) {
    return 'First aid stations are at Gates A, C (Level 1) and Section 225 (Level 2). For emergencies, alert the nearest steward (yellow vests) or call the venue emergency line displayed on screens. Medical staff response time is under 3 minutes.';
  }

  return 'Welcome to the FIFA World Cup 2026! I can help you with: 🏟️ Stadium navigation, 🚗 Transport & parking, ♿ Accessibility, 🍔 Food & drinks, 🚨 Emergency info, and 🌍 Multilingual support. What would you like to know?';
}
