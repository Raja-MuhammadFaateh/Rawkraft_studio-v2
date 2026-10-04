# RawKraft Studio

Premium furniture studio website built with Next.js 15.

## Local development

From the project root:

```sh
npm install
npm run dev -- --port 3000
```

Open `http://localhost:3000`.

## RawKraft AI

The `/ai` page uses the OpenAI Responses API through the server route `/api/ai`. The browser never receives the OpenAI API key.

Create `.env.local` from `.env.example` and set:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Optional approved-knowledge retrieval can be enabled later by creating an OpenAI vector store containing RawKraft's verified catalog, materials, customization rules, policies and other business information, then setting:

```env
OPENAI_VECTOR_STORE_ID=vs_...
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

`NEXT_PUBLIC_SITE_URL` must use the final HTTPS production domain so canonical URLs, social metadata, `robots.txt` and `sitemap.xml` never point at a preview deployment. For shared production rate limiting across Vercel instances, configure an Upstash Redis REST database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Without it, the application uses a conservative per-instance fallback.

Do not commit `.env.local` or any API key.

## Deployment

Recommended production path: GitHub → Vercel.

1. Push this repository to a private GitHub repository.
2. Import the repository into Vercel.
3. Add `OPENAI_API_KEY` in Vercel Project Settings → Environment Variables.
4. Optionally add `OPENAI_MODEL` and `OPENAI_VECTOR_STORE_ID`.
5. Deploy and test `/`, `/shop`, `/custom`, `/ai` and `/cart`.
6. Add the RawKraft custom domain in Vercel when the production build is approved.

The current AI knowledge is intentionally conservative: it only treats information in `src/lib/rawkraft-knowledge.ts` and an optional approved vector store as RawKraft business facts. It does not invent prices, stock, lead times or manufacturing promises. Reference images are validated server-side and processed only for the active request; this application does not persist customer briefs or uploads. The custom brief flow prepares a WhatsApp message after validation, so it never claims RawKraft received a brief before the customer actually sends it.

## Contact links

- Instagram: https://www.instagram.com/rawkraft_studio
- Facebook: https://www.facebook.com/share/1J5U7xyPwT/
- WhatsApp: https://wa.me/923317497444
