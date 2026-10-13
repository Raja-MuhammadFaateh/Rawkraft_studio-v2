import { NextRequest, NextResponse } from 'next/server';
import { RAWKRAFT_KNOWLEDGE, searchKnowledge } from '@/lib/rawkraft-knowledge';
import { dataRepository } from '@/lib/data/repository';
import { checkRateLimit } from '@/lib/auth/crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // 1. Rate Limiting Check (20 consultations per 15 minutes per IP)
    const rateCheck = checkRateLimit(`ai:${ip}`, 20, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'AI consultation rate limit exceeded. Please wait a moment before sending more messages.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, history } = body;

    // 2. Strict Input Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (cleanMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Message exceeds maximum permitted length of 1,000 characters' },
        { status: 400 }
      );
    }

    // Sanitize and limit history
    const safeHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (
          h &&
          (h.role === 'user' || h.role === 'assistant') &&
          typeof h.content === 'string'
        ) {
          safeHistory.push({
            role: h.role,
            content: h.content.slice(0, 800),
          });
        }
      }
    }

    // 3. Fetch LIVE, authoritative product catalog from database for grounding
    let catalogGrounding = '';
    try {
      const activeProducts = await dataRepository.getProducts({ status: 'active' });
      if (activeProducts.length > 0) {
        catalogGrounding = `Current RawKraft Catalog Pieces:\n` +
          activeProducts
            .slice(0, 10)
            .map(
              (p) =>
                `• ${p.name} (${p.categoryName || 'Furniture'}): PKR ${p.pricePKR.toLocaleString()} (~$${p.priceUSD} USD). Primary timber: ${p.primaryWood}. Lead time: ${p.leadTimeWeeks}. ${p.inventory?.trackInventory ? `In stock: ${p.inventory.quantityOnHand - p.inventory.quantityReserved} units available.` : 'Made to order.'}`
            )
            .join('\n');
      }
    } catch {
      // Catalog grounding fallback
    }

    const systemPrompt = `You are the official RawKraft Studio AI Furniture & Timber Consultant.
RawKraft Studio is a premium bespoke furniture atelier located in Multan, Pakistan.
Authoritative facts:
- Location: Multan, Pakistan. Nationwide crated freight across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, etc.). International shipping available upon request.
- Direct Contact: WhatsApp +92 331 7497444 (https://wa.me/923317497444), Instagram @rawkraft_studio.
- Hardwoods: Sheesham (Indian Rosewood - bold dark & golden grain), American Black Walnut (dark chocolate hues), White Oak (Nordic clean grain), Golden Teak (silky moisture resistance).
- Epoxy Resin: Decorative UV-stabilized crystal casting resin (Ocean Blue, Emerald Green, Smoked Obsidian, Clear). Always recommend coasters/trivets under hot items. Direct cutting on resin is not advised.
- Metal Framing: Heavy-gauge architectural mild steel with baked electrostatic matte-black powder coating.
- Standard Lead Time: 3 to 4 weeks for custom made-to-order pieces. 50% advance deposit to commence fabrication with live photos of slabs sent via WhatsApp.
- Pricing Grounding:
${catalogGrounding || 'The Miro Side Table starts at PKR 28,500. Dining tables start at PKR 145,000+.'}
- Operating Rules:
1. Only state verified facts from RawKraft Studio. Do not invent unrealistic production timelines or non-existent materials.
2. If the user asks for quotes or custom pieces, recommend visiting the Custom Studio (/custom) or connecting on WhatsApp (+92 331 7497444).
3. Be professional, articulate, warm, and helpful. Never promise instant delivery for bespoke pieces.`;

    // 4. Try Gemini API first if configured
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
                  text: `${systemPrompt}\n\nCustomer Question: ${cleanMessage}`,
                },
              ],
            },
          ],
        });

        const reply = response.text?.trim();
        if (reply) {
          await dataRepository.logAIConsultation({
            sessionId: `session-${Date.now().toString().slice(-4)}`,
            userQuery: cleanMessage,
            aiResponse: reply,
            matchedKnowledgeIds: ['studio-policies', 'live-catalog'],
            recommendedProductIds: [],
            sourceUsed: 'gemini-2.5-flash',
          });

          return NextResponse.json({ reply });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back:', geminiError);
      }
    }

    // 5. Try OpenAI API if configured
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
              ...safeHistory.map((h) => ({ role: h.role, content: h.content })),
              { role: 'user', content: cleanMessage },
            ],
            temperature: 0.2,
            max_tokens: 600,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            await dataRepository.logAIConsultation({
              sessionId: `session-${Date.now().toString().slice(-4)}`,
              userQuery: cleanMessage,
              aiResponse: reply,
              matchedKnowledgeIds: ['studio-policies', 'live-catalog'],
              recommendedProductIds: [],
              sourceUsed: 'openai-gpt-4o-mini',
            });

            return NextResponse.json({ reply });
          }
        }
      } catch (openAiError) {
        console.warn('OpenAI API call failed, falling back:', openAiError);
      }
    }

    // 6. Verified Studio Knowledge Base Fallback with Live Database Facts
    const knowledgeResponse = searchKnowledge(cleanMessage);
    let fallbackReply = knowledgeResponse;

    const lower = cleanMessage.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      fallbackReply += `\n\n💡 *Verified Studio Pricing:* The iconic Miro Side Table starts at PKR 28,500. Coffee tables range between PKR 44,000–68,000, and solid live-edge dining tables begin from PKR 145,000 depending on timber species and dimensions. You can configure exact measurements in our [Custom Studio](/custom).`;
    }

    if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('order')) {
      fallbackReply += `\n\n📲 *Direct Workshop Connection:* Chat directly with our master woodcrafters on WhatsApp at [+92 331 7497444](https://wa.me/923317497444).`;
    }

    await dataRepository.logAIConsultation({
      sessionId: `session-${Date.now().toString().slice(-4)}`,
      userQuery: cleanMessage,
      aiResponse: fallbackReply,
      matchedKnowledgeIds: ['studio-policies', 'knowledge-faq'],
      recommendedProductIds: [],
      sourceUsed: 'rawkraft-knowledge-base',
    });

    return NextResponse.json({
      reply: fallbackReply,
      source: 'rawkraft-knowledge-base',
    });
  } catch (error: any) {
    console.error('AI route error:', error);
    return NextResponse.json(
      {
        error: 'Unable to process consultation at this time. Please contact our craftsmen directly on WhatsApp at +92 331 7497444.',
      },
      { status: 500 }
    );
  }
}
