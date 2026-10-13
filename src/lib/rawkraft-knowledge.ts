/**
 * RawKraft Studio Official Knowledge Base
 * This serves as the verified source of truth for studio craftsmanship,
 * materials, customization capabilities, and contact details.
 */

export interface KnowledgeItem {
  id: string;
  category: 'about' | 'woods' | 'resin' | 'metal' | 'customization' | 'care' | 'pricing_leadtime' | 'contact';
  question: string;
  answer: string;
  keywords: string[];
}

export const RAWKRAFT_KNOWLEDGE = {
  studio: {
    name: 'RawKraft Studio',
    tagline: 'Handcrafted Bespoke Furniture & Live-Edge Slabs',
    description:
      'RawKraft Studio is a luxury artisan furniture atelier based in Multan, Pakistan, specializing in solid hardwoods (Sheesham, American Walnut, White Oak, Teak), live-edge wood slabs, custom epoxy resin river inlays, and architectural powder-coated metal bases. Each piece is handcrafted to client dimensions.',
    city: 'Multan',
    country: 'Pakistan',
    delivery:
      'Nationwide crated freight shipping across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, etc.) and overseas shipping upon consultation.',
    contact: {
      phone: '+92 331 7497444',
      whatsappUrl: 'https://wa.me/923317497444',
      whatsappRaw: '+923317497444',
      instagram: 'https://www.instagram.com/rawkraft_studio',
      instagramHandle: '@rawkraft_studio',
      facebook: 'https://www.facebook.com/share/1J5U7xyPwT/',
    },
  },

  woodSpecies: [
    {
      name: 'Sheesham (Indian Rosewood / Dalbergia sissoo)',
      character:
        'Indigenous Pakistani hardwood renowned for dramatic high-contrast dark chocolate and golden honey grain patterns. Dense, strong, and heirloom quality.',
      bestFor: 'Dining tables, statement coffee tables, executive desks, consoles.',
      finishes: ['Natural Golden Honey', 'Deep Espresso Wax', 'Clear Matte Polyurethane', 'Semi-Gloss Lacquer'],
    },
    {
      name: 'American Black Walnut',
      character:
        'World-renowned for rich chocolate tones, purplish undertones, and velvety straight-to-wavy grain. Premium stability and refined modern luxury.',
      bestFor: 'Modern dining tables, bespoke conference tables, luxury consoles, floating desks.',
      finishes: ['Raw Natural Hardwax Oil', 'Warm Walnut Stain', 'Ultra-Matte Sealant'],
    },
    {
      name: 'White Oak',
      character:
        'Light golden hue with pronounced ray flecks and distinctive cathedrals. Exceptional hardness, scratch resistance, and clean Scandinavian appeal.',
      bestFor: 'Minimalist dining sets, slatted consoles, coffee tables, fluted panel units.',
      finishes: ['Bleached Nordic White', 'Natural Honey Oak', 'Smoked Charcoal'],
    },
    {
      name: 'Burma / Golden Teak',
      character:
        'Naturally oily timber with warm golden honey amber tone, superb natural moisture resistance, and smooth silken touch.',
      bestFor: 'Patio luxury pieces, bathroom vanity tops, wet bar tables, heirloom dining.',
      finishes: ['Teak Oil Polish', 'Natural Raw Sealant'],
    },
  ],

  resinSpecifications: {
    type: 'Decorative high-clarity casting epoxy resin formulated with UV inhibitors for clear and colored river pours.',
    colorsAvailable: [
      'Deep Ocean Blue (Translucent with metallic turquoise swirl)',
      'Emerald Forest Green (Deep jewel tone)',
      'Smoked Obsidian / Charcoal Black (Semi-transparent black river)',
      'Crystal Clear Water River',
      'Solid Matte Opaque Black',
      'Amber / Bronze Metallic Inlay',
    ],
    careNote:
      'Decorative surface. To maintain surface gloss and prevent heat marks, always use coasters and trivets under hot cups, teapots, and cookware. Not rated as a cutting board (use separate wooden chopping boards for direct knife work). Avoid harsh solvents or direct prolonged outdoor UV exposure.',
  },

  metalFraming: {
    construction: 'Heavy-gauge architectural mild steel or stainless steel, precision welded and finished.',
    finishes: [
      'Matte Black Electrostatic Powder Coating (Signature architectural finish)',
      'Brushed Brass / Antique Gold Powder Coat',
      'Raw Industrial Steel with Clear Protective Sealant',
      'Gunmetal Grey',
      'Pure White Powder Coat',
    ],
    legStyles: [
      'U-Frame / Trapezoid Sturdy Legs',
      'Spider / Starburst Central Pedestal (maximum legroom for dining tables)',
      'Minimalist Geometric & Square Tubing',
      'Cantilever Floating Base (for desks & consoles)',
      'X-Braced Farmhouse Modern',
    ],
  },

  policies: {
    productionTime:
      'Standard made-to-order pieces take approximately 3 to 4 weeks depending on slab seasoning, resin pour depth, and metal fabrication.',
    orderProcess:
      '1. Client submits room dimensions & design preferences (or uses our Custom Builder) -> 2. Workshop confirms timber slab availability with live photographs -> 3. 50% advance deposit to commence fabrication -> 4. Video & photo progress updates during pour and finishing -> 5. Remaining balance upon dispatch.',
    warranty:
      'Structural craftsmanship warranty against joinery and leg welds under normal indoor use. Hardwood is kiln-dried to equilibrium moisture content before crafting to minimize seasonal movement.',
    maintenance:
      'Clean hardwood surfaces and resin with a microfiber cloth dampened with mild soapy water. Never use acetone, alcohol, or bleach. Natural beeswax polish can be reapplied once or twice a year to nourish the timber.',
  },
};

export const RAWKRAFT_FAQ: KnowledgeItem[] = [
  {
    id: 'faq-1',
    category: 'about',
    question: 'Where is RawKraft Studio based and where do you deliver?',
    answer:
      'RawKraft Studio is based in Multan, Pakistan. We deliver nationwide across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Sialkot, and other cities) via reinforced wooden crate transport. International shipping is available upon consultation.',
    keywords: ['location', 'multan', 'where', 'delivery', 'karachi', 'lahore', 'islamabad', 'shipping', 'pakistan'],
  },
  {
    id: 'faq-2',
    category: 'pricing_leadtime',
    question: 'What is the pricing and production lead time for custom pieces?',
    answer:
      'Standard custom pieces take 3 to 4 weeks to craft. Signature accent tables like the Miro Side Table start at PKR 28,500. Coffee tables typically range between PKR 44,000–68,000, and solid live-edge dining tables begin from PKR 145,000 depending on dimensions and timber species. You can configure dimensions and view instant estimates in our Custom Studio.',
    keywords: ['price', 'pricing', 'cost', 'lead time', 'how long', 'timeline', 'weeks', 'custom estimate'],
  },
  {
    id: 'faq-3',
    category: 'woods',
    question: 'Which wood species does RawKraft Studio work with?',
    answer:
      'We work with four premium hardwoods: Indigenous Sheesham (Indian Rosewood - Dalbergia sissoo) for bold, dark golden grain; American Black Walnut for luxurious dark chocolate hues; White Oak for clean modern Nordic grain; and Golden Teak for silken moisture-resistant warmth.',
    keywords: ['wood', 'timber', 'sheesham', 'walnut', 'oak', 'teak', 'rosewood', 'hardwood', 'species'],
  },
  {
    id: 'faq-4',
    category: 'resin',
    question: 'What resin options are available and how do I care for it?',
    answer:
      'We offer high-clarity casting epoxy resin in Deep Ocean Blue, Emerald Forest Green, Smoked Obsidian, and Crystal Clear rivers. For maintenance, always use trivets or coasters under hot teapots and mugs, wipe with a damp microfiber cloth, and avoid abrasive cleaners.',
    keywords: ['resin', 'epoxy', 'river table', 'colors', 'heat', 'care', 'scratch', 'hot'],
  },
  {
    id: 'faq-5',
    category: 'contact',
    question: 'How do I place an order or contact the craftsmen directly?',
    answer:
      'You can select pieces in our Shop Catalog, build a custom brief in our Custom Studio, or speak directly with our craftsmen on WhatsApp at +92 331 7497444. We will share live photos of available hardwood slabs before cutting.',
    keywords: ['order', 'contact', 'whatsapp', 'phone', 'call', 'custom', 'consultation'],
  },
];

export function searchKnowledge(query: string): string {
  const clean = query.toLowerCase().trim();
  const words = clean.split(/\s+/).filter((w) => w.length > 2);

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of RAWKRAFT_FAQ) {
    let score = 0;
    for (const kw of item.keywords) {
      if (clean.includes(kw)) score += 3;
      for (const w of words) {
        if (kw.includes(w) || w.includes(kw)) score += 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore >= 2) {
    return bestMatch.answer;
  }

  return (
    `RawKraft Studio crafts bespoke live-edge solid hardwood and epoxy river furniture in Multan, Pakistan. ` +
    `We work with kiln-dried Sheesham Rosewood, American Walnut, White Oak, and Golden Teak. ` +
    `Every piece is custom crafted to your room dimensions with nationwide crated delivery. ` +
    `For live slab photos and consultations, connect directly on WhatsApp at +92 331 7497444.`
  );
}
