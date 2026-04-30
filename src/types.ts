import { ReactNode } from 'react';

export interface Concept {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  useCase: string;
  value: string;
  budget: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  positioning: string;
  description: string;
  images: string[];
  suitableFor: string;
  occasionType: string;
  budget: string;
  minQuantity: string;
  leadTime: string;
  personalizationType: string;
  boxStyle: string;
  individualDelivery: boolean;
  isReadyProposal?: boolean;
  defaultItems: Item[];
  optionalItems: Item[];
  personalizationOptions?: string[];
  suitableForList?: string[];
  whyChooseList?: string[];
  brandingDescription?: string;
  technicalSpecs?: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
}
