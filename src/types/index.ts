export interface User {
  id: string;
  name: string;
  email: string;
  isGuest?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviewsCount: number;
  icon: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
