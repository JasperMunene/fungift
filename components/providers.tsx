'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'gift-card' | 'product';
  quantity: number;
  image: string;
  // Gift card specific
  amount?: number;
  design?: string;
  recipientEmail?: string;
  // Product specific
  category?: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: string };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST':
      const isInWishlist = state.wishlist.includes(action.payload);
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload],
      };
    default:
      return state;
  }
};

const initialState: AppState = {
  user: null,
  cart: [],
  wishlist: [],
  isLoading: false,
};

export function Providers({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { id: '1', email, name: email.split('@')[0] };
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Logged out successfully!');
  };

  const signup = async (email: string, password: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = { id: '1', email, name };
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.type}-${item.name}-${Date.now()}`,
      quantity: 1,
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success('Added to cart!');
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    toast.success('Removed from cart!');
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleWishlist = (productId: string) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: productId });
    const isInWishlist = state.wishlist.includes(productId);
    toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  };

  const contextValue: AppContextType = {
    ...state,
    login,
    logout,
    signup,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within Providers');
  }
  return context;
};