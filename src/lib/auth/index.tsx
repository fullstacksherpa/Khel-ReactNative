import { create } from 'zustand';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import {
  getToken,
  getUserId,
  removeToken,
  removeUserId,
  setToken,
  setUserId,
} from './utils';

interface AuthState {
  userID: string | null;
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType, userID: string) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  userID: null,
  status: 'idle',
  token: null,
  signIn: (token, userID) => {
    setUserId(userID);
    setToken(token);
    set({ status: 'signIn', token, userID });
  },
  signOut: () => {
    removeUserId();
    removeToken();
    set({ status: 'signOut', token: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
      const userID = getUserId();
      if (userToken !== null && userID !== null) {
        get().signIn(userToken, userID);
      } else {
        get().signOut();
      }
    } catch (e) {
      signOut();
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType, userID: string) =>
  _useAuth.getState().signIn(token, userID);
export const hydrateAuth = () => _useAuth.getState().hydrate();
