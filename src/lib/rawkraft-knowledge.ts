/**
 * RawKraft Studio Official Knowledge Base
 * This serves as the single source of truth for studio policies, craftsmanship,
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
      'RawKraft Studio is an artisan furniture workshop specializing in solid hardwoods (Sheesham, American Walnut, White Oak, Teak), live-edge wood slabs, custom epoxy resin inlays, and architectural powder-coated metal bases. Each piece is handcrafted to client dimensions.',
    city: 'Rawalpindi / Islamabad',
    country: 'Pakistan',
    delivery: 'Nationwide safe crate shipping across Pakistan (Karachi, Lahore, Islamabad, Peshawar, Multan, Faisalabad, etc.) and overseas freight upon request.',
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
      character: 'Indigenous hardwood renowned for its dramatic, high-contrast dark and golden grain patterns. Highly durable, dense, and naturally rot-resistant.',
      bestFor: 'Dining tables, statement coffee tables, executive desks, consoles.',
      finishes: ['Natural Golden Honey', 'Deep Espresso Wax', 'Clear Matte Polyurethane', 'Semi-Gloss Lacquer'],
    },
    {
      name: 'American Black Walnut',
      character: 'World-renowned for its chocolate hues, purplish undertones, and velvety straight-to-wavy grain. Premium stability and refined luxury look.',
      bestFor: 'Modern dining tables, bespoke conference tables, luxury consoles, floating desks.',
      finishes: ['Raw Natural Hardwax Oil', 'Warm Walnut Stain', 'Ultra-Matte Sealant'],
    },
    {
      name: 'White Oak',
      character: 'Light-to-medium golden hue with pronounced ray flecks and distinctive cathedrals. Extremely hard, scratch-resistant, and Scandinavian modern appeal.',
      bestFor: 'Minimalist dining sets, slatted consoles, coffee tables, fluted panel units.',
      finishes: ['Bleached Nordic White', 'Natural Honey Oak', 'Smoked Charcoal'],
    },
    {
      name: 'Burma / Golden Teak',
      character: 'Naturally oily timber with warm golden honey amber tone, superb moisture resistance, and smooth silken touch.',
      bestFor: 'Outdoor/patio luxury pieces, bathroom vanity tops, wet bar tables, heirloom dining.',
      finishes: ['Teak Oil Polish', 'Natural Raw Sealant'],
    },
  ],

  resinSpecifications: {
    type: 'Commercial-grade, UV-stabilized, non-yellowing crystal clear epoxy resin cured under controlled humidity.',
    colorsAvailable: [
      'Deep Ocean Blue (Translucent with metallic turquoise swirl)',
      'Emerald Forest Green (Deep jewel tone)',
      'Smoked Obsidian / Charcoal Black (Semi-transparent black river)',
      'Crystal Clear Water River',
      'Solid Matte Opaque Black',
      'Amber / Bronze Metallic Inlay',
    ],
    heatResistance: 'Heat resistant up to 75°C (167°F) for normal dining use. For hot cooking pots, boiling kettles, or sizzling pans, always use coasters or trivets to avoid micro-marring.',
    hardness: 'Shore D 82+ rating for supreme durability and scratch resilience.',
    safety: '100% VOC-free once fully cured, food-safe, non-toxic surface.',
  },

  metalFraming: {
    construction: 'Heavy-gauge architectural mild steel or stainless steel, TIG-welded and ground flush.',
    finishes: [
      'Matte Black Textured Powder Coating (Our signature, industrial aesthetic)',
      'Brushed Brass / Antique Gold Powder Coat',
      'Raw Industrial Steel with Clear Protective Sealant',
      'Gunmetal Grey',
      'Pure White Powder Coat',
    ],
    legStyles: [
      'U-Frame / Trapezoid Sturdy Legs',
      'Spider / Starburst Central Pedestal (optimal for legroom in dining tables)',
      'Minimalist Hairpin & Square Tubing',
      'Cantilever Floating Base (for desks & consoles)',
      'X-Braced Farmhouse Modern',
    ],
  },

  policies: {
    productionTime: 'Standard made-to-order pieces take approximately 3 to 4 weeks depending on slab seasoning, resin pour depth, and metal fabrication.',
    orderProcess: '1. Client shares size & design brief (or uses our Custom Builder) -> 2. We confirm timber slab availability with live photos -> 3. 50% advance deposit to commence workshop production -> 4. Video/photo progress updates during resin pour and finishing -> 5. Final balance upon dispatch.',
    warranty: 'Lifetime structural warranty against joinery and leg welds under normal indoor use. Timber is kiln-dried to 8-12% moisture content to prevent seasonal warping.',
    maintenance:
      'Clean wood and resin with a microfiber cloth dampened with mild soapy water. Never use acetone, alcohol, or bleach. Reapply natural beeswax or wood butter once or twice a year to keep timber lustrous.',
  },
};

export const RAWKRAFT_FAQ: KnowledgeItem[] = [
  {
    id: 'wood-selection',
    category: 'woods',
    question: 'Which wood is best for a dining table: Walnut or Sheesham?',
    answer:
      'Both are exceptional hardwoods! Sheesham (Indian Rosewood) offers rich contrast between light golden sapwood and dark brown heartwood, with incredible hardness and distinct grain swirls. Walnut offers a cooler, chocolate-brown uniform luxury tone with velvety grain. For dramatic, bold warmth, choose Sheesham; for minimalist contemporary luxury, choose American Walnut.',
    keywords: ['walnut', 'sheesham', 'dining table', 'wood', 'best wood', 'compare'],
  },
  {
    id: 'resin-care',
    category: 'care',
    question: 'How do I care for and clean epoxy resin live-edge tables?',
    answer:
      'Wipe down using a soft microfiber cloth with warm water and mild dish soap. Avoid harsh chemicals, bleach, or acetone. Always use coasters under boiling hot mugs and trivets under hot cookware (resin handles up to 75°C / 167°F). If fine micro-scratches appear after years of use, resin can be easily re-buffed to high gloss.',
    keywords: ['resin', 'care', 'cleaning', 'clean', 'scratches', 'heat', 'hot'],
  },
  {
    id: 'custom-sizes',
    category: 'customization',
    question: 'Can you build custom furniture to my exact room dimensions?',
    answer:
      'Yes, 100%! Every piece at RawKraft Studio can be custom built to your exact specifications — length, width, height, timber thickness (standard 1.5" to 2.5" thick slabs), wood finish, resin tint, and leg style.',
    keywords: ['custom', 'dimensions', 'size', 'exact', 'measurements', 'bespoke'],
  },
  {
    id: 'dining-table-size-guide',
    category: 'customization',
    question: 'What size dining table do I need for 6 to 8 people?',
    answer:
      'For 6 people, a 6 ft x 3 ft (72" x 36") table is ideal. For 8 people comfortably, we recommend 7.5 ft to 8 ft x 3 ft to 3.5 ft (90"–96" x 36"–42"). For 10+ people, 9 ft to 10 ft is recommended. We also ensure leg placements allow generous knee clearance.',
    keywords: ['dining', 'size', '8 people', '6 people', 'seats', 'dimensions', 'guide'],
  },
  {
    id: 'lead-time',
    category: 'pricing_leadtime',
    question: 'What is your typical production turnaround time?',
    answer:
      'Our standard turnaround is 3 to 4 weeks. Handcrafting solid timber involves kiln-drying, multi-stage epoxy resin layering (requiring 72-hour slow cure to eliminate bubbles), progressive sanding up to 3000 grit, natural oil sealing, and custom steel fabrication.',
    keywords: ['lead time', 'delivery', 'time', 'how long', 'weeks', 'turnaround'],
  },
  {
    id: 'miro-side-table',
    category: 'about',
    question: 'What is the Miro side table?',
    answer:
      'The Miro side table is RawKraft Studio’s signature minimalist accent piece featuring hand-selected natural solid wood with matte black powder-coated steel geometric legs. It is fully customizable in timber species, diameter/height, and resin accent.',
    keywords: ['miro', 'side table', 'signature', 'accent', 'matte black'],
  },
  {
    id: 'nationwide-shipping',
    category: 'pricing_leadtime',
    question: 'Do you deliver across Pakistan?',
    answer:
      'Yes! We deliver nationwide across Pakistan in heavy-duty reinforced wooden crates with foam cushioning. We regularly ship to Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, and other cities.',
    keywords: ['shipping', 'delivery', 'karachi', 'lahore', 'islamabad', 'pakistan', 'crate'],
  },
  {
    id: 'contact-whatsapp',
    category: 'contact',
    question: 'How can I discuss my brief directly with a craftsman?',
    answer:
      'You can reach our lead workshop team directly on WhatsApp at +92 331 7497444 (https://wa.me/923317497444) or message us on Instagram @rawkraft_studio. We can share real photos of active raw timber slabs currently available in the studio.',
    keywords: ['contact', 'whatsapp', 'phone', 'instagram', 'call', 'talk'],
  },
];

export function searchKnowledge(query: string): string {
  const q = query.toLowerCase();
  
  // Direct matches
  const matched = RAWKRAFT_FAQ.filter((faq) =>
    faq.keywords.some((kw) => q.includes(kw)) ||
    faq.question.toLowerCase().includes(q) ||
    q.split(' ').some((word) => word.length > 3 && faq.answer.toLowerCase().includes(word))
  );

  if (matched.length > 0) {
    return matched.map((m) => `**${m.question}**\n${m.answer}`).join('\n\n');
  }

  return `RawKraft Studio specializes in bespoke solid wood and epoxy resin furniture. 
- WhatsApp: +92 331 7497444
- Woods: Sheesham (Indian Rosewood), American Walnut, White Oak, Teak
- Standard Lead Time: 3 to 4 weeks
- Direct custom briefs can be submitted via our Custom Studio or WhatsApp.`;
}
