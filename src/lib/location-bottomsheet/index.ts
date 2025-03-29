import { create } from 'zustand';

interface AddressSheetStore {
  isSheetOpen: boolean;
  toggleSheet: () => void;
  openSheet: () => void;
  closeSheet: () => void;
}

export const useAddressSheetStore = create<AddressSheetStore>((set, get) => ({
  isSheetOpen: false,
  toggleSheet: () => set({ isSheetOpen: !get().isSheetOpen }),
  openSheet: () => set({ isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false }),
}));
