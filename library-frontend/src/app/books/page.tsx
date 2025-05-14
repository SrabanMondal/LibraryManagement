'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchAllBooks, borrowBook } from '@/libs/api';
import { FullBook } from '@/libs/types';
import { BookOpen, Search, Filter, BookMarked, AlertCircle } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState<FullBook[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publisherFilter, setPublisherFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const localtoken = localStorage.getItem('token');
    if (localtoken) {
      fetchBooks(localtoken);
    }
  }, []);

  const fetchBooks = async (token: string) => {
    try {
      const res = await fetchAllBooks(token);
      setBooks(res.data.books);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to borrow books.');
      return;
    }

    setBorrowLoading(bookId);

    try {
      await borrowBook(bookId, token);
      alert('Book borrowed successfully!');
      await fetchBooks(token); // Refresh available copies
    } catch (err) {
      console.log(err);
      alert('Failed to borrow book.');
    } finally {
      setBorrowLoading(null);
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(books.map((b) => b.category.name))),
    [books]
  );

  const publishers = useMemo(
    () => Array.from(new Set(books.map((b) => b.publisher.name))),
    [books]
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.authors.some((a) =>
          a.name.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory = categoryFilter
        ? book.category.name === categoryFilter
        : true;

      const matchesPublisher = publisherFilter
        ? book.publisher.name === publisherFilter
        : true;

      return matchesSearch && matchesCategory && matchesPublisher;
    });
  }, [search, categoryFilter, publisherFilter, books]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-800 flex items-center">
            <BookOpen className="mr-2" size={32} />
            Library Catalog
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-2/3 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-all"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                <select
                  value={publisherFilter}
                  onChange={(e) => setPublisherFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Publishers</option>
                  {publishers.map((pub) => (
                    <option key={pub} value={pub}>
                      {pub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Books Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No books match your criteria</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters to find more books.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-3"></div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{book.title}</h2>
                  
                  <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
                    <span className="font-medium">By:</span>
                    <span>{book.authors.map((a) => a.name).join(', ')}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">Category</span>
                      <span className="text-sm font-medium">{book.category.name}</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">Publisher</span>
                      <span className="text-sm font-medium">{book.publisher.name}</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">Year</span> 
                      <span className="text-sm font-medium">{book.published_year}</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">Availability</span>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          book.available_copies > 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {book.available_copies} / {book.total_copies}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBorrow(book.id)}
                    disabled={book.available_copies <= 0 || borrowLoading === book.id}
                    className={`w-full flex items-center justify-center gap-2 rounded-md px-4 py-3 text-white font-medium transition-all ${
                      book.available_copies <= 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : borrowLoading === book.id
                        ? 'bg-indigo-400 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <BookMarked size={18} />
                    {borrowLoading === book.id
                      ? 'Borrowing...'
                      : book.available_copies <= 0
                      ? 'Not Available'
                      : 'Borrow Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}