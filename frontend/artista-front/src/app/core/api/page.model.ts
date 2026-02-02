export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page index (0-based)
  size: number;
  first: boolean;
  last: boolean;
};

export type SortDir = 'asc' | 'desc';

export type PageRequest = {
  page: number;
  size: number;
  sort?: string;
  nome?: string;
};
