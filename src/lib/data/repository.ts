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
      quantityReserved: 1,
      lowStockThreshold: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    aiSuitableRooms: ['Living Room', 'Reading Nook', 'Master Bedroom'],
    aiStyleTags: ['Modern Industrial', 'Organic Minimalist'],
    aiSearchSummary: 'Round accent side table with solid hardwood round top and welded black steel frame.',
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
    tags: ['Dining Table', 'American Walnut', 'Live Edge', 'Spider Base'],
    isSignature: true,
    isPopular: false,
    leadTimeWeeks: '3 - 4 weeks',
    isCustomizable: true,
    dimensions: '84" L x 38" W x 30" H (Seats 8)',
    weightKg: 68,
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
    aiSuitableRooms: ['Dining Room', 'Villa Dining Hall', 'Conference Room'],
    aiStyleTags: ['Luxury Modern', 'Live Edge Organic'],
    aiSearchSummary: '8 seater live edge American Walnut dining table with heavy duty spider base.',
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
    tags: ['Coffee Table', 'River Table', 'Emerald Resin', 'Sheesham'],
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
    availableResinColors: ['Emerald Forest Green River', 'Deep Ocean Blue', 'Smoked Obsidian Black'],
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
    aiSuitableRooms: ['Living Room', 'Formal Lounge'],
    aiStyleTags: ['Artisan River', 'Jewel Tone'],
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

const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    inventoryId: 'inv-1',
    productId: 'p1000000-0000-0000-0000-000000000001',
    productName: 'Miro Side Table',
    movementType: 'initial_stock',
    quantityChange: 5,
    quantityAfter: 5,
    reason: 'Initial kiln-seasoned batch completed in workshop',
    performedByEmail: 'workshop@rawkraftstudio.com',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mov-2',
    inventoryId: 'inv-1',
    productId: 'p1000000-0000-0000-0000-000000000001',
    productName: 'Miro Side Table',
    movementType: 'reservation',
    quantityChange: -1,
    quantityAfter: 4,
    reason: 'Client order reservation for Islamabad penthouse',
    performedByEmail: 'orders@rawkraftstudio.com',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1001',
    orderNumber: 'RK-2025-001',
    customerName: 'Zubair Qureshi',
    customerPhone: '+92 300 8501234',
    customerEmail: 'zubair.q@gmail.com',
    customerCity: 'Islamabad',
    shippingAddress: 'House 14, Street 28, Sector F-7/2, Islamabad',
    orderStatus: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    subtotalPKR: 28500,
    discountPKR: 0,
    shippingPKR: 2500,
    taxPKR: 0,
    totalPKR: 31000,
    notes: 'Please verify the live grain slab photos before final hardwax oiling.',
    whatsappNotified: true,
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1001',
        productId: 'p1000000-0000-0000-0000-000000000001',
        productName: 'Miro Side Table',
        productSku: 'RK-MIRO-01',
        quantity: 1,
        unitPricePKR: 28500,
        totalPricePKR: 28500,
        customWood: 'Natural Sheesham Rosewood',
        customLegs: 'Matte Black Geometric Steel',
        customDimensions: '18" Dia x 21" Height',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_ENQUIRIES: CustomProjectRequest[] = [
  {
    id: 'enq-5001',
    enquiryNumber: 'ENQ-2025-089',
    customerName: 'Hamza Farooq',
    customerPhone: '+92 321 5567890',
    customerCity: 'Lahore (DHA Phase 6)',
    furnitureType: 'Dining Table',
    woodSpecies: 'American Black Walnut',
    edgeProfile: 'Natural Organic Live Edge',
    resinOption: 'Smoked Obsidian Black River',
    legStyle: 'Matte Black Spider Starburst Base',
    lengthInches: 96,
    widthInches: 42,
    heightInches: 30,
    estimatedPricePKR: 245000,
    customerNotes: 'Need 10-seater capacity for newly renovated modern dining room. Slabs must have dramatic grain.',
    referenceImages: [],
    status: 'reviewing',
    adminNotes: 'Checked warehouse slab inventory. Slabs #W-41 and #W-42 match the 8ft bookmatch brief.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    email: 'faateh2006@gmail.com',
    fullName: 'Raja Muhammad Faateh',
    role: 'OWNER',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tm-2',
    email: 'admin@rawkraftstudio.com',
    fullName: 'RawKraft Master Artisan',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userEmail: 'faateh2006@gmail.com',
    action: 'SYSTEM_BOOTSTRAP',
    entity: 'system',
    entityId: 'initial',
    afterData: { note: 'Production admin dashboard initialized' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
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
    city: 'Rawalpindi / Islamabad',
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
    description:
      'Premium bespoke furniture studio website with interactive catalog, custom piece configurator, WhatsApp brief builder, and studio AI design consultant.',
  },
};

const INITIAL_THEME_SETTINGS: ThemeSettings = {
  id: 'theme-default',
  name: 'RawKraft Luxe Atelier',
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
    id: 'sec-hero',
    sectionType: 'hero',
    title: 'Where Raw Nature Meets Surgical Craftsmanship',
    subtitle: 'Raw Wood • Crystal Epoxy Resin • Architectural Steel',
    content: 'Bespoke solid hardwood furniture sculpted from generational Sheesham, American Walnut, White Oak, and crystal resin river slabs.',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=85',
    ctaLabel: 'Explore Collection',
    ctaUrl: '/shop',
    isEnabled: true,
    sortOrder: 1,
  },
  {
    id: 'sec-miro',
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

// Persistent In-Memory Storage container for fast, zero-delay execution
class RawKraftDataStore {
  products: ProductRecord[] = [...INITIAL_PRODUCTS];
  categories: Category[] = [...INITIAL_CATEGORIES];
  collections: Collection[] = [...INITIAL_COLLECTIONS];
  inventoryMovements: InventoryMovement[] = [...INITIAL_INVENTORY_MOVEMENTS];
  orders: OrderRecord[] = [...INITIAL_ORDERS];
  enquiries: CustomProjectRequest[] = [...INITIAL_ENQUIRIES];
  aiConsultations: AIConsultation[] = [];
  teamMembers: TeamMember[] = [...INITIAL_TEAM];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
  themeSettings: ThemeSettings = { ...INITIAL_THEME_SETTINGS };
  navigation: NavigationItem[] = [...INITIAL_NAVIGATION];
  pageSections: PageSection[] = [...INITIAL_PAGE_SECTIONS];
}

// Global singleton across serverless invokes in memory
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
      try {
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
        if (!error && data && data.length > 0) {
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
      } catch (err) {
        console.warn('Supabase query failed, using local store:', err);
      }
    }

    // Local Store Fallback
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

    const category = globalStore.categories.find((c: Category) => c.id === productData.categoryId);

    const fullRecord: ProductRecord = {
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
      priceUSD: Math.round((Number(productData.pricePKR) || 0) / 280),
      currency: 'PKR',
      isQuoteOnly: Boolean(productData.isQuoteOnly),
      categoryId: productData.categoryId || globalStore.categories[0]?.id || '',
      categoryName: category?.name,
      collectionIds: productData.collectionIds || [],
      tags: productData.tags || [],
      isSignature: Boolean(productData.isSignature),
      isPopular: Boolean(productData.isPopular),
      leadTimeWeeks: productData.leadTimeWeeks || '3-4 weeks',
      isCustomizable: productData.isCustomizable !== false,
      dimensions: productData.dimensions || 'Custom specifications',
      weightKg: productData.weightKg,
      primaryWood: productData.primaryWood || 'Natural Sheesham Rosewood',
      availableWoods: productData.availableWoods || ['Natural Sheesham Rosewood', 'American Walnut'],
      primaryLegStyle: productData.primaryLegStyle || 'Matte Black Geometric Steel',
      availableLegStyles: productData.availableLegStyles || ['Matte Black Geometric Steel'],
      hasResinOption: Boolean(productData.hasResinOption),
      defaultResinColor: productData.defaultResinColor,
      availableResinColors: productData.availableResinColors || [],
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
      galleryImages: productData.galleryImages || [],
      inventory: {
        id: `inv-${id}`,
        productId: id,
        trackInventory: true,
        quantityOnHand: productData.inventory?.quantityOnHand ?? 2,
        quantityReserved: productData.inventory?.quantityReserved ?? 0,
        lowStockThreshold: productData.inventory?.lowStockThreshold ?? 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      aiSuitableRooms: productData.aiSuitableRooms || ['Living Room'],
      aiStyleTags: productData.aiStyleTags || ['Artisan'],
      aiSearchSummary: productData.aiSearchSummary,
      metaTitle: productData.metaTitle,
      metaDescription: productData.metaDescription,
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isNew) {
      globalStore.products.unshift(fullRecord);
      await this.logAudit({
        userEmail: adminUserEmail,
        action: 'PRODUCT_CREATED',
        entity: 'product',
        entityId: id,
        afterData: { name: fullRecord.name, sku: fullRecord.sku, pricePKR: fullRecord.pricePKR },
      });
    } else {
      const idx = globalStore.products.findIndex((p: ProductRecord) => p.id === id);
      const before = globalStore.products[idx];
      globalStore.products[idx] = fullRecord;
      await this.logAudit({
        userEmail: adminUserEmail,
        action: 'PRODUCT_UPDATED',
        entity: 'product',
        entityId: id,
        beforeData: before ? { name: before.name, pricePKR: before.pricePKR, status: before.status } : undefined,
        afterData: { name: fullRecord.name, pricePKR: fullRecord.pricePKR, status: fullRecord.status },
      });
    }

    return fullRecord;
  },

  async deleteProduct(id: string, adminUserEmail = 'admin@rawkraftstudio.com'): Promise<boolean> {
    const idx = globalStore.products.findIndex((p: ProductRecord) => p.id === id);
    if (idx !== -1) {
      const deleted = globalStore.products[idx];
      globalStore.products.splice(idx, 1);
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

  // --- CATEGORIES & COLLECTIONS ---
  async getCategories(): Promise<Category[]> {
    return globalStore.categories;
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const id = cat.id || `cat-${Date.now()}`;
    const slug = cat.slug || (cat.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const record: Category = {
      id,
      name: cat.name || 'New Category',
      slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl,
      isActive: cat.isActive !== false,
      sortOrder: cat.sortOrder || globalStore.categories.length + 1,
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

  async getCollections(): Promise<Collection[]> {
    return globalStore.collections;
  },

  async saveCollection(col: Partial<Collection>): Promise<Collection> {
    const id = col.id || `col-${Date.now()}`;
    const slug = col.slug || (col.name || 'col').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const record: Collection = {
      id,
      name: col.name || 'New Collection',
      slug,
      description: col.description || '',
      imageUrl: col.imageUrl,
      isActive: col.isActive !== false,
      isFeatured: Boolean(col.isFeatured),
      sortOrder: col.sortOrder || globalStore.collections.length + 1,
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
    return globalStore.products.map((p: ProductRecord) => ({
      product: p,
      inventory:
        p.inventory || {
          id: `inv-${p.id}`,
          productId: p.id,
          trackInventory: true,
          quantityOnHand: 0,
          quantityReserved: 0,
          lowStockThreshold: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
    }));
  },

  async adjustStock(
    productId: string,
    quantityChange: number,
    movementType: any,
    reason: string,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<InventoryRecord> {
    const product = globalStore.products.find((p: ProductRecord) => p.id === productId);
    if (!product) throw new Error('Product not found');

    if (!product.inventory) {
      product.inventory = {
        id: `inv-${productId}`,
        productId,
        trackInventory: true,
        quantityOnHand: 0,
        quantityReserved: 0,
        lowStockThreshold: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const previousQty = product.inventory.quantityOnHand;
    product.inventory.quantityOnHand = Math.max(0, product.inventory.quantityOnHand + quantityChange);
    product.inventory.updatedAt = new Date().toISOString();

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      inventoryId: product.inventory.id,
      productId,
      productName: product.name,
      movementType,
      quantityChange,
      quantityAfter: product.inventory.quantityOnHand,
      reason,
      performedByEmail: adminUserEmail,
      createdAt: new Date().toISOString(),
    };

    globalStore.inventoryMovements.unshift(movement);

    await this.logAudit({
      userEmail: adminUserEmail,
      action: 'STOCK_ADJUSTED',
      entity: 'inventory',
      entityId: productId,
      beforeData: { quantityOnHand: previousQty },
      afterData: { quantityOnHand: product.inventory.quantityOnHand, change: quantityChange, reason },
    });

    return product.inventory;
  },

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return globalStore.inventoryMovements;
  },

  // --- ORDERS ---
  async getOrders(): Promise<OrderRecord[]> {
    return globalStore.orders;
  },

  async getOrderById(id: string): Promise<OrderRecord | null> {
    return globalStore.orders.find((o: OrderRecord) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(orderData: Partial<OrderRecord>): Promise<OrderRecord> {
    const orderNumber = `RK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName || 'Inquiry Client',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail,
      customerCity: orderData.customerCity || 'Rawalpindi',
      shippingAddress: orderData.shippingAddress || '',
      orderStatus: orderData.orderStatus || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'bank_transfer',
      subtotalPKR: orderData.subtotalPKR || 0,
      discountPKR: orderData.discountPKR || 0,
      shippingPKR: orderData.shippingPKR || 0,
      taxPKR: 0,
      totalPKR: orderData.totalPKR || orderData.subtotalPKR || 0,
      notes: orderData.notes,
      whatsappNotified: Boolean(orderData.whatsappNotified),
      items: orderData.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    globalStore.orders.unshift(newOrder);

    await this.logAudit({
      userEmail: 'system@rawkraftstudio.com',
      action: 'ORDER_PLACED',
      entity: 'order',
      entityId: newOrder.id,
      afterData: { orderNumber: newOrder.orderNumber, totalPKR: newOrder.totalPKR },
    });

    return newOrder;
  },

  async updateOrderStatus(
    id: string,
    orderStatus: any,
    paymentStatus?: any,
    adminUserEmail = 'admin@rawkraftstudio.com'
  ): Promise<OrderRecord | null> {
    const order = globalStore.orders.find((o: OrderRecord) => o.id === id);
    if (!order) return null;

    const before = { orderStatus: order.orderStatus, paymentStatus: order.paymentStatus };
    order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    await this.logAudit({
      userEmail: adminUserEmail,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'order',
      entityId: id,
      beforeData: before,
      afterData: { orderStatus: order.orderStatus, paymentStatus: order.paymentStatus },
    });

    return order;
  },

  // --- CUSTOM ENQUIRIES (/custom briefs) ---
  async getEnquiries(): Promise<CustomProjectRequest[]> {
    return globalStore.enquiries;
  },

  async createEnquiry(data: Partial<CustomProjectRequest>): Promise<CustomProjectRequest> {
    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEnquiry: CustomProjectRequest = {
      id: `enq-${Date.now()}`,
      enquiryNumber,
      customerName: data.customerName || '',
      customerPhone: data.customerPhone || '',
      customerCity: data.customerCity || '',
      furnitureType: data.furnitureType || 'Dining Table',
      woodSpecies: data.woodSpecies || 'Sheesham',
      edgeProfile: data.edgeProfile || 'Live Edge',
      resinOption: data.resinOption || 'None',
      legStyle: data.legStyle || 'Matte Black Geometric Steel',
      lengthInches: data.lengthInches || 72,
      widthInches: data.widthInches || 36,
      heightInches: data.heightInches || 30,
      estimatedPricePKR: data.estimatedPricePKR || 0,
      customerNotes: data.customerNotes || '',
      referenceImages: data.referenceImages || [],
      status: 'new',
      adminNotes: '',
      whatsappSentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
    globalStore.aiConsultations.unshift({
      id: `ai-${Date.now()}`,
      ...consultation,
      createdAt: new Date().toISOString(),
    });
  },

  async getAIConsultations(): Promise<AIConsultation[]> {
    return globalStore.aiConsultations;
  },

  // --- CONTENT & CMS ---
  async getPageSections(): Promise<PageSection[]> {
    return globalStore.pageSections;
  },

  async updatePageSection(id: string, updates: Partial<PageSection>): Promise<PageSection | null> {
    const sec = globalStore.pageSections.find((s: PageSection) => s.id === id);
    if (!sec) return null;
    Object.assign(sec, updates);
    return sec;
  },

  // --- NAVIGATION ---
  async getNavigation(): Promise<NavigationItem[]> {
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
    return record;
  },

  async deleteNavigationItem(id: string): Promise<boolean> {
    const idx = globalStore.navigation.findIndex((n: NavigationItem) => n.id === id);
    if (idx !== -1) {
      globalStore.navigation.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- THEME & SETTINGS ---
  async getThemeSettings(): Promise<ThemeSettings> {
    return globalStore.themeSettings;
  },

  async updateThemeSettings(updates: Partial<ThemeSettings>): Promise<ThemeSettings> {
    globalStore.themeSettings = {
      ...globalStore.themeSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return globalStore.themeSettings;
  },

  async getSiteSettings(): Promise<SiteSettings> {
    return globalStore.siteSettings;
  },

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    globalStore.siteSettings = {
      ...globalStore.siteSettings,
      ...updates,
    };
    return globalStore.siteSettings;
  },

  // --- TEAM MEMBERS ---
  async getTeamMembers(): Promise<TeamMember[]> {
    return globalStore.teamMembers;
  },

  async saveTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const id = member.id || `tm-${Date.now()}`;
    const record: TeamMember = {
      id,
      email: member.email || '',
      fullName: member.fullName || '',
      role: member.role || 'VIEWER',
      isActive: member.isActive !== false,
      createdAt: member.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const idx = globalStore.teamMembers.findIndex((m: TeamMember) => m.id === id);
    if (idx !== -1) {
      globalStore.teamMembers[idx] = record;
    } else {
      globalStore.teamMembers.push(record);
    }
    return record;
  },

  // --- AUDIT LOGS ---
  async logAudit(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...entry,
      createdAt: new Date().toISOString(),
    };
    globalStore.auditLogs.unshift(log);
  },

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    return globalStore.auditLogs.slice(0, limit);
  },
};
