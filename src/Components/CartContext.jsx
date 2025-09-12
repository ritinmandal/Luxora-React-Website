import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../Superbase/supabaseClient';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const fetchCartItems = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data: roomCart } = await supabase
      .from("Cart")
      .select("id")
      .eq("user_id", userId);

    const { data: foodCart } = await supabase
      .from("CartFood")
      .select("id")
      .eq("user_id", userId);

    setCartCount((roomCart?.length || 0) + (foodCart?.length || 0));
  };

  
  useEffect(() => {
    fetchCartItems();
  }, [cartOpen]);

  
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchCartItems();
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        openCart,
        closeCart,
        cartCount,
        fetchCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
