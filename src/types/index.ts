export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  branches: Branch[];
  roles: Role[];
}

export interface Branch {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
}

export interface Company {
  id: string;
  type_id: string;
  identification: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Article {
  id: string;
  code: string;
  name: string;
  colors: string[];
  sizes: string[];
  minProfit: number;
  maxProfit: number;
  price: number;
  isPromotion: boolean;
  isActive: boolean;
  image?: string;
  description?: string;
  groupId: string;
}

export interface Purchase {
  id: string;
  code: string;
  date: string;
  invoice: string;
  supplierId: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  articleId: string;
  description: string;
  taxRate: number;
  purchasePrice: number;
  salePrice: number;
  discountRate: number;
  quantity: number;
  subtotal: number;
}