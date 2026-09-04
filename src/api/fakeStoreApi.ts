import { CartItem, FakeStoreProduct, OrderConfirmation, Product, User } from '../types';

export const FAKESTORE_BASE_URL = 'https://fakestoreapi.com';

export const FALLBACK_FAKESTORE_PRODUCTS: FakeStoreProduct[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
      rate: 3.9,
      count: 120,
    },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description:
      'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
    category: "men's clothing",
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: {
      rate: 4.1,
      count: 259,
    },
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description:
      'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: {
      rate: 4.7,
      count: 500,
    },
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    price: 15.99,
    description:
      'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: {
      rate: 2.1,
      count: 430,
    },
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    rating: {
      rate: 4.6,
      count: 400,
    },
  },
  {
    id: 6,
    title: 'Solid Gold Petite Micropave',
    price: 168,
    description:
      'Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed.',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    rating: {
      rate: 3.9,
      count: 70,
    },
  },
  {
    id: 7,
    title: 'White Gold Plated Princess',
    price: 9.99,
    description:
      "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: {
      rate: 3,
      count: 400,
    },
  },
  {
    id: 8,
    title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
    price: 64,
    description:
      'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: {
      rate: 3.3,
      count: 203,
    },
  },
  {
    id: 9,
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    price: 109,
    description:
      'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests)',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: {
      rate: 2.9,
      count: 470,
    },
  },
  {
    id: 10,
    title: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
    price: 109,
    description:
      '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance.',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg',
    rating: {
      rate: 4.8,
      count: 319,
    },
  },
  {
    id: 11,
    title: 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
    price: 114,
    description:
      "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    rating: {
      rate: 4.8,
      count: 400,
    },
  },
  {
    id: 12,
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    price: 599,
    description:
      '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    rating: {
      rate: 2.9,
      count: 250,
    },
  },
  {
    id: 13,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 56.99,
    description:
      'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    rating: {
      rate: 2.6,
      count: 235,
    },
  },
  {
    id: 14,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description:
      '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket',
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
    rating: {
      rate: 2.9,
      count: 340,
    },
  },
  {
    id: 15,
    title: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
    price: 39.99,
    description:
      "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things",
    category: "women's clothing",
    image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    rating: {
      rate: 3.8,
      count: 679,
    },
  },
];

export const FALLBACK_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

export const getCategoryIcon = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('electr')) return '💻';
  if (cat.includes('jewel')) return '💍';
  if (cat.includes("men's") || cat.includes('men')) return '👔';
  if (cat.includes("women's") || cat.includes('women')) return '👗';
  return '🛍️';
};

export const mapFakeStoreProductToProduct = (item: FakeStoreProduct): Product => {
  return {
    id: item.id.toString(),
    name: item.title,
    title: item.title,
    price: item.price,
    category: item.category,
    rating: item.rating?.rate ?? 4.5,
    reviewsCount: item.rating?.count ?? 50,
    icon: getCategoryIcon(item.category),
    image: item.image,
    description: item.description,
    brand: 'FakeStore Collection',
    inStock: true,
  };
};

export const fakeStoreApi = {
  /**
   * Fetches products from FakeStoreAPI, supporting category filtering and search query
   */
  getProducts: async (params?: {
    category?: string;
    search?: string;
    limit?: number;
  }): Promise<Product[]> => {
    let rawProducts: FakeStoreProduct[] = [];

    try {
      let url = `${FAKESTORE_BASE_URL}/products`;
      if (params?.category && params.category.toLowerCase() !== 'all') {
        url = `${FAKESTORE_BASE_URL}/products/category/${encodeURIComponent(
          params.category.toLowerCase(),
        )}`;
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

      const response = await fetch(url, {
        signal: controller?.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        rawProducts = await response.json();
      } else {
        throw new Error(`FakeStore API error: ${response.status}`);
      }
    } catch {
      // Fallback to local curated catalog if offline, timed out, or network error
      rawProducts = [...FALLBACK_FAKESTORE_PRODUCTS];
      if (params?.category && params.category.toLowerCase() !== 'all') {
        const catFilter = params.category.toLowerCase();
        rawProducts = rawProducts.filter(
          (p) => p.category.toLowerCase() === catFilter,
        );
      }
    }

    let products = rawProducts.map(mapFakeStoreProductToProduct);

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (params?.limit && params.limit > 0) {
      products = products.slice(0, params.limit);
    }

    return products;
  },

  /**
   * Fetches product categories from FakeStoreAPI
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

      const response = await fetch(`${FAKESTORE_BASE_URL}/products/categories`, {
        signal: controller?.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const categories: string[] = await response.json();
        return ['all', ...categories];
      }
    } catch {
      // Fallback
    }

    return ['all', ...FALLBACK_CATEGORIES];
  },

  /**
   * Fetches single product by ID from FakeStoreAPI
   */
  getProductById: async (id: string | number): Promise<Product | null> => {
    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;

      const response = await fetch(`${FAKESTORE_BASE_URL}/products/${id}`, {
        signal: controller?.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const item: FakeStoreProduct = await response.json();
        return mapFakeStoreProductToProduct(item);
      }
    } catch {
      // Fallback
    }

    const fallback = FALLBACK_FAKESTORE_PRODUCTS.find(
      (p) => p.id.toString() === id.toString(),
    );
    return fallback ? mapFakeStoreProductToProduct(fallback) : null;
  },

  /**
   * Simulates checkout order creation
   */
  checkout: async (
    items: CartItem[],
    _user: User,
  ): Promise<OrderConfirmation> => {
    if (!items.length) {
      throw new Error('Cannot checkout with empty cart');
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const orderId = `FS-ORD-${Date.now().toString().slice(-6)}-${Math.floor(
      100 + Math.random() * 900,
    )}`;

    return {
      orderId,
      items: [...items],
      totalAmount,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
    };
  },
};
