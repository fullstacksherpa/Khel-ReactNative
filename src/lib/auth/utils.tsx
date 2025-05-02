import { getItem, removeItem, setItem } from '@/lib/storage';

const TOKEN = 'token';

export type TokenType = {
  access: string;
  refresh: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export const getAccessToken = (): string | null => {
  const token = getToken();
  return token?.access || null;
};

const USER_ID_KEY = 'userID';

export const getUserId = (): string | null => {
  const userId = getItem<string>(USER_ID_KEY);
  return userId || null;
};

export const removeUserId = (): void => {
  removeItem(USER_ID_KEY);
};

export const setUserId = (value: string): void => {
  setItem<string>(USER_ID_KEY, value);
};
