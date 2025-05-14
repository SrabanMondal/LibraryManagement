// lib/api.ts
import axios from 'axios';
import { RegisterPayload, AuthCredentials, Transaction, Book, CreateBookPayload, User, FullBook, UserWithTransactions } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  //withCredentials: true,
});
export const getUserProfile = async (token: string) => {
  const res = await api.get<UserWithTransactions>(`/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const register = (data: RegisterPayload) =>
  api.post<User>('/user/register', data);

export const login = (data: AuthCredentials) =>{
    console.log(data)
  return api.post<{role:string; message:string; token: string; }>('/user/login', data);
}
// ---------- Book APIs ----------

export const fetchAllBooks = (token:string) => api.get<{books: FullBook[]}>('/book',{
headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
});

export const createBook = (data: CreateBookPayload, token:string) =>
  api.post<Book>('/book/add', data,{
headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export const updateBook = (bookId: number, data: Partial<CreateBookPayload['bookdata']>, token:string) =>
  api.patch<Book>(`/book/update/${bookId}`, data,{
headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteBook = (bookId: number, token:string) =>
  api.delete<{ message: string }>(`/book/delete/${bookId}`,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

// ---------- Transaction APIs ----------

export const borrowBook = (bookId: number, token:string) =>
  api.post<Transaction>('/transaction/borrow', { bookId }, {
     headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export const returnBook = (transactionId: number, token:string) =>
  api.patch<Transaction>(`/transaction/return`,{transactionId}, {
     headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });