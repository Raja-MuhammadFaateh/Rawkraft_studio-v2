import { NextRequest, NextResponse } from 'next/server';
import { RAWKRAFT_KNOWLEDGE, RAWKRAFT_FAQ, searchKnowledge } from '@/lib/rawkraft-knowledge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are the official RawKraft Studio AI Furniture & Timber Consultant.
RawKraft Studio is a luxury artisan furniture atelier located in Rawalpindi/Islamabad, Pakistan.
Studio facts to uphold conservatively:
- Founder & Workshop Contact: WhatsApp +92 331 7497444 (https://wa.me/923317497444), Instagram @rawkraft_studio.
- Hardwoods worked: Sheesham (Indian Rosewood - Dalbergia sissoo, dense, dramatic golden & dark grain), American Black Walnut (luxurious velvety chocolate tones), White Oak (Nordic bright, cathedral grain, supreme hardness), and Golden Teak (silky honey amber, weather resistant).
- Epoxy Resin: Premium UV-stabilized crystal resin with Shore D 82+ hardness, cured over multi-stage 72-hour slow pours. Heat resistant to 75°C (167°F) for normal tea/coffee mugs, though trivets are advised for boiling cookware. 100% food-safe and VOC-free once cured.
- Finishes: Non-toxic hardwax oils, matte polyurethane sealants, electrostatic matte-black powder coating baked on heavy-gauge architectural mild steel.
- Lead time: Standard 3 to 4 weeks for custom made-to-order commissions.
- Shipping: Nationwide reinforced wooden crate delivery across Pakistan (Karachi, Lahore, Islamabad, Peshawar, etc.) and international freight upon request.
- Signature Pieces: The Miro Side Table (natural round hardwood slab with matte black geometric steel base, PKR 28,500), Grand Horizon Walnut Dining Table, Emerald Depths River Table, Abyss Ocean Blue Table.
- IMPORTANT RULE: Only state verified facts from RawKraft Studio. Do not invent unrealistic production timelines or non-existent materials. Always encourage customers to share their custom room dimensions or message the craftsmen directly on WhatsApp (+92 331 7497444). Keep answers clear, knowledgeable, warm, and articulate.`;

    // 1. Try Gemini API first if GEMINI_API_KEY is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
        });

        const reply = response.text?.trim();
        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back:', geminiError);
      }
    }

    // 2. Try OpenAI API if OPENAI_API_KEY is present
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...(Array.isArray(history) ? history.slice(-6) : []),
              { role: 'user', content: message },
            ],
            temperature: 0.3,
            max_tokens: 600,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (openAiError) {
        console.warn('OpenAI API call failed, falling back:', openAiError);
      }
    }

    // 3. Robust In-Memory Studio Knowledge Base Fallback
    const knowledgeResponse = searchKnowledge(message);
    let fallbackReply = knowledgeResponse;

    const lower = message.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      fallbackReply += `\n\n💡 *Pricing Guide:* Our signature Miro Side Table begins at PKR 28,500. Coffee tables range between PKR 44,000–68,000, and solid live-edge dining tables begin around PKR 150,000–195,000 depending on timber species and dimensions. You can also calculate an instant estimate in our [Custom Studio](/custom).`;
    }

    if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('order')) {
      fallbackReply += `\n\n📲 *Direct Workshop Connection:* You can chat directly with our woodcrafters on WhatsApp at [+92 331 7497444](https://wa.me/923317497444).`;
    }

    // Log consultation to admin repository
    const { dataRepository } = await import('@/lib/data/repository');
    await dataRepository.logAIConsultation({
      sessionId: `session-${Date.now().toString().slice(-4)}`,
      userQuery: message,
      aiResponse: fallbackReply,
      matchedKnowledgeIds: ['studio-policies'],
      recommendedProductIds: [],
      sourceUsed: 'studio-knowledge-base',
    });

    return NextResponse.json({
      reply: fallbackReply,
      source: 'rawkraft-knowledge-base',
    });
  } catch (error: any) {
    console.error('AI route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process consultation',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
