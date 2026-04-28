export interface InvoiceItem {
  description: string;
  quantity: number;
  price: string;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  type: string;
  items?: InvoiceItem[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  customer: string;
  amount: string;
  method: string;
  date: string;
  status: 'Cleared' | 'Processing' | 'Failed';
}

export interface Delivery {
  id: string;
  invoiceId: string;
  customer: string;
  status: 'Delivered' | 'In Transit' | 'Pending';
  date: string;
  items: number;
  driver: string;
  destination: string;
  proofImage?: string;
}
export interface RevenueData {
  name: string;
  amount: number;
  collected: number;
}

export interface ClientData {
  name: string;
  value: number;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: string;
  outstanding: string;
  riskScore: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Inactive';
  location: string;
  lastInvoice: string;
}
export interface Check {
  id: string;
  type: 'Received' | 'Issued';
  bank: string;
  number: string;
  amount: string;
  dueDate: string;
  status: 'Cleared' | 'Pending' | 'Bounced';
  customer: string;
}
