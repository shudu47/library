import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { BookOpen, Users, BookCopy, Clock, Plus } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  overdueBooks: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-error-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
          Administrator Dashboard
        </h1>
        <div className="flex space-x-4">
          <Link to="/admin/books/add" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-primary-700" />
              </div>
              <h2 className="text-lg font-semibold">Total Books</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-success-50 p-3 rounded-full mr-4">
                <BookCopy className="h-6 w-6 text-success-700" />
              </div>
              <h2 className="text-lg font-semibold">Available</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.availableBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-accent-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-accent-700" />
              </div>
              <h2 className="text-lg font-semibold">Borrowed</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.borrowedBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-error-50 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-error-700" />
              </div>
              <h2 className="text-lg font-semibold">Overdue</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.overdueBooks}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Book Management</h2>
          <p className="text-gray-600 mb-6">
            Manage all books in the library inventory. Add new books, update existing ones, or change availability status.
          </p>
          <Link to="/admin/books" className="btn-primary">
            Manage Books
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Borrowing Records</h2>
          <p className="text-gray-600 mb-6">
            View and manage all book borrowing records. Track due dates, handle returns, and manage overdue books.
          </p>
          <Link to="/admin/orders" className="btn-primary">
            Manage Records
          </Link>
        </div>
      </div>

      <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
        <h2 className="text-xl font-semibold mb-3 text-primary-800">Quick Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use the top navigation to quickly access different sections of the admin panel.</li>
          <li>You can change a book's status directly from the book management page.</li>
          <li>Remember to update the status of returned books to make them available again.</li>
          <li>Books that are overdue for more than 14 days should be reported to faculty administration.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;