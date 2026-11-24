export type Locale = 'es' | 'en';

export type PageRoute = 'home' | 'story' | 'menu' | 'reservations' | 'location';

export type MenuCategoryId =
  | 'tipicos'
  | 'entrantes'
  | 'sopas'
  | 'brasa'
  | 'bebidas';

export type DietaryFlag = 'gluten-free' | 'vegetarian' | 'signature';

export interface LocalizedText {
  es: string;
  en: string;
}

export interface MenuItem {
  id: string;
  category: MenuCategoryId;
  name: LocalizedText;
  description: LocalizedText;
  ingredients: LocalizedText;
  pairing: LocalizedText;
  priceEur: number;
  flags: DietaryFlag[];
  allergens: LocalizedText;
  image?: string;
}

export type SeatingZone = 'salon' | 'terraza' | 'barra';

export interface TimeSlot {
  time: string;
  service: 'lunch' | 'dinner';
}

export interface SlotAvailability {
  time: string;
  service: 'lunch' | 'dinner';
  remainingSeats: number;
  capacity: number;
  available: boolean;
}

export interface ReservationInput {
  date: string;
  time: string;
  partySize: number;
  zone: SeatingZone;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
}

export interface ReservationRecord extends ReservationInput {
  code: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export type ReservationValidationErrors = Partial<
  Record<keyof ReservationInput, string>
>;
