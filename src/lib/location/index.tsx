import { create } from 'zustand';

import { createSelectors } from '../utils';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string;
  setLocation: (lat: number, lng: number) => void;
  setAddress: (address: string) => void;
}

export const _useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  address: 'Loading...',
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
  setAddress: (address) => set({ address }),
}));

export const useLocation = createSelectors(_useLocationStore);

// Helper function to update both latitude and longitude
export const updateLocation = (lat: number, lng: number) => {
  _useLocationStore.getState().setLocation(lat, lng);
};

// Helper function to update the address
export const updateAddress = (address: string) => {
  _useLocationStore.getState().setAddress(address);
};
