import { create } from 'zustand';

interface VenueState {
  lastCreatedVenueID: number | null;
  setLastCreatedVenueID: (id: number) => void;
  clearVenueID: () => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  lastCreatedVenueID: null,
  setLastCreatedVenueID: (id: number) => set({ lastCreatedVenueID: id }),
  clearVenueID: () => set({ lastCreatedVenueID: null }),
}));
