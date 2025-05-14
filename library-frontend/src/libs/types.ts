
export type Role = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  registeredAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
}

export interface Book {
  id: number;
  title: string;
  published_year: number;
  total_copies: number;
  available_copies: number;
  publisher: Publisher;
  category: Category;
  authors: Author[];
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface CreateBookPayload {
  bookdata: {
    title: string;
    published_year: number;
    total_copies: number;
    available_copies: number;
  };
  publisherdata: {
    name: string;
  };
  categorydata: {
    name: string;
  };
  authordata: {
    name: string;
  };
}

export interface Transaction {
  id: number;
  bookId: number;
  memberId: number;
  borrowedAt: string;
  returnedAt: string | null;
}

export type TransactionWithBook = {
  id: number;
  bookId: number;
  memberId: number;
  borrowedAt: string;
  returnedAt: string | null;
  book: Book
};

export type UserWithTransactions = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  registeredAt: string;
  Transactions: TransactionWithBook[];
};

export type FullBook = {
  id: number;
  title: string;
  published_year: number;
  total_copies: number;
  available_copies: number;
  publisher: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  authors: {
    id: number;
    name: string;
  }[];
};
