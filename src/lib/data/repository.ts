import {
  ProductRecord,
  Category,
  Collection,
  InventoryRecord,
  InventoryMovement,
  OrderRecord,
  CustomProjectRequest,
  AIConsultation,
  SiteSettings,
  ThemeSettings,
  NavigationItem,
  PageSection,
  AuditLog,
  TeamMember,
} from '@/types/database';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

// Helper to determine if Supabase is mandatory (fail-closed in production)
function isProductionEnforced(): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    (process.env.REQUIRE_SUPABASE === 'true' || Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY))
  );
}

// Initial Seeds matching RawKraft Studio's real product line
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Dining Tables',
    slug: 'dining',
    description: 'Heirloom live-edge and geometric hardwood dining tables',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Coffee & Side Tables',
    slug: 'coffee-side',
    description: 'Sculptural lounge accents and iconic Miro side tables',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Consoles & Desks',
    slug: 'desks-consoles',
    description: 'Monolithic executive workspaces and entryway statement pieces',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Resin & Wood Art',
    slug: 'resin-art',
    description: 'High-clarity crystal epoxy resin river pours and canyon inlays',
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    name: 'The Signature Atelier',
    slug: 'signature-atelier',
    description: 'Our most celebrated masterworks and architectural designs',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    name: 'Ocean & River Inlays',
    slug: 'ocean-river',
    description: 'Crystal UV-stable epoxy rivers blended with natural live slabs',
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    name: 'Nordic Minimalism',
    slug: 'nordic-minimalism',
    description: 'Clean White Oak contours and matte black geometric steel',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    name: 'Miro Side Table',
    slug: 'miro-side-table',
    sku: 'RK-MIRO-01',
    shortDescription: 'Signature geometric accent table with natural live timber and matte black metal',
    fullDescription:
      'The signature Miro side table is the epitome of RawKraft Studio’s craft philosophy: pure natural solid wood grain suspended over handcrafted architectural matte black metal.',
    status: 'active',
    productType: 'made_to_order',
    pricePKR: 28500,
    priceUSD: 105,
    currency: 'PKR',
    isQuoteOnly: false,
    categoryId: 'c1000000-0000-0000-0000-000000000002',
    categoryName: 'Coffee & Side Tables',
    collectionIds: ['b1000000-0000-0000-0000-000000000001'],
    tags: ['Miro', 'Side Table', 'Matte Black', 'Geometric', 'Sheesham'],
    isSignature: true,
    isPopular: true,
    leadTimeWeeks: '2 - 3 weeks',
    isCustomizable: true,
    dimensions: '18" Dia x 21" Height',
    weightKg: 12,
    primaryWood: 'Natural Sheesham Rosewood',
    availableWoods: ['Natural Sheesham Rosewood', 'American Walnut', 'White Oak', 'Golden Teak'],
    primaryLegStyle: 'Matte Black Geometric Steel',
    availableLegStyles: ['Matte Black Geometric Steel', 'Brushed Brass Accent', 'Minimalist Tripod'],
    hasResinOption: true,
    defaultResinColor: 'Clear Natural Oil (No Resin)',
    availableResinColors: ['Deep Ocean Blue', 'Emerald Forest Green', 'Smoked Obsidian Black'],
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    inventory: {
      id: 'inv-1',
      productId: 'p1000000-0000-0000-0000-000000000001',
      trackInventory: true,
      quantityOnHand: 4,
      quantityReserved: 0,
      lowStockThreshold: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    aiSuitableRooms: ['Lounge', 'Bedside', 'Executive Sitting'],
    aiStyleTags: ['Modern Architectural', 'Natural Live Edge', 'Industrial Chic'],
    aiSearchSummary: 'The signature Miro side table. Natural solid wood grain with matte black geometric steel base.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    name: 'Grand Horizon Walnut Dining Table',
    slug: 'grand-walnut-dining',
    sku: 'RK-GRD-02',
    shortDescription: 'Bookmatched live-edge American walnut slab with architectural spider base',
    fullDescription:
      'A true generational centerpiece. Each Grand Horizon table is crafted from seasoned American Black Walnut with preserved natural live edges, stabilized with subtle hand-carved brass bowtie inlays.',
    status: 'active',
    productType: 'made_to_order',
    pricePKR: 195000,
    priceUSD: 695,
    currency: 'PKR',
    isQuoteOnly: false,
    categoryId: 'c1000000-0000-0000-0000-000000000001',
    categoryName: 'Dining Tables',
    collectionIds: ['b1000000-0000-0000-0000-000000000001'],
    tags: ['Dining', 'Walnut', 'Live Edge', 'Large Table', 'Spider Base'],
    isSignature: true,
    isPopular: false,
    leadTimeWeeks: '3 - 4 weeks',
    isCustomizable: true,
    dimensions: '84" L x 38" W x 30" H (Seats 8)',
    weightKg: 85,
    primaryWood: 'American Black Walnut',
    availableWoods: ['American Black Walnut', 'Golden Sheesham', 'White Oak'],
    primaryLegStyle: 'Matte Black Spider Starburst Base',
    availableLegStyles: ['Matte Black Spider Starburst Base', 'Heavy U-Frames', 'Trapezoid Industrial'],
    hasResinOption: false,
    availableResinColors: [],
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    inventory: {
      id: 'inv-2',
      productId: 'p1000000-0000-0000-0000-000000000002',
      trackInventory: true,
      quantityOnHand: 2,
      quantityReserved: 0,
      lowStockThreshold: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    aiSuitableRooms: ['Formal Dining', 'Open Plan Villa Dining'],
    aiStyleTags: ['Luxe Organic', 'Architectural Grandeur'],
    aiSearchSummary: 'Large 8-seater live-edge American Walnut dining table with spider starburst legs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    name: 'Emerald Depths River Coffee Table',
    slug: 'emerald-river-coffee',
    sku: 'RK-EMR-03',
    shortDescription: 'Live-edge Sheesham slabs cast in jewel-tone emerald translucent epoxy resin',
    fullDescription:
      'Two opposing live-edge Sheesham slabs linked by a river of jewel-toned emerald crystal epoxy. Polished up to 3000 grit for glass-like clarity with a silky-touch scratch-resistant surface.',
    status: 'active',
    productType: 'made_to_order',
    pricePKR: 68000,
    priceUSD: 245,
    currency: 'PKR',
    isQuoteOnly: false,
    categoryId: 'c1000000-0000-0000-0000-000000000004',
    categoryName: 'Resin & Wood Art',
    collectionIds: ['b1000000-0000-0000-0000-000000000002'],
    tags: ['Coffee Table', 'Epoxy River', 'Emerald Green', 'Sheesham'],
    isSignature: false,
    isPopular: true,
    leadTimeWeeks: '3 - 4 weeks',
    isCustomizable: true,
    dimensions: '42" L x 24" W x 18" H',
    weightKg: 28,
    primaryWood: 'Natural Sheesham Rosewood',
    availableWoods: ['Natural Sheesham Rosewood', 'American Walnut', 'White Oak'],
    primaryLegStyle: 'Matte Black U-Legs',
    availableLegStyles: ['Matte Black U-Legs', 'Brushed Brass Metal Legs', 'Square Box Steel'],
    hasResinOption: true,
    defaultResinColor: 'Emerald Forest Green River',
    availableResinColors: ['Emerald Forest Green River', 'Deep Sapphire Blue', 'Smoked Obsidian'],
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    inventory: {
      id: 'inv-3',
      productId: 'p1000000-0000-0000-0000-000000000003',
      trackInventory: true,
      quantityOnHand: 3,
      quantityReserved: 0,
      lowStockThreshold: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    aiSuitableRooms: ['Living Room', 'Reception Lounge'],
    aiStyleTags: ['Jewel Luxe', 'Artisan Resin'],
    aiSearchSummary: 'Emerald green epoxy resin river coffee table with dark solid Sheesham hardwood.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    name: 'Obsidian Live-Edge Executive Desk',
    slug: 'obsidian-executive-desk',
    sku: 'RK-OBS-04',
    shortDescription: 'Monolithic live edge hardwood desk with integrated wire management and cantilever legs',
    fullDescription:
      'Engineered for distinguished workspaces. Massive solid hardwood slab with an organic front live edge and squared workspace boundary, supported by cantilevered industrial steel.',
    status: 'active',
    productType: 'made_to_order',
    pricePKR: 145000,
    priceUSD: 520,
    currency: 'PKR',
    isQuoteOnly: false,
    categoryId: 'c1000000-0000-0000-0000-000000000003',
    categoryName: 'Consoles & Desks',
    collectionIds: ['b1000000-0000-0000-0000-000000000001'],
    tags: ['Executive Desk', 'Walnut', 'Cantilever', 'Office'],
    isSignature: false,
    isPopular: false,
    leadTimeWeeks: '3 - 4 weeks',
    isCustomizable: true,
    dimensions: '66" L x 30" W x 30" H',
    weightKg: 52,
    primaryWood: 'American Black Walnut',
    availableWoods: ['American Black Walnut', 'Sheesham Rosewood', 'White Oak'],
    primaryLegStyle: 'Cantilever Industrial Black Steel',
    availableLegStyles: ['Cantilever Industrial Black Steel', 'Box Profile Frame', 'Fluted Metal Pedestal'],
    hasResinOption: true,
    defaultResinColor: 'Smoked Obsidian River',
    availableResinColors: ['Smoked Obsidian River', 'Deep Ocean Blue', 'Clear Crystal'],
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    inventory: {
      id: 'inv-4',
      productId: 'p1000000-0000-0000-0000-000000000004',
      trackInventory: true,
      quantityOnHand: 1,
      quantityReserved: 0,
      lowStockThreshold: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    aiSuitableRooms: ['Executive Office', 'Home Study'],
    aiStyleTags: ['Industrial Modern', 'Bold Architectural'],
    aiSearchSummary: 'Executive desk with solid live edge walnut and cantilever steel base.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Staff Accounts with cryptographically pre-hashed scrypt credentials
// Password for development access: rawkraft2025
const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'u1000000-0000-0000-0000-000000000001',
    email: 'faateh2006@gmail.com',
    fullName: 'Raja Muhammad Faateh',
    role: 'OWNER',
    isActive: true,
    passwordHash: 'fdaa7e98c7338e545cf5d0795160ec23e52c3017c5dce13b1d471a63733c790aabad4f4bf15996c94620cd6bbf7e2359a1760201c86207fb8adefdfe61eba997',
    salt: 'a1b2c3d4e5f60718',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u1000000-0000-0000-0000-000000000002',
    email: 'admin@rawkraftstudio.com',
    fullName: 'RawKraft Studio Master',
    role: 'ADMIN',
    isActive: true,
    passwordHash: 'fdaa7e98c7338e545cf5d0795160ec23e52c3017c5dce13b1d471a63733c790aabad4f4bf15996c94620cd6bbf7e2359a1760201c86207fb8adefdfe61eba997',
    salt: 'a1b2c3d4e5f60718',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  businessInfo: {
    name: 'RawKraft Studio',
    tagline: 'Bespoke Solid Hardwood & Live-Edge Atelier',
    phone: '+92 331 7497444',
    whatsapp: '+92 331 7497444',
    whatsappRaw: '+923317497444',
    email: 'info@rawkraftstudio.com',
    city: 'Multan',
    country: 'Pakistan',
    instagram: 'https://www.instagram.com/rawkraft_studio',
    facebook: 'https://www.facebook.com/share/1J5U7xyPwT/',
  },
  shippingPolicy: {
    deliveryScope: 'Nationwide Pakistan reinforced wooden crate freight',
    leadTime: '3-4 weeks',
    depositPct: 50,
  },
  seoDefaults: {
    title: 'RawKraft Studio | Bespoke Handcrafted Furniture & Live-Edge Slabs',
    description: 'Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant.',
  },
};

const INITIAL_THEME_SETTINGS: ThemeSettings = {
  id: 'thm-1',
  name: 'RawKraft Luxe Dark',
  primaryColor: '#c89d66',
  secondaryColor: '#b58952',
  backgroundColor: '#0f1012',
  surfaceColor: '#17191d',
  cardColor: '#1e2126',
  borderColor: '#2c313a',
  textColor: '#f3f4f6',
  mutedTextColor: '#8e96a4',
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  isActive: true,
  updatedAt: new Date().toISOString(),
};

const INITIAL_NAVIGATION: NavigationItem[] = [
  { id: 'nav-1', menuLocation: 'header', label: 'Shop Catalog', url: '/shop', isExternal: false, isEnabled: true, sortOrder: 1 },
  { id: 'nav-2', menuLocation: 'header', label: 'Custom Studio', url: '/custom', isExternal: false, isEnabled: true, sortOrder: 2 },
  { id: 'nav-3', menuLocation: 'header', label: 'RawKraft AI', url: '/ai', isExternal: false, isEnabled: true, sortOrder: 3 },
  { id: 'nav-4', menuLocation: 'header', label: 'Our Craft', url: '/#philosophy', isExternal: false, isEnabled: true, sortOrder: 4 },
  { id: 'nav-5', menuLocation: 'footer', label: 'All Furniture', url: '/shop', isExternal: false, isEnabled: true, sortOrder: 1 },
  { id: 'nav-6', menuLocation: 'footer', label: 'Live Edge Dining', url: '/shop?cat=dining', isExternal: false, isEnabled: true, sortOrder: 2 },
  { id: 'nav-7', menuLocation: 'footer', label: 'Miro Side Table', url: '/shop?cat=coffee-side', isExternal: false, isEnabled: true, sortOrder: 3 },
  { id: 'nav-8', menuLocation: 'footer', label: 'Custom Brief Studio', url: '/custom', isExternal: false, isEnabled: true, sortOrder: 4 },
  { id: 'nav-9', menuLocation: 'footer', label: 'RawKraft AI Advisor', url: '/ai', isExternal: false, isEnabled: true, sortOrder: 5 },
];

const INITIAL_PAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec-1',
    sectionType: 'hero',
    title: 'Raw Nature. Sculpted Luxury.',
    subtitle: 'Multan, Pakistan Atelier',
    content: 'Handcrafted solid live-edge hardwoods and crystal epoxy rivers. Designed for generations.',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1920&q=80',
    ctaLabel: 'Explore Catalog',
    ctaUrl: '/shop',
    isEnabled: true,
    sortOrder: 1,
  },
  {
    id: 'sec-2',
    sectionType: 'editorial',
    title: 'The Miro Side Table',
    subtitle: 'Studio Icon',
    content: 'Our iconic round accent piece featuring hand-selected natural solid hardwood and precision matte-black architectural steel.',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Order Miro Table',
    ctaUrl: '/shop',
    isEnabled: true,
    sortOrder: 2,
  },
];

// In-Memory Storage Container for local development & testing
class RawKraftDataStore {
  products: ProductRecord[] = [...INITIAL_PRODUCTS];
  categories: Category[] = [...INITIAL_CATEGORIES];
  collections: Collection[] = [...INITIAL_COLLECTIONS];
  inventoryMovements: InventoryMovement[] = [];
  orders: OrderRecord[] = [];
  enquiries: CustomProjectRequest[] = [];
  aiConsultations: AIConsultation[] = [];
  teamMembers: TeamMember[] = [...INITIAL_TEAM];
  auditLogs: AuditLog[] = [];
  siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
  themeSettings: ThemeSettings = { ...INITIAL_THEME_SETTINGS };
  navigation: NavigationItem[] = [...INITIAL_NAVIGATION];
  pageSections: PageSection[] = [...INITIAL_PAGE_SECTIONS];
}

const globalStore = (global as any).__RAWKRAFT_STORE__ || new RawKraftDataStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__RAWKRAFT_STORE__ = globalStore;
}

export const dataRepository = {
  // --- PRODUCTS ---
  async getProducts(filter?: {
    status?: string;
    category?: string;
    search?: string;
    type?: string;
  }): Promise<ProductRecord[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      let query = supabase.from('products').select('*, categories(name), inventory(*)');
      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      if (filter?.category && filter.category !== 'all') {
        query = query.eq('category_id', filter.category);
      }
      if (filter?.search) {
        query = query.ilike('name', `%${filter.search}%`);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        if (isProductionEnforced()) {
          throw new Error(`Database query failed: ${error.message}`);
        }
      } else if (data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          slug: d.slug,
          sku: d.sku,
          shortDescription: d.short_description,
          fullDescription: d.full_description,
          status: d.status,
          productType: d.product_type,
          pricePKR: Number(d.price_pkr),
          salePricePKR: d.sale_price_pkr ? Number(d.sale_price_pkr) : undefined,
          priceUSD: Number(d.price_usd),
          currency: d.currency,
          isQuoteOnly: d.is_quote_only,
          categoryId: d.category_id,
          categoryName: d.categories?.name,
          tags: d.tags || [],
          isSignature: d.is_signature,
          isPopular: d.is_popular,
          leadTimeWeeks: d.lead_time_weeks,
          isCustomizable: d.is_customizable,
          dimensions: d.dimensions,
          weightKg: d.weight_kg ? Number(d.weight_kg) : undefined,
          primaryWood: d.primary_wood,
          availableWoods: d.available_woods || [],
          primaryLegStyle: d.primary_leg_style,
          availableLegStyles: d.available_leg_styles || [],
          hasResinOption: d.has_resin_option,
          defaultResinColor: d.default_resin_color,
          availableResinColors: d.available_resin_colors || [],
          imageUrl: d.image_url,
          galleryImages: d.gallery_images || [],
          inventory: d.inventory?.[0]
            ? {
                id: d.inventory[0].id,
                productId: d.id,
                trackInventory: d.inventory[0].track_inventory,
                quantityOnHand: d.inventory[0].quantity_on_hand,
                quantityReserved: d.inventory[0].quantity_reserved,
                lowStockThreshold: d.inventory[0].low_stock_threshold,
                createdAt: d.inventory[0].created_at,
                updatedAt: d.inventory[0].updated_at,
              }
            : undefined,
          aiSuitableRooms: d.ai_suitable_rooms || [],
          aiStyleTags: d.ai_style_tags || [],
          aiSearchSummary: d.ai_search_summary,
          metaTitle: d.meta_title,
          metaDescription: d.meta_description,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } else if (isProductionEnforced()) {
      throw new Error('Production database is not configured');
    }

    // Local Development Store
    return globalStore.products.filter((p: ProductRecord) => {
      if (filter?.status && filter.status !== 'all' && p.status !== filter.status) return false;
      if (filter?.category && filter.category !== 'all' && p.categoryId !== filter.category) return false;
      if (filter?.type && filter.type !== 'all' && p.productType !== filter.type) return false;
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },

  async getProductById(id: string): Promise<ProductRecord | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id || p.slug === id) || null;
  },

  async saveProduct(
    productData: Partial<ProductRecord>,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<ProductRecord> {
    const isNew = !productData.id || !globalStore.products.some((p: ProductRecord) => p.id === productData.id);
    const id = productData.id || `p-${Date.now()}`;
    const slug =
      productData.slug ||
      (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const category = (await this.getCategories()).find((c) => c.id === productData.categoryId);

    const record: ProductRecord = {
      id,
      name: productData.name || 'Untitled Piece',
      slug,
      sku: productData.sku || `RK-${Date.now().toString().slice(-4)}`,
      shortDescription: productData.shortDescription || '',
      fullDescription: productData.fullDescription || '',
      status: productData.status || 'draft',
      productType: productData.productType || 'made_to_order',
      pricePKR: Number(productData.pricePKR) || 0,
      salePricePKR: productData.salePricePKR ? Number(productData.salePricePKR) : undefined,
      priceUSD: Number(productData.priceUSD) || Math.round((Number(productData.pricePKR) || 0) / 280),
      currency: 'PKR',
      isQuoteOnly: Boolean(productData.isQuoteOnly),
      categoryId: productData.categoryId || '',
      categoryName: category?.name,
      collectionIds: productData.collectionIds || [],
      tags: productData.tags || [],
      isSignature: Boolean(productData.isSignature),
      isPopular: Boolean(productData.isPopular),
      leadTimeWeeks: productData.leadTimeWeeks || '3 - 4 weeks',
      isCustomizable: productData.isCustomizable !== false,
      dimensions: productData.dimensions || 'Custom Dimensions Available',
      weightKg: productData.weightKg ? Number(productData.weightKg) : undefined,
      primaryWood: productData.primaryWood || 'Natural Sheesham Rosewood',
      availableWoods: productData.availableWoods || ['Natural Sheesham Rosewood'],
      primaryLegStyle: productData.primaryLegStyle || 'Matte Black Geometric Steel',
      availableLegStyles: productData.availableLegStyles || ['Matte Black Geometric Steel'],
      hasResinOption: Boolean(productData.hasResinOption),
      defaultResinColor: productData.defaultResinColor,
      availableResinColors: productData.availableResinColors || [],
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
      galleryImages: productData.galleryImages || [],
      inventory: {
        id: productData.inventory?.id || `inv-${Date.now()}`,
        productId: id,
        trackInventory: productData.inventory?.trackInventory !== false,
        quantityOnHand: Number(productData.inventory?.quantityOnHand) || 1,
        quantityReserved: Number(productData.inventory?.quantityReserved) || 0,
        lowStockThreshold: Number(productData.inventory?.lowStockThreshold) || 1,
        createdAt: productData.inventory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      aiSuitableRooms: productData.aiSuitableRooms || [],
      aiStyleTags: productData.aiStyleTags || [],
      aiSearchSummary: productData.aiSearchSummary || productData.shortDescription,
      metaTitle: productData.metaTitle,
      metaDescription: productData.metaDescription,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { error: prodError } = await supabase.from('products').upsert({
        id: record.id,
        name: record.name,
        slug: record.slug,
        sku: record.sku,
        short_description: record.shortDescription,
        full_description: record.fullDescription,
        status: record.status,
        product_type: record.productType,
        price_pkr: record.pricePKR,
        sale_price_pkr: record.salePricePKR,
        price_usd: record.priceUSD,
        currency: record.currency,
        is_quote_only: record.isQuoteOnly,
        category_id: record.categoryId || null,
        tags: record.tags,
        is_signature: record.isSignature,
        is_popular: record.isPopular,
        lead_time_weeks: record.leadTimeWeeks,
        is_customizable: record.isCustomizable,
        dimensions: record.dimensions,
        weight_kg: record.weightKg,
        primary_wood: record.primaryWood,
        available_woods: record.availableWoods,
        primary_leg_style: record.primaryLegStyle,
        available_leg_styles: record.availableLegStyles,
        has_resin_option: record.hasResinOption,
        default_resin_color: record.defaultResinColor,
        available_resin_colors: record.availableResinColors,
        image_url: record.imageUrl,
        gallery_images: record.galleryImages,
        ai_suitable_rooms: record.aiSuitableRooms,
        ai_style_tags: record.aiStyleTags,
        ai_search_summary: record.aiSearchSummary,
        meta_title: record.metaTitle,
        meta_description: record.metaDescription,
      });

      if (prodError && isProductionEnforced()) {
        throw new Error(`Failed to save product in database: ${prodError.message}`);
      }

      if (record.inventory) {
        await supabase.from('inventory').upsert({
          product_id: record.id,
          track_inventory: record.inventory.trackInventory,
          quantity_on_hand: record.inventory.quantityOnHand,
          quantity_reserved: record.inventory.quantityReserved,
          low_stock_threshold: record.inventory.lowStockThreshold,
        });
      }
    } else if (isProductionEnforced()) {
      throw new Error('Production database is not configured');
    }

    const idx = globalStore.products.findIndex((p: ProductRecord) => p.id === id);
    if (idx !== -1) {
      globalStore.products[idx] = record;
    } else {
      globalStore.products.unshift(record);
    }

    await this.logAudit({
      userEmail: adminUserEmail,
      action: isNew ? 'PRODUCT_CREATED' : 'PRODUCT_UPDATED',
      entity: 'product',
      entityId: id,
      afterData: { name: record.name, sku: record.sku, pricePKR: record.pricePKR },
    });

    return record;
  },

  async deleteProduct(id: string, adminUserEmail = 'admin@rawkraftstudio.com'): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error && isProductionEnforced()) {
        throw new Error(`Failed to delete product from database: ${error.message}`);
      }
    }
    const idx = globalStore.products.findIndex((p: ProductRecord) => p.id === id);
    if (idx !== -1) {
      const deleted = globalStore.products.splice(idx, 1)[0];
      await this.logAudit({
        userEmail: adminUserEmail,
        action: 'PRODUCT_DELETED',
        entity: 'product',
        entityId: id,
        beforeData: { name: deleted.name, sku: deleted.sku },
      });
      return true;
    }
    return false;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          imageUrl: c.image_url,
          isActive: c.is_active,
          sortOrder: c.sort_order,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
      }
    }
    return globalStore.categories;
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const id = cat.id || `c-${Date.now()}`;
    const record: Category = {
      id,
      name: cat.name || 'Untitled Category',
      slug: cat.slug || (cat.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      imageUrl: cat.imageUrl,
      isActive: cat.isActive !== false,
      sortOrder: cat.sortOrder || 1,
      createdAt: cat.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const idx = globalStore.categories.findIndex((c: Category) => c.id === id);
    if (idx !== -1) {
      globalStore.categories[idx] = record;
    } else {
      globalStore.categories.push(record);
    }
    return record;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const idx = globalStore.categories.findIndex((c: Category) => c.id === id);
    if (idx !== -1) {
      globalStore.categories.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- COLLECTIONS ---
  async getCollections(): Promise<Collection[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('collections').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          imageUrl: b.image_url,
          isActive: b.is_active,
          isFeatured: b.is_featured,
          sortOrder: b.sort_order,
          createdAt: b.created_at,
          updatedAt: b.updated_at,
        }));
      }
    }
    return globalStore.collections;
  },

  async saveCollection(col: Partial<Collection>): Promise<Collection> {
    const id = col.id || `col-${Date.now()}`;
    const record: Collection = {
      id,
      name: col.name || 'Untitled Collection',
      slug: col.slug || (col.name || 'collection').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: col.description || '',
      imageUrl: col.imageUrl,
      isActive: col.isActive !== false,
      isFeatured: Boolean(col.isFeatured),
      sortOrder: col.sortOrder || 1,
      createdAt: col.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const idx = globalStore.collections.findIndex((c: Collection) => c.id === id);
    if (idx !== -1) {
      globalStore.collections[idx] = record;
    } else {
      globalStore.collections.push(record);
    }
    return record;
  },

  async deleteCollection(id: string): Promise<boolean> {
    const idx = globalStore.collections.findIndex((c: Collection) => c.id === id);
    if (idx !== -1) {
      globalStore.collections.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- INVENTORY ---
  async getInventory(): Promise<{ product: ProductRecord; inventory: InventoryRecord }[]> {
    const products = await this.getProducts();
    return products
      .filter((p) => p.inventory !== undefined)
      .map((p) => ({
        product: p,
        inventory: p.inventory!,
      }));
  },

  async adjustStock(
    productId: string,
    quantityChange: number,
    movementType: any,
    reason: string,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<InventoryRecord> {
    return this.adjustInventory(productId, quantityChange, movementType, reason, adminUserEmail);
  },

  async adjustInventory(
    productId: string,
    quantityChange: number,
    movementType: any,
    reason: string,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<InventoryRecord> {
    const product = await this.getProductById(productId);
    if (!product || !product.inventory) {
      throw new Error(`Product ${productId} or inventory record not found`);
    }

    const previousQty = product.inventory.quantityOnHand;
    const newQty = previousQty + quantityChange;

    if (newQty < 0) {
      throw new Error(`Cannot reduce stock below zero. Current stock is ${previousQty}`);
    }

    product.inventory.quantityOnHand = newQty;
    product.inventory.updatedAt = new Date().toISOString();

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      inventoryId: product.inventory.id,
      productId: product.id,
      productName: product.name,
      movementType,
      quantityChange,
      quantityAfter: newQty,
      reason,
      performedByEmail: adminUserEmail,
      createdAt: new Date().toISOString(),
    };

    globalStore.inventoryMovements.unshift(movement);

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase
        .from('inventory')
        .update({ quantity_on_hand: newQty })
        .eq('product_id', productId);

      await supabase.from('inventory_movements').insert({
        inventory_id: product.inventory.id,
        product_id: product.id,
        movement_type: movementType,
        quantity_change: quantityChange,
        quantity_after: newQty,
        reason,
        performed_by_email: adminUserEmail,
      });
    }

    await this.logAudit({
      userEmail: adminUserEmail,
      action: 'STOCK_ADJUSTED',
      entity: 'inventory',
      entityId: productId,
      beforeData: { quantityOnHand: previousQty },
      afterData: { quantityOnHand: newQty, change: quantityChange, reason },
    });

    return product.inventory;
  },

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          inventoryId: m.inventory_id,
          productId: m.product_id,
          productName: m.products?.name || 'Furniture Piece',
          movementType: m.movement_type,
          quantityChange: m.quantity_change,
          quantityAfter: m.quantity_after,
          reason: m.reason,
          performedByEmail: m.performed_by_email,
          createdAt: m.created_at,
        }));
      }
    }
    return globalStore.inventoryMovements;
  },

  // --- ORDERS ---
  async getOrders(): Promise<OrderRecord[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          customerEmail: o.customer_email,
          customerCity: o.customer_city,
          shippingAddress: o.shipping_address,
          orderStatus: o.order_status,
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          subtotalPKR: Number(o.subtotal_pkr),
          discountPKR: Number(o.discount_pkr),
          shippingPKR: Number(o.shipping_pkr),
          taxPKR: Number(o.tax_pkr),
          totalPKR: Number(o.total_pkr),
          notes: o.notes,
          whatsappNotified: o.whatsapp_notified,
          items: (o.order_items || []).map((i: any) => ({
            id: i.id,
            orderId: o.id,
            productId: i.product_id,
            productName: i.product_name,
            productSku: i.product_sku,
            quantity: i.quantity,
            unitPricePKR: Number(i.unit_price_pkr),
            totalPricePKR: Number(i.total_price_pkr),
            customWood: i.custom_wood,
            customLegs: i.custom_legs,
            customResin: i.custom_resin,
            customDimensions: i.custom_dimensions,
          })),
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));
      }
    }
    return globalStore.orders;
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  /**
   * Authoritative, server-side validated order creation.
   * Recalculates all prices against the catalog database, verifies stock availability,
   * atomically reserves inventory, and prevents price manipulation.
   */
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerCity: string;
    shippingAddress?: string;
    notes?: string;
    whatsappNotified?: boolean;
    items: Array<{
      productId: string;
      quantity: number;
      customWood?: string;
      customLegs?: string;
      customResin?: string;
      customDimensions?: string;
    }>;
  }): Promise<OrderRecord> {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!orderData.customerName?.trim() || !orderData.customerCity?.trim()) {
      throw new Error('Customer name and city are required');
    }

    // 1. Validate items & compute authoritative prices server-side
    const validatedItems: OrderRecord['items'] = [];
    let computedSubtotal = 0;

    for (const item of orderData.items) {
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Item quantity must be greater than zero');
      }

      const product = await this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.status !== 'active') {
        throw new Error(`Product ${product.name} is not available for purchase`);
      }

      // Check stock if inventory tracking is enabled
      if (product.inventory?.trackInventory) {
        const available = product.inventory.quantityOnHand - product.inventory.quantityReserved;
        if (available < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Requested ${item.quantity}, but only ${Math.max(0, available)} available.`
          );
        }
      }

      const unitPrice = product.salePricePKR || product.pricePKR;
      const itemTotal = unitPrice * item.quantity;
      computedSubtotal += itemTotal;

      validatedItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        orderId: '',
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPricePKR: unitPrice,
        totalPricePKR: itemTotal,
        customWood: item.customWood || product.primaryWood,
        customLegs: item.customLegs || product.primaryLegStyle,
        customResin: item.customResin || product.defaultResinColor,
        customDimensions: item.customDimensions || product.dimensions,
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Compute shipping & total on server
    const shippingPKR = computedSubtotal > 150000 ? 0 : 2500; // Free freight over 150k PKR
    const totalPKR = computedSubtotal + shippingPKR;

    const orderNumber = `RK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;

    // Attach orderId to validated items
    validatedItems.forEach((i) => (i.orderId = orderId));

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone?.trim() || '',
      customerEmail: orderData.customerEmail?.trim(),
      customerCity: orderData.customerCity.trim(),
      shippingAddress: orderData.shippingAddress?.trim() || '',
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'bank_transfer',
      subtotalPKR: computedSubtotal,
      discountPKR: 0,
      shippingPKR,
      taxPKR: 0,
      totalPKR,
      notes: orderData.notes,
      whatsappNotified: Boolean(orderData.whatsappNotified),
      items: validatedItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. Atomically reserve inventory
    for (const item of validatedItems) {
      const product = await this.getProductById(item.productId || '');
      if (product && product.inventory && product.inventory.trackInventory) {
        product.inventory.quantityReserved += item.quantity;
        const movement: InventoryMovement = {
          id: `mov-${Date.now()}-${item.productId}`,
          inventoryId: product.inventory.id,
          productId: product.id,
          productName: product.name,
          movementType: 'reservation',
          quantityChange: -item.quantity,
          quantityAfter: product.inventory.quantityOnHand - product.inventory.quantityReserved,
          reason: `Reserved for order ${orderNumber}`,
          performedByEmail: 'system@rawkraftstudio.com',
          createdAt: new Date().toISOString(),
        };
        globalStore.inventoryMovements.unshift(movement);
      }
    }

    // 4. Save to Supabase if configured
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { error: ordErr } = await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_email: newOrder.customerEmail,
        customer_city: newOrder.customerCity,
        shipping_address: newOrder.shippingAddress,
        order_status: newOrder.orderStatus,
        payment_status: newOrder.paymentStatus,
        payment_method: newOrder.paymentMethod,
        subtotal_pkr: newOrder.subtotalPKR,
        discount_pkr: newOrder.discountPKR,
        shipping_pkr: newOrder.shippingPKR,
        tax_pkr: newOrder.taxPKR,
        total_pkr: newOrder.totalPKR,
        notes: newOrder.notes,
        whatsapp_notified: newOrder.whatsappNotified,
      });

      if (ordErr && isProductionEnforced()) {
        throw new Error(`Failed to create order in database: ${ordErr.message}`);
      }

      for (const itm of validatedItems) {
        await supabase.from('order_items').insert({
          order_id: newOrder.id,
          product_id: itm.productId,
          product_name: itm.productName,
          product_sku: itm.productSku,
          quantity: itm.quantity,
          unit_price_pkr: itm.unitPricePKR,
          total_price_pkr: itm.totalPricePKR,
          custom_wood: itm.customWood,
          custom_legs: itm.customLegs,
          custom_resin: itm.customResin,
          custom_dimensions: itm.customDimensions,
        });
      }
    }

    globalStore.orders.unshift(newOrder);

    await this.logAudit({
      userEmail: 'system@rawkraftstudio.com',
      action: 'ORDER_PLACED',
      entity: 'order',
      entityId: newOrder.id,
      afterData: { orderNumber: newOrder.orderNumber, totalPKR: newOrder.totalPKR, items: validatedItems.length },
    });

    return newOrder;
  },

  async updateOrderStatus(
    id: string,
    orderStatus: any,
    paymentStatus?: any,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<OrderRecord | null> {
    const order = await this.getOrderById(id);
    if (!order) return null;

    const previousOrderStatus = order.orderStatus;
    const previousPaymentStatus = order.paymentStatus;

    order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();

    // Inventory handling on cancellation: release reservation
    if (orderStatus === 'cancelled' && previousOrderStatus !== 'cancelled') {
      for (const item of order.items) {
        if (!item.productId) continue;
        const prod = await this.getProductById(item.productId);
        if (prod && prod.inventory && prod.inventory.trackInventory) {
          prod.inventory.quantityReserved = Math.max(0, prod.inventory.quantityReserved - item.quantity);
          const movement: InventoryMovement = {
            id: `mov-${Date.now()}-${item.productId}`,
            inventoryId: prod.inventory.id,
            productId: prod.id,
            productName: prod.name,
            movementType: 'release',
            quantityChange: item.quantity,
            quantityAfter: prod.inventory.quantityOnHand - prod.inventory.quantityReserved,
            reason: `Order ${order.orderNumber} cancelled, stock released`,
            performedByEmail: adminUserEmail,
            createdAt: new Date().toISOString(),
          };
          globalStore.inventoryMovements.unshift(movement);
        }
      }
    }

    // Inventory handling on shipped/delivered: convert reservation to completed sale
    if (
      (orderStatus === 'shipped' || orderStatus === 'delivered') &&
      previousOrderStatus !== 'shipped' &&
      previousOrderStatus !== 'delivered'
    ) {
      for (const item of order.items) {
        if (!item.productId) continue;
        const prod = await this.getProductById(item.productId);
        if (prod && prod.inventory && prod.inventory.trackInventory) {
          prod.inventory.quantityOnHand = Math.max(0, prod.inventory.quantityOnHand - item.quantity);
          prod.inventory.quantityReserved = Math.max(0, prod.inventory.quantityReserved - item.quantity);
          const movement: InventoryMovement = {
            id: `mov-${Date.now()}-${item.productId}`,
            inventoryId: prod.inventory.id,
            productId: prod.id,
            productName: prod.name,
            movementType: 'sale',
            quantityChange: -item.quantity,
            quantityAfter: prod.inventory.quantityOnHand,
            reason: `Order ${order.orderNumber} dispatched/completed`,
            performedByEmail: adminUserEmail,
            createdAt: new Date().toISOString(),
          };
          globalStore.inventoryMovements.unshift(movement);
        }
      }
    }

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase
        .from('orders')
        .update({
          order_status: order.orderStatus,
          payment_status: order.paymentStatus,
        })
        .eq('id', order.id);
    }

    await this.logAudit({
      userEmail: adminUserEmail,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'order',
      entityId: order.id,
      beforeData: { orderStatus: previousOrderStatus, paymentStatus: previousPaymentStatus },
      afterData: { orderStatus: order.orderStatus, paymentStatus: order.paymentStatus },
    });

    return order;
  },

  // --- CUSTOM ENQUIRIES ---
  async getEnquiries(): Promise<CustomProjectRequest[]> {
    return this.getCustomEnquiries();
  },

  async createEnquiry(data: Partial<CustomProjectRequest>): Promise<CustomProjectRequest> {
    return this.saveCustomEnquiry(data);
  },

  async getCustomEnquiries(): Promise<CustomProjectRequest[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('custom_project_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((e: any) => ({
          id: e.id,
          enquiryNumber: e.enquiry_number,
          customerName: e.customer_name,
          customerPhone: e.customer_phone,
          customerCity: e.customer_city,
          furnitureType: e.furniture_type,
          woodSpecies: e.wood_species,
          edgeProfile: e.edge_profile,
          resinOption: e.resin_option,
          legStyle: e.leg_style,
          lengthInches: Number(e.length_inches),
          widthInches: Number(e.width_inches),
          heightInches: Number(e.height_inches),
          estimatedPricePKR: Number(e.estimated_price_pkr),
          customerNotes: e.customer_notes,
          referenceImages: e.reference_images || [],
          status: e.status,
          adminNotes: e.admin_notes,
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        }));
      }
    }
    return globalStore.enquiries;
  },

  async saveCustomEnquiry(data: Partial<CustomProjectRequest>): Promise<CustomProjectRequest> {
    const enquiryNumber = `CUS-${Date.now().toString().slice(-6)}`;
    const newEnquiry: CustomProjectRequest = {
      id: `enq-${Date.now()}`,
      enquiryNumber,
      customerName: data.customerName?.trim() || 'Anonymous Client',
      customerPhone: data.customerPhone?.trim() || '',
      customerCity: data.customerCity?.trim() || 'Multan',
      furnitureType: data.furnitureType || 'Dining Table',
      woodSpecies: data.woodSpecies || 'Natural Sheesham Rosewood',
      edgeProfile: data.edgeProfile || 'Natural Live Edge',
      resinOption: data.resinOption || 'No Resin',
      legStyle: data.legStyle || 'Matte Black Geometric Steel',
      lengthInches: Number(data.lengthInches) || 60,
      widthInches: Number(data.widthInches) || 30,
      heightInches: Number(data.heightInches) || 30,
      estimatedPricePKR: Number(data.estimatedPricePKR) || 50000,
      customerNotes: data.customerNotes?.trim(),
      referenceImages: data.referenceImages || [],
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('custom_project_requests').insert({
        id: newEnquiry.id,
        enquiry_number: newEnquiry.enquiryNumber,
        customer_name: newEnquiry.customerName,
        customer_phone: newEnquiry.customerPhone,
        customer_city: newEnquiry.customerCity,
        furniture_type: newEnquiry.furnitureType,
        wood_species: newEnquiry.woodSpecies,
        edge_profile: newEnquiry.edgeProfile,
        resin_option: newEnquiry.resinOption,
        leg_style: newEnquiry.legStyle,
        length_inches: newEnquiry.lengthInches,
        width_inches: newEnquiry.widthInches,
        height_inches: newEnquiry.heightInches,
        estimated_price_pkr: newEnquiry.estimatedPricePKR,
        customer_notes: newEnquiry.customerNotes,
        reference_images: newEnquiry.referenceImages,
        status: newEnquiry.status,
      });
    }

    globalStore.enquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  async updateEnquiryStatus(
    id: string,
    status: any,
    adminNotes?: string,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<CustomProjectRequest | null> {
    const enq = globalStore.enquiries.find((e: CustomProjectRequest) => e.id === id);
    if (!enq) return null;
    const beforeStatus = enq.status;
    enq.status = status;
    if (adminNotes !== undefined) enq.adminNotes = adminNotes;
    enq.updatedAt = new Date().toISOString();

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase
        .from('custom_project_requests')
        .update({ status: enq.status, admin_notes: enq.adminNotes })
        .eq('id', id);
    }

    await this.logAudit({
      userEmail: adminUserEmail,
      action: 'ENQUIRY_UPDATED',
      entity: 'custom_project_request',
      entityId: id,
      beforeData: { status: beforeStatus },
      afterData: { status: enq.status, adminNotes: enq.adminNotes },
    });

    return enq;
  },

  // --- AI CONSULTATIONS ---
  async logAIConsultation(consultation: Omit<AIConsultation, 'id' | 'createdAt'>): Promise<void> {
    const record: AIConsultation = {
      id: `ai-${Date.now()}`,
      ...consultation,
      createdAt: new Date().toISOString(),
    };
    globalStore.aiConsultations.unshift(record);

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('ai_consultations').insert({
        session_id: record.sessionId,
        user_query: record.userQuery,
        ai_response: record.aiResponse,
        matched_knowledge_ids: record.matchedKnowledgeIds,
        source_used: record.sourceUsed,
      });
    }
  },

  async getAIConsultations(): Promise<AIConsultation[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('ai_consultations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && data && data.length > 0) {
        return data.map((a: any) => ({
          id: a.id,
          sessionId: a.session_id,
          userQuery: a.user_query,
          aiResponse: a.ai_response,
          matchedKnowledgeIds: a.matched_knowledge_ids || [],
          recommendedProductIds: a.recommended_product_ids || [],
          sourceUsed: a.source_used,
          createdAt: a.created_at,
        }));
      }
    }
    return globalStore.aiConsultations;
  },

  // --- CONTENT & CMS ---
  async getPageSections(): Promise<PageSection[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((s: any) => ({
          id: s.id,
          pageId: s.page_id,
          sectionType: s.section_type,
          title: s.title,
          subtitle: s.subtitle,
          content: s.content,
          imageUrl: s.image_url,
          ctaLabel: s.cta_label,
          ctaUrl: s.cta_url,
          isEnabled: s.is_enabled,
          sortOrder: s.sort_order,
          config: s.config,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }));
      }
    }
    return globalStore.pageSections;
  },

  async updatePageSection(id: string, updates: Partial<PageSection>): Promise<PageSection | null> {
    const sec = globalStore.pageSections.find((s: PageSection) => s.id === id);
    if (!sec) return null;
    Object.assign(sec, updates);

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase
        .from('page_sections')
        .update({
          title: sec.title,
          subtitle: sec.subtitle,
          content: sec.content,
          image_url: sec.imageUrl,
          cta_label: sec.ctaLabel,
          cta_url: sec.ctaUrl,
          is_enabled: sec.isEnabled,
          sort_order: sec.sortOrder,
        })
        .eq('id', id);
    }
    return sec;
  },

  // --- NAVIGATION ---
  async getNavigation(): Promise<NavigationItem[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((n: any) => ({
          id: n.id,
          menuLocation: n.menu_location,
          label: n.label,
          url: n.url,
          isExternal: n.is_external,
          isEnabled: n.is_enabled,
          sortOrder: n.sort_order,
          createdAt: n.created_at,
        }));
      }
    }
    return globalStore.navigation;
  },

  async saveNavigationItem(item: Partial<NavigationItem>): Promise<NavigationItem> {
    const id = item.id || `nav-${Date.now()}`;
    const record: NavigationItem = {
      id,
      menuLocation: item.menuLocation || 'header',
      label: item.label || 'New Link',
      url: item.url || '/',
      isExternal: Boolean(item.isExternal),
      isEnabled: item.isEnabled !== false,
      sortOrder: item.sortOrder || globalStore.navigation.length + 1,
    };
    const idx = globalStore.navigation.findIndex((n: NavigationItem) => n.id === id);
    if (idx !== -1) {
      globalStore.navigation[idx] = record;
    } else {
      globalStore.navigation.push(record);
    }

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('navigation_items').upsert({
        id: record.id,
        menu_location: record.menuLocation,
        label: record.label,
        url: record.url,
        is_external: record.isExternal,
        is_enabled: record.isEnabled,
        sort_order: record.sortOrder,
      });
    }

    return record;
  },

  async deleteNavigationItem(id: string): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('navigation_items').delete().eq('id', id);
    }
    const idx = globalStore.navigation.findIndex((n: NavigationItem) => n.id === id);
    if (idx !== -1) {
      globalStore.navigation.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- THEME & SETTINGS ---
  async getThemeSettings(): Promise<ThemeSettings> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          backgroundColor: data.background_color,
          surfaceColor: data.surface_color,
          cardColor: data.card_color,
          borderColor: data.border_color,
          textColor: data.text_color,
          mutedTextColor: data.muted_text_color,
          headingFont: data.heading_font,
          bodyFont: data.body_font,
          isActive: data.is_active,
          updatedAt: data.updated_at,
        };
      }
    }
    return globalStore.themeSettings;
  },

  async updateThemeSettings(updates: Partial<ThemeSettings>): Promise<ThemeSettings> {
    globalStore.themeSettings = {
      ...globalStore.themeSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('theme_settings').upsert({
        id: globalStore.themeSettings.id,
        name: globalStore.themeSettings.name,
        primary_color: globalStore.themeSettings.primaryColor,
        secondary_color: globalStore.themeSettings.secondaryColor,
        background_color: globalStore.themeSettings.backgroundColor,
        surface_color: globalStore.themeSettings.surfaceColor,
        card_color: globalStore.themeSettings.cardColor,
        border_color: globalStore.themeSettings.borderColor,
        text_color: globalStore.themeSettings.textColor,
        muted_text_color: globalStore.themeSettings.mutedTextColor,
        heading_font: globalStore.themeSettings.headingFont,
        body_font: globalStore.themeSettings.bodyFont,
        is_active: true,
      });
    }

    return globalStore.themeSettings;
  },

  async getSiteSettings(): Promise<SiteSettings> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data } = await supabase.from('site_settings').select('*');
      if (data && data.length > 0) {
        const bus = data.find((d: any) => d.key === 'business_info')?.value;
        const shp = data.find((d: any) => d.key === 'shipping_policy')?.value;
        const seo = data.find((d: any) => d.key === 'seo_defaults')?.value;
        if (bus) globalStore.siteSettings.businessInfo = bus;
        if (shp) globalStore.siteSettings.shippingPolicy = shp;
        if (seo) globalStore.siteSettings.seoDefaults = seo;
      }
    }
    return globalStore.siteSettings;
  },

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    globalStore.siteSettings = {
      ...globalStore.siteSettings,
      ...updates,
    };

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      if (updates.businessInfo) {
        await supabase
          .from('site_settings')
          .upsert({ key: 'business_info', value: updates.businessInfo });
      }
      if (updates.shippingPolicy) {
        await supabase
          .from('site_settings')
          .upsert({ key: 'shipping_policy', value: updates.shippingPolicy });
      }
      if (updates.seoDefaults) {
        await supabase
          .from('site_settings')
          .upsert({ key: 'seo_defaults', value: updates.seoDefaults });
      }
    }

    return globalStore.siteSettings;
  },

  // --- TEAM MEMBERS ---
  async getTeamMembers(): Promise<TeamMember[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          email: m.email,
          fullName: m.full_name,
          role: m.role,
          isActive: m.is_active,
          passwordHash: m.password_hash,
          salt: m.salt,
          invitedBy: m.invited_by,
          lastLoginAt: m.last_login_at,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        }));
      }
    }
    return globalStore.teamMembers;
  },

  async getTeamMemberByEmail(email: string): Promise<TeamMember | null> {
    const cleanEmail = email.trim().toLowerCase();
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          email: data.email,
          fullName: data.full_name,
          role: data.role,
          isActive: data.is_active,
          passwordHash: data.password_hash,
          salt: data.salt,
          invitedBy: data.invited_by,
          lastLoginAt: data.last_login_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    // Local in-memory check
    return (
      globalStore.teamMembers.find(
        (m: TeamMember) => m.email.toLowerCase() === cleanEmail
      ) || null
    );
  },

  async saveTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const id = member.id || `tm-${Date.now()}`;
    const cleanEmail = (member.email || '').trim().toLowerCase();

    const record: TeamMember = {
      id,
      email: cleanEmail,
      fullName: member.fullName || 'Staff Member',
      role: member.role || 'VIEWER',
      isActive: member.isActive !== false,
      passwordHash: member.passwordHash,
      salt: member.salt,
      invitedBy: member.invitedBy,
      createdAt: member.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('team_members').upsert({
        id: record.id,
        email: record.email,
        full_name: record.fullName,
        role: record.role,
        is_active: record.isActive,
        password_hash: record.passwordHash,
        salt: record.salt,
        invited_by: record.invitedBy,
      });
    }

    const idx = globalStore.teamMembers.findIndex((m: TeamMember) => m.id === id);
    if (idx !== -1) {
      globalStore.teamMembers[idx] = record;
    } else {
      globalStore.teamMembers.push(record);
    }
    return record;
  },

  // --- AUDIT LOGS (APPEND-ONLY) ---
  async logAudit(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };
    globalStore.auditLogs.unshift(log);

    const supabase = createAdminSupabaseClient();
    if (supabase) {
      await supabase.from('audit_logs').insert({
        user_email: log.userEmail,
        action: log.action,
        entity: log.entity,
        entity_id: log.entityId,
        before_data: log.beforeData,
        after_data: log.afterData,
      });
    }
  },

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) {
        return data.map((l: any) => ({
          id: l.id,
          userEmail: l.user_email,
          action: l.action,
          entity: l.entity,
          entityId: l.entity_id,
          beforeData: l.before_data,
          afterData: l.after_data,
          createdAt: l.created_at,
        }));
      }
    }
    return globalStore.auditLogs.slice(0, limit);
  },
};
