// ============================================================
// ORDERPILOT — SHARED TYPES
// File: src/app/types.ts
// Purpose: Shared application data structures
// ============================================================


// ============================================================
// 1. ORDER ITEM
// ============================================================

export type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

// ============================================================
// 2. RIDER
// ============================================================

export type Rider = {
  id: string;
  name: string;
  phone: string;
  bike: string;
  status: "Available" | "Busy" | "Offline";
};

// ============================================================
// 3. ORDER
// ============================================================

export type Order = {
  id: string;

  // Customer information
  customer: string;
  customerId: string;
  customerPhone: string;

  // Products
  items: OrderItem[];

  // Financial information
  subtotal: number;
  deliveryFee: number;
  total: number;

  // Delivery information
  location: string;

  // Current order status
  status:
    | "Awaiting approval"
    | "Finding rider"
    | "Rider assigned"
    | "Out for delivery"
    | "Delivered"
    | "Cancelled";

  // Assigned rider
rider: Rider | null;
}