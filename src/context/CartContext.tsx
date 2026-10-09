'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  pricePKR: number;
  priceUSD: number;
  image: string;
  wood: string;
  legs: string;
  resinColor?: string;
  customDimensions?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'quantity'>, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPKR: number;
  totalUSD: number;
  totalCount: number;
  generateWhatsAppOrderUrl: (customerName?: string, notes?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rawkraft_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('rawkraft_cart', JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isInitialized]);

  const addToCart = (
    itemData: Omit<CartItem, 'cartItemId' | 'quantity'>,
    qty = 1
  ) => {
    const cartItemId = `${itemData.productId}-${itemData.wood}-${itemData.legs}-${itemData.resinColor || 'none'}-${itemData.customDimensions || 'std'}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...itemData, cartItemId, quantity: qty }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalPKR = items.reduce((sum, item) => sum + item.pricePKR * item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppOrderUrl = (customerName = '', notes = '') => {
    let msg = `*RAWKRAFT STUDIO — ORDER INQUIRY*\n\n`;
    if (customerName) {
      msg += `*Customer Name:* ${customerName}\n\n`;
    }
    msg += `*Items Selected (${items.length}):*\n`;
    items.forEach((item, index) => {
      msg += `\n${index + 1}. *${item.name}* (Qty: ${item.quantity})\n`;
      msg += `   • Wood: ${item.wood}\n`;
      msg += `   • Base/Legs: ${item.legs}\n`;
      if (item.resinColor) {
        msg += `   • Resin: ${item.resinColor}\n`;
      }
      if (item.customDimensions) {
        msg += `   • Dimensions: ${item.customDimensions}\n`;
      }
      msg += `   • Price: PKR ${item.pricePKR.toLocaleString()} each\n`;
    });

    msg += `\n*Total Estimated:* PKR ${totalPKR.toLocaleString()} (~$${totalUSD})\n`;
    if (notes) {
      msg += `\n*Special Notes / Requests:* ${notes}\n`;
    }
    msg += `\n_Please confirm slab selection and production timeline._`;

    return `https://wa.me/923317497444?text=${encodeURIComponent(msg)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPKR,
        totalUSD,
        totalCount,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
