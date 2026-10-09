export type AdminRole =
  | 'OWNER'
  | 'ADMIN'
  | 'CATALOG_MANAGER'
  | 'CONTENT_MANAGER'
  | 'ORDERS_MANAGER'
  | 'AI_MANAGER'
  | 'VIEWER';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type ProductType = 'ready_stock' | 'made_to_order' | 'custom' | 'service';

export type InventoryMovementType =
  | 'initial_stock'
  | 'purchase'
  | 'manual_adjustment'
  | 'reservation'
  | 'release'
  | 'sale'
  | 'return'
  | 'damaged'
  | 'correction';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type EnquiryStatus =
  | 'new'
  | 'reviewing'
  | 'contacted'
  | 'quoted'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  invitedBy?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMedia {
  id: string;
  productId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isPrimary: boolean;
  altText?: string;
  sortOrder: number;
  createdAt: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  status: ProductStatus;
  productType: ProductType;

  // Commercial
  pricePKR: number;
  salePricePKR?: number;
  priceUSD: number;
  currency: string;
  isQuoteOnly: boolean;

  // Classification
  categoryId: string;
  categoryName?: string;
  collectionIds?: string[];
  tags: string[];
  isSignature: boolean;
  isPopular: boolean;

  // Manufacturing
  leadTimeWeeks: string;
  isCustomizable: boolean;

  // Specifications
  dimensions: string;
  weightKg?: number;
  primaryWood: string;
  availableWoods: string[];
  primaryLegStyle: string;
  availableLegStyles: string[];
  hasResinOption: boolean;
  defaultResinColor?: string;
  availableResinColors: string[];

  // Media
  imageUrl: string;
  galleryImages?: string[];

  // Inventory
  inventory?: InventoryRecord;

  // AI Metadata
  aiSuitableRooms: string[];
  aiStyleTags: string[];
  aiSearchSummary?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  createdAt: string;
  updatedAt: string;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  trackInventory: boolean;
  quantityOnHand: number;
  quantityReserved: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  inventoryId: string;
  productId: string;
  productName?: string;
  movementType: InventoryMovementType;
  quantityChange: number;
  quantityAfter: number;
  reason?: string;
  referenceId?: string;
  performedByEmail?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  city: string;
  address?: string;
  notes?: string;
  totalOrders: number;
  totalSpendPKR: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPricePKR: number;
  totalPricePKR: number;
  customWood?: string;
  customLegs?: string;
  customResin?: string;
  customDimensions?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  shippingAddress?: string;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;

  subtotalPKR: number;
  discountPKR: number;
  shippingPKR: number;
  taxPKR: number;
  totalPKR: number;

  notes?: string;
  whatsappNotified: boolean;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomProjectRequest {
  id: string;
  enquiryNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;

  furnitureType: string;
  woodSpecies: string;
  edgeProfile: string;
  resinOption: string;
  legStyle: string;

  lengthInches: number;
  widthInches: number;
  heightInches: number;

  estimatedPricePKR: number;
  customerNotes?: string;
  referenceImages: string[];

  status: EnquiryStatus;
  adminNotes?: string;
  whatsappSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIConsultation {
  id: string;
  sessionId: string;
  userIdentifier?: string;
  userQuery: string;
  aiResponse: string;
  matchedKnowledgeIds: string[];
  recommendedProductIds: string[];
  sourceUsed: string;
  createdAt: string;
}

export interface AIKnowledgeDocument {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  id: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isEnabled: boolean;
  sortOrder: number;
  config?: Record<string, any>;
}

export interface NavigationItem {
  id: string;
  menuLocation: 'header' | 'footer';
  label: string;
  url: string;
  isExternal: boolean;
  isEnabled: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  businessInfo: {
    name: string;
    tagline: string;
    phone: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
    city: string;
    country: string;
    instagram: string;
    facebook: string;
  };
  shippingPolicy: {
    deliveryScope: string;
    leadTime: string;
    depositPct: number;
  };
  seoDefaults: {
    title: string;
    description: string;
  };
}

export interface ThemeSettings {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  headingFont: string;
  bodyFont: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  beforeData?: Record<string, any>;
  afterData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  publicUrl: string;
  folder: string;
  uploadedBy?: string;
  createdAt: string;
}
