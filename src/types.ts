/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RentMethod = 'harian' | 'bulanan';

export interface ScaffoldingItem {
  id: string;
  name: string;
  category: 'frame' | 'accessories' | 'safety' | 'support';
  dailyRate: number;      // Rental price per day
  monthlyRate: number;    // Rental price per month
  depositRate: number;    // Security deposit per item (or standard rate)
  weightKg: number;
  description: string;
}

export interface InventoryStock {
  itemId: string;
  itemName: string;
  total: number;
  rented: number;
  available: number;
  maintenance: number;
}

export interface SelectedItemRent {
  itemId: string;
  quantity: number;
}

export interface RentalOrder {
  id: string;
  contractorName: string;
  contractorPhone: string;
  projectName: string;
  projectAddress: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    dailyRate: number;
    monthlyRate: number;
    depositRate: number;
  }[];
  rentMethod: RentMethod;
  durationValue: number; // in days for 'harian', in months for 'bulanan'
  startDate: string;
  endDate: string;
  securityDepositPaid: number;
  status: 'pending' | 'loading' | 'shipping' | 'delivered' | 'active' | 'returning' | 'returned';
  trackingStep: number; // 0: Pending, 1: Loading, 2: Shipping, 3: Delivered, 4: Collected/Returned
  shippingProgress: number; // 0 to 100 representing percentage on route
  gpsLat?: number;
  gpsLng?: number;
  createdAt: string;
  isExtended: boolean; // True if extended to second month
  extendedAt?: string;
  refundStatus: 'none' | 'pending' | 'refunded';
}

export interface Invoice {
  id: string;
  orderId: string;
  contractorName: string;
  projectName: string;
  type: 'initial' | 'extension' | 'refund';
  createdAt: string;
  rentCost: number;
  securityDeposit: number;
  discount: number;
  totalAmount: number;
  isPaid: boolean;
  dueDate: string;
}

export interface SystemNotification {
  id: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  createdAt: string;
  read: boolean;
  actionType?: 'extend' | 'view_tracker' | 'view_invoice';
}

export type UserRole = 'warehouse_admin' | 'sales_admin' | 'manager';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string; // Tailwind color class or image url
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  companyName: string;
  address: string;
  activeProjectsCount: number;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  category: 'inventory' | 'sales' | 'customer' | 'system';
}

export interface CompanyProfile {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountHolder: string;
  generalTerms: string;
  logoText: string;
}

