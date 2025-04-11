import { create } from 'zustand';

import { createSelectors } from '../utils';

export interface Venue {
  id: number;
  name: string;
  address: string;
  location: [number, number]; // [lng, lat]
  image_urls: string[];
  sport: string;
  open_time: string;
  phone_number: string;
  average_rating: number;
  total_reviews: number;
}

interface GameVenueStore {
  nearbyVenues: Venue[] | undefined;
  setNearbyVenues: (venues: Venue[] | undefined) => void;
  selectedVenue?: Venue | undefined;
  setSelectedVenue: (venue: Venue | undefined) => void;

  nearbyGames: any[];
  setNearbyGames: (games: any[]) => void;
  selectedGame?: any;
  setSelectedGame: (game: any) => void;

  selectedSport?: string;
  setSelectedSport: (sport: string) => void;

  currentSelection: 'venues' | 'games';
  setCurrentSelection: (selection: 'venues' | 'games') => void;
}

export const _useGameVenue = create<GameVenueStore>((set) => ({
  nearbyVenues: [],
  setNearbyVenues: (venues) => set({ nearbyVenues: venues }),
  selectedVenue: undefined,
  setSelectedVenue: (venue) =>
    set((state) => ({
      ...state,
      selectedVenue: venue,
    })),

  nearbyGames: [],
  setNearbyGames: (games) => set({ nearbyGames: games }),
  selectedGame: undefined,
  setSelectedGame: (game) => set({ selectedGame: game }),

  selectedSport: undefined,
  setSelectedSport: (sport) => set({ selectedSport: sport }),

  currentSelection: 'venues', // Default selection
  setCurrentSelection: (selection) => set({ currentSelection: selection }),
}));

export const useGameVenue = createSelectors(_useGameVenue);
