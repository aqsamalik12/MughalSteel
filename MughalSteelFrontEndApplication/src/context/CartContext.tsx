import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types';
import { useData } from './DataContext';

interface CartContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity' | 'totalPrice'>, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  updateItemDimensions: (id: string, width: number, height: number, qty?: number) => void;
  clearCart: () => void;
  loadBlueprintDefaults: () => void;
  couponCode: string;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartDiscount: number;
  cartTotal: number;
  generateWhatsAppCartMessage: (customerName?: string, customerPhone?: string, notes?: string) => string;
  sendCartToWhatsApp: (customerName?: string, customerPhone?: string, notes?: string) => void;
}

const DEFAULT_BLUEPRINT_ITEMS: CartItem[] = [
  {
    id: 'mfg-001-sample',
    productId: 'seed-gate-1',
    productCode: 'MFG-001',
    productName: 'Modern Gate Design 01',
    productImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80',
    category: 'Modern Home',
    item: 'Front Gates',
    width: 5,
    height: 10,
    area: 50,
    pricePerSqFt: 2500,
    quantity: 1,
    totalPrice: 125000,
    material: 'Mild Steel',
    finish: 'Matte Black'
  },
  {
    id: 'br-002-sample',
    productId: 'seed-railing-1',
    productCode: 'BR-002',
    productName: 'Balcony Railing Design 02',
    productImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80',
    category: 'Modern Home',
    item: 'Balcony Railing',
    width: 4,
    height: 20,
    area: 80,
    pricePerSqFt: 1800,
    quantity: 1,
    totalPrice: 144000,
    material: 'Mild Steel',
    finish: 'Matte Black'
  },
  {
    id: 'ss-003-sample',
    productId: 'seed-stair-1',
    productCode: 'SS-003',
    productName: 'Spiral Staircase Design 03',
    productImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80',
    category: 'Modern Home',
    item: 'Stair Railing',
    width: 3,
    height: 12,
    area: 36,
    pricePerSqFt: 2200,
    quantity: 1,
    totalPrice: 79200,
    material: 'Mild Steel',
    finish: 'Matte Black'
  },
  {
    id: 'lp-004-sample',
    productId: 'seed-grill-1',
    productCode: 'LP-004',
    productName: 'Louver Pipe Design 04',
    productImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    category: 'Modern Home',
    item: 'Grills',
    width: 2,
    height: 15,
    area: 30,
    pricePerSqFt: 1200,
    quantity: 1,
    totalPrice: 36000,
    material: 'Mild Steel',
    finish: 'Matte Black'
  }
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getWhatsAppUrl } = useData();
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('msf_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => {
            const width = Number(item.width) || 1;
            const height = Number(item.height) || 1;
            const area = Number(item.area) || parseFloat((width * height).toFixed(2));
            const pricePerSqFt = Number(item.pricePerSqFt || item.price || 2500);
            const quantity = Number(item.quantity) || 1;
            const totalPrice = Number(item.totalPrice != null ? item.totalPrice : Math.round(area * pricePerSqFt * quantity));
            return {
              ...item,
              width,
              height,
              area,
              pricePerSqFt,
              quantity,
              totalPrice
            };
          });
        }
      }
    } catch (_) {}
    return DEFAULT_BLUEPRINT_ITEMS;
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const saveCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem('msf_cart', JSON.stringify(updatedCart));
    } catch (_) {}
  };

  const loadBlueprintDefaults = () => {
    saveCart(DEFAULT_BLUEPRINT_ITEMS);
  };

  const addToCart = (item: Omit<CartItem, 'quantity' | 'totalPrice'>, qty: number = 1) => {
    const area = Math.max(0.1, (item.width || 1) * (item.height || 1));
    const rate = item.pricePerSqFt || 2500;
    const totalPrice = Math.round(area * rate * qty);

    const existingIndex = cart.findIndex(c => c.id === item.id || (c.productCode === item.productCode && c.width === item.width && c.height === item.height));
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].totalPrice = Math.round(updated[existingIndex].area * updated[existingIndex].pricePerSqFt * updated[existingIndex].quantity);
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        ...item,
        area: parseFloat(area.toFixed(2)),
        pricePerSqFt: rate,
        quantity: qty,
        totalPrice
      };
      saveCart([...cart, newItem]);
    }
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter(c => c.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cart.map(c => {
      if (c.id === id) {
        const totalPrice = Math.round(c.area * c.pricePerSqFt * qty);
        return { ...c, quantity: qty, totalPrice };
      }
      return c;
    });
    saveCart(updated);
  };

  const updateItemDimensions = (id: string, width: number, height: number, qty?: number) => {
    const updated = cart.map(c => {
      if (c.id === id) {
        const newQty = qty !== undefined ? qty : c.quantity;
        const area = parseFloat((width * height).toFixed(2));
        const totalPrice = Math.round(area * c.pricePerSqFt * newQty);
        return {
          ...c,
          width,
          height,
          area,
          quantity: newQty,
          totalPrice
        };
      }
      return c;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MUGHAL10') {
      setCouponCode('MUGHAL10');
      setDiscountPercent(0.10);
      return true;
    }
    if (clean === 'VILLA5') {
      setCouponCode('VILLA5');
      setDiscountPercent(0.05);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.area * item.pricePerSqFt * item.quantity), 0);
  const cartDiscount = Math.round(cartSubtotal * discountPercent);
  const cartShipping = 0;
  const cartTax = 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);

  const generateWhatsAppCartMessage = (customerName = 'Ali Khan', customerPhone = '+92 300 1234567', notes = 'Modern Home'): string => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalArea = cart.reduce((sum, item) => sum + (item.area * item.quantity), 0);

    let msg = `*Mughal Steel Fabrication – New Inquiry*\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `Name: ${customerName}\n`;
    msg += `Phone: ${customerPhone}\n`;
    msg += `Project: ${notes}\n\n`;
    msg += `*Products List:*\n`;

    cart.forEach((item, idx) => {
      const rate = Number(item.pricePerSqFt || item.price || 0);
      const area = Number(item.area || ((item.width || 1) * (item.height || 1)) || 0);
      const qty = Number(item.quantity || 1);
      const lineTotal = Number(item.totalPrice != null ? item.totalPrice : Math.round(area * rate * qty));
      msg += `${idx + 1}. ${item.productCode || 'ITEM'} – ${item.productName || 'Fabrication Item'}\n`;
      msg += `Size: ${item.width || 0}ft × ${item.height || 0}ft | Area: ${area} Sq.ft\n`;
      msg += `Rate: Rs. ${rate.toLocaleString()} | Qty: ${qty}\n`;
      msg += `Total: Rs. ${lineTotal.toLocaleString()}\n\n`;
    });

    msg += `*Estimated Grand Total: Rs. ${(cartTotal || 0).toLocaleString()}*\n\n`;
    msg += `*Please provide quotation for the above items.\nThank you!*`;

    return msg;
  };

  const sendCartToWhatsApp = (customerName?: string, customerPhone?: string, notes?: string) => {
    const msg = generateWhatsAppCartMessage(customerName, customerPhone, notes);
    const url = getWhatsAppUrl(msg);
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemDimensions,
        clearCart,
        loadBlueprintDefaults,
        couponCode,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartDiscount,
        cartTotal,
        generateWhatsAppCartMessage,
        sendCartToWhatsApp
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
