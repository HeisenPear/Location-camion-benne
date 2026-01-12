export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  detailedDescription: string;
  image: string;
  useCases: string[];
  wasteTypes: string[];
  idealFor: string;
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  date: string;
}

export interface Zone {
  id: string;
  name: string;
  postalCode: string;
  deliveryFee: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
  siret: string;
  tva: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
  };
  description: string;
  keywords: string[];
  geo: {
    latitude: string;
    longitude: string;
  };
}
