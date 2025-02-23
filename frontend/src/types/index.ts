export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  phone?: string;
  address?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Student {
  id: string;
  name: string;
  parentId: string;
  createdAt: Date;
}

export interface LessonPackage {
  id: string;
  name: string;
  lessonsCount: number;
  price: number;
  durationMinutes: number;
  isTrial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requestedDate?: Date;
  requestedTime?: string;
  durationMinutes: number;
  location: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  students?: Student[];
}

export interface LessonCredit {
  id: string;
  userId: string;
  packageId: string;
  creditsRemaining: number;
  expiryDate?: Date;
  billingHold: boolean;
  billingHoldReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: 'card' | 'cash' | 'zelle' | 'venmo' | 'apple_pay';
  status: 'pending' | 'completed' | 'refunded';
  packageId?: string;
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  status: 'pending' | 'completed';
  bonusCredited: boolean;
  createdAt: Date;
  creditedAt?: Date;
}

export interface PromotionalSlot {
  id: string;
  date: Date;
  time: string;
  description?: string;
  specialPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}