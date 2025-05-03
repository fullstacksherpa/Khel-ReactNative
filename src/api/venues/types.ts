export type Venue = {
  id: number;
  name: string;
  address: string;
  image_urls: string[];
  location: number[]; // [longitude, latitude]
  open_time: string;
  phone_number: string;
  sport: string;
  total_reviews: number;
  average_rating: number;
  is_favorite: boolean;
};

export type ListVenuesResponse = {
  data: Venue[];
};

export type ListVenuesVariables = {
  sport?: string;
  lat?: number;
  lng?: number;
  distance?: number;
  page?: number; // default: 1 // for infinite query , page will be manage by infinite query mechanism
  limit?: number; // default: 20 (or constrained to a maximum value, e.g., 25)
};

export type VenueDetails = {
  id: number;
  owner_id: number;
  name: string;
  address: string;
  location: [number, number]; // [latitude, longitude]
  description?: string;
  phone_number: string;
  amenities: string[];
  open_time?: string;
  sport: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  total_reviews: number;
  average_rating: number;
  upcoming_games: number;
  completed_games: number;
};
