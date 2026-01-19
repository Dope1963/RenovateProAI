
export enum UserRole {
  CONTRACTOR = 'CONTRACTOR',
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR'
}

export enum ProjectStatus {
  OPEN_QUOTE = 'Open Quote',
  OPEN_JOB = 'Open Job',
  COMPLETE = 'Complete'
}

export interface Material {
  id: string;
  name: string;
  category: string;
  subCategory: string; // Added field
  description: string; // Added field
  imageUrl: string;
}

export interface ProjectSpace {
  id: string;
  name: string;
  beforeImage: string | null;
  afterImage: string | null;
  description: string;
  materials: Material[];
}

export interface Project {
  id: string;
  name: string;
  coverPhoto: string | null;
  date: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  quoteAmount: number;
  spaces: ProjectSpace[];
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
}

export enum ImageSize {
  Resolution_1K = '1K',
  Resolution_2K = '2K',
  Resolution_4K = '4K'
}
