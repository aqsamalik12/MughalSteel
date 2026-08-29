import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('ic_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const saveWishlist = (updated: Product[]) => {
    setWishlist(updated);
    localStorage.setItem('ic_wishlist', JSON.stringify(updated));
  };

  const addToWishlist = (product: Product) => {
    if (wishlist.some(item => item.id === product.id)) return;
    saveWishlist([...wishlist, product]);
  };

  const removeFromWishlist = (id: string) => {
    saveWishlist(wishlist.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
