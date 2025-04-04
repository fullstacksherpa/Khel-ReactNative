export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export type APIError = {
  success: false;
  message: string;
  status: number;
};
