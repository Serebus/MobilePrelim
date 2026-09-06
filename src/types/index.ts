export interface User {
  id: string;
  name: string;
  email: string;
  isGuest?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  memberSince?: string;
  ordersCount?: number;
  rewardPoints?: number;
}

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface Product {
  id: string | number;
  name: string;
  title?: string;
  price: number;
  category: string;
  rating: number;
  reviewsCount: number;
  icon?: string;
  image?: string;
  description: string;
  brand?: string;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  timestamp: string;
  status: 'confirmed' | 'pending';
}
