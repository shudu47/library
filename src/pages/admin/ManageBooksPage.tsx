import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { Book } from '../../types/Book';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import BookStatusBadge from '../../components/books/BookStatusBadge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const ManageBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('bookname');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/books`);
      setBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (bookId: string) => {
    setDeleteBookId(bookId);
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${API_URL}/admin/books/${deleteBookId}`);
      setBooks(books.filter(book => book.bookid !== deleteBookId));
      setDeleteBookId(null);
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredBooks();
  };

  const fetchFilteredBooks = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery);
      if (selectedSubject !== 'All') params.append('subject', selectedSubject);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const response = await axios.get(`${API_URL}/admin/books/search?${params.toString()}`);
      setBooks(response.data);
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Failed to search books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    
    const sortedBooks = [...books].sort((a, b) => {
      const aValue = a[column as keyof Book];
      const bValue = b[column as keyof Book];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setBooks(sortedBooks);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery.trim() === '' || 
      book.bookname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookid.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || book.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
          Manage Books
        </h1>
        <Link to="/admin/books/add" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Book
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or ID..."
                className="input pl-10"
              />
            </div>
            <div className="flex">
              <button type="submit" className="btn-primary flex-shrink-0">
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input"
              >
                <option value="All">All Subjects</option>
                <option value="Science">Science</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="History">History</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Psychology">Psychology</option>
                <option value="Religion">Religion</option>
                <option value="Architecture">Architecture</option>
                <option value="Sociology">Sociology</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [col, order] = e.target.value.split('-');
                  setSortBy(col);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="input"
              >
                <option value="bookname-asc">Title (A-Z)</option>
                <option value="bookname-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
                <option value="subject-asc">Subject (A-Z)</option>
                <option value="subject-desc">Subject (Z-A)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-error-600 mb-4">{error}</p>
          <button 
            onClick={fetchBooks} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cover
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('bookname')}
                  >
                    Title {getSortIcon('bookname')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('author')}
                  >
                    Author {getSortIcon('author')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('subject')}
                  >
                    Subject {getSortIcon('subject')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No books found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.bookid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={book.picture} 
                            alt={`Cover of ${book.bookname}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{book.bookname}</div>
                        <div className="text-xs text-gray-500">ID: {book.bookid}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{book.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{book.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <BookStatusBadge status={book.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/admin/books/edit/${book.bookid}`}
                            className="text-primary-700 hover:text-primary-900"
                          >
                            <Pencil className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(book.bookid)}
                            className="text-error-600 hover:text-error-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBookId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn-secondary"
                onClick={() => setDeleteBookId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooksPage;