import axios from 'axios';
import * as Location from 'expo-location';
import { create } from 'zustand';

import { futsalData } from '@/mock';

import { createSelectors } from '../utils';

interface GameVenueStore {
  nearbyVenues: any[];
  setNearbyVenues: (venues: any[]) => void;
  selectedVenue?: any;
  setSelectedVenue: (venue: any) => void;

  nearbyGames: any[];
  setNearbyGames: (games: any[]) => void;
  selectedGame?: any;
  setSelectedGame: (game: any) => void;

  selectedSport?: string;
  setSelectedSport: (sport: string) => void;

  currentSelection: 'venues' | 'games';
  setCurrentSelection: (selection: 'venues' | 'games') => void;

  fetchNearbyVenues: () => Promise<void>;
  fetchNearbyGames: () => Promise<void>;
}

export const _useGameVenue = create<GameVenueStore>((set) => ({
  nearbyVenues: [],
  setNearbyVenues: (venues) => set({ nearbyVenues: venues }),
  selectedVenue: undefined,
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),

  nearbyGames: [],
  setNearbyGames: (games) => set({ nearbyGames: games }),
  selectedGame: undefined,
  setSelectedGame: (game) => set({ selectedGame: game }),

  selectedSport: undefined,
  setSelectedSport: (sport) => set({ selectedSport: sport }),

  currentSelection: 'venues', // Default selection
  setCurrentSelection: (selection) => set({ currentSelection: selection }),

  fetchNearbyVenues: async () => {
    try {
      // const location = await Location.getCurrentPositionAsync();
      // const {} = await axios.get('nearby_venues', {
      //   params: {
      //     lat: location.coords.latitude,
      //     long: location.coords.longitude,
      //     max_dist_meters: 2000,
      //   },
      // });
      set({ nearbyVenues: futsalData });
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  },

  fetchNearbyGames: async () => {
    try {
      const location = await Location.getCurrentPositionAsync();
      const { data } = await axios.get('nearby_games', {
        params: {
          lat: location.coords.latitude,
          long: location.coords.longitude,
          max_dist_meters: 2000,
        },
      });
      set({ nearbyGames: data });
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  },
}));

export const useGameVenue = createSelectors(_useGameVenue);
