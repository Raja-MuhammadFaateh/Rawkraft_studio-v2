import { dataRepository } from './data/repository';
import { ProductRecord } from '@/types/database';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'dining' | 'coffee-side' | 'desks-consoles' | 'resin-art';
  categoryLabel: string;
  pricePKR: number;
  priceUSD: number;
  image: string;
  additionalImages?: string[];
  dimensions: string;
  defaultWood: string;
  availableWoods: string[];
  defaultLegs: string;
  availableLegs: string[];
  resinOption: boolean;
  resinDefaultColor?: string;
  description: string;
  features: string[];
  leadTimeWeeks: string;
  isSignature?: boolean;
  isPopular?: boolean;
}

// Convert database ProductRecord to public website Product view
export function mapRecordToProduct(r: ProductRecord): Product {
  let cat: 'dining' | 'coffee-side' | 'desks-consoles' | 'resin-art' = 'dining';
  if (r.categoryName?.toLowerCase().includes('coffee') || r.categoryId?.includes('2')) {
    cat = 'coffee-side';
  } else if (r.categoryName?.toLowerCase().includes('desk') || r.categoryName?.toLowerCase().includes('console') || r.categoryId?.includes('3')) {
    cat = 'desks-consoles';
  } else if (r.categoryName?.toLowerCase().includes('resin') || r.categoryId?.includes('4')) {
    cat = 'resin-art';
  }

  return {
    id: r.id,
    name: r.name,
    tagline: r.shortDescription || r.name,
    category: cat,
    categoryLabel: r.categoryName || 'Furniture Piece',
    pricePKR: r.pricePKR,
    priceUSD: r.priceUSD,
    image: r.imageUrl,
    additionalImages: r.galleryImages,
    dimensions: r.dimensions,
    defaultWood: r.primaryWood,
    availableWoods: r.availableWoods,
    defaultLegs: r.primaryLegStyle,
    availableLegs: r.availableLegStyles,
    resinOption: r.hasResinOption,
    resinDefaultColor: r.defaultResinColor,
    description: r.fullDescription || r.shortDescription,
    features: [
      `Solid kiln-dried timber (${r.primaryWood})`,
      `Architectural base: ${r.primaryLegStyle}`,
      r.hasResinOption ? 'UV-stabilized non-yellowing crystal epoxy resin' : 'Non-toxic natural hardwax oil finish',
      `Handcrafted lead time: ${r.leadTimeWeeks}`,
    ],
    leadTimeWeeks: r.leadTimeWeeks,
    isSignature: r.isSignature,
    isPopular: r.isPopular,
  };
}

export async function getLiveCatalogProducts(): Promise<Product[]> {
  const records = await dataRepository.getProducts({ status: 'active' });
  return records.map(mapRecordToProduct);
}

// Initial fallback for client components before dynamic hydration
export const PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    name: 'Miro Side Table',
    tagline: 'Signature geometric accent table with natural live timber and matte black metal',
    category: 'coffee-side',
    categoryLabel: 'Coffee & Side Tables',
    pricePKR: 28500,
    priceUSD: 105,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    dimensions: '18" Dia x 21" Height',
    defaultWood: 'Natural Sheesham Rosewood',
    availableWoods: ['Natural Sheesham Rosewood', 'American Walnut', 'White Oak', 'Golden Teak'],
    defaultLegs: 'Matte Black Geometric Steel',
    availableLegs: ['Matte Black Geometric Steel', 'Brushed Brass Accent', 'Minimalist Tripod'],
    resinOption: true,
    resinDefaultColor: 'Clear Natural Oil (No Resin)',
    description:
      'The signature Miro side table is the epitome of RawKraft Studio’s craft philosophy: pure natural solid wood grain suspended over handcrafted architectural matte black metal.',
    features: [
      'Solid kiln-dried 1.75" thick timber top',
      'Architectural grade TIG-welded mild steel frame',
      'High-durability electrostatic matte black powder coat',
    ],
    leadTimeWeeks: '2 - 3 weeks',
    isSignature: true,
    isPopular: true,
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    name: 'Grand Horizon Walnut Dining Table',
    tagline: 'Bookmatched live-edge American walnut slab with architectural spider base',
    category: 'dining',
    categoryLabel: 'Dining Tables',
    pricePKR: 195000,
    priceUSD: 695,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    dimensions: '84" L x 38" W x 30" H (Seats 8)',
    defaultWood: 'American Black Walnut',
    availableWoods: ['American Black Walnut', 'Golden Sheesham', 'White Oak'],
    defaultLegs: 'Matte Black Spider Starburst Base',
    availableLegs: ['Matte Black Spider Starburst Base', 'Heavy U-Frames', 'Trapezoid Industrial'],
    resinOption: false,
    description:
      'A true generational centerpiece. Each Grand Horizon table is crafted from seasoned American Black Walnut with preserved natural live edges.',
    features: [
      'Bookmatched premium walnut slabs with butterfly keys',
      'Kiln-dried to 9% equilibrium moisture content',
      'Finished with food-safe hardwax oil (zero VOC)',
    ],
    leadTimeWeeks: '3 - 4 weeks',
    isSignature: true,
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    name: 'Emerald Depths River Coffee Table',
    tagline: 'Live-edge Sheesham slabs cast in jewel-tone emerald translucent epoxy resin',
    category: 'resin-art',
    categoryLabel: 'Resin & Wood Art',
    pricePKR: 68000,
    priceUSD: 245,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    dimensions: '42" L x 24" W x 18" H',
    defaultWood: 'Natural Sheesham Rosewood',
    availableWoods: ['Natural Sheesham Rosewood', 'American Walnut', 'White Oak'],
    defaultLegs: 'Matte Black U-Legs',
    availableLegs: ['Matte Black U-Legs', 'Brushed Brass Metal Legs', 'Square Box Steel'],
    resinOption: true,
    resinDefaultColor: 'Emerald Forest Green River',
    description:
      'Two opposing live-edge Sheesham slabs linked by a river of jewel-toned emerald crystal epoxy.',
    features: [
      'UV-stabilized non-yellowing epoxy resin pour',
      'Shore D 82+ hardness for high scratch resistance',
    ],
    leadTimeWeeks: '3 - 4 weeks',
    isPopular: true,
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    name: 'Obsidian Live-Edge Executive Desk',
    tagline: 'Monolithic live edge hardwood desk with integrated wire management and cantilever legs',
    category: 'desks-consoles',
    categoryLabel: 'Consoles & Desks',
    pricePKR: 145000,
    priceUSD: 520,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    dimensions: '66" L x 30" W x 30" H',
    defaultWood: 'American Black Walnut',
    availableWoods: ['American Black Walnut', 'Sheesham Rosewood', 'White Oak'],
    defaultLegs: 'Cantilever Industrial Black Steel',
    availableLegs: ['Cantilever Industrial Black Steel', 'Box Profile Frame'],
    resinOption: true,
    resinDefaultColor: 'Smoked Obsidian River',
    description:
      'Engineered for distinguished workspaces. Massive solid hardwood slab with an organic front live edge.',
    features: ['Solid 2" slab thickness', 'Discreet underside cable channel routes'],
    leadTimeWeeks: '3 - 4 weeks',
  },
];
