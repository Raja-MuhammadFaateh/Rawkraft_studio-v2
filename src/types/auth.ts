import { AdminRole } from './database';
export type { AdminRole };

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
}

export type Permission =
  | 'manage_products'
  | 'manage_categories'
  | 'manage_collections'
  | 'manage_inventory'
  | 'manage_orders'
  | 'manage_customers'
  | 'manage_enquiries'
  | 'manage_content'
  | 'manage_navigation'
  | 'manage_theme'
  | 'manage_media'
  | 'manage_ai'
  | 'manage_settings'
  | 'manage_team'
  | 'view_activity'
  | 'full_access';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  OWNER: [
    'full_access',
    'manage_products',
    'manage_categories',
    'manage_collections',
    'manage_inventory',
    'manage_orders',
    'manage_customers',
    'manage_enquiries',
    'manage_content',
    'manage_navigation',
    'manage_theme',
    'manage_media',
    'manage_ai',
    'manage_settings',
    'manage_team',
    'view_activity',
  ],
  ADMIN: [
    'manage_products',
    'manage_categories',
    'manage_collections',
    'manage_inventory',
    'manage_orders',
    'manage_customers',
    'manage_enquiries',
    'manage_content',
    'manage_navigation',
    'manage_theme',
    'manage_media',
    'manage_ai',
    'manage_settings',
    'view_activity',
  ],
  CATALOG_MANAGER: [
    'manage_products',
    'manage_categories',
    'manage_collections',
    'manage_inventory',
    'manage_media',
  ],
  CONTENT_MANAGER: [
    'manage_content',
    'manage_navigation',
    'manage_theme',
    'manage_media',
    'manage_categories',
    'manage_collections',
  ],
  ORDERS_MANAGER: [
    'manage_orders',
    'manage_customers',
    'manage_inventory',
    'manage_enquiries',
  ],
  AI_MANAGER: [
    'manage_ai',
    'manage_enquiries',
  ],
  VIEWER: [
    'view_activity',
  ],
};

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  if (role === 'OWNER') return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('full_access');
}
