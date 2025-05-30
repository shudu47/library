import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { Book } from '../types/Book';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import BookStatusBadge from '../components/books/BookStatusBadge';
import { BookOpen, User, Calendar, ArrowLeft } from 'lucide-react';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-error-600 mb-4">{error || 'Book not found'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-700 hover:text-primary-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 bg-gray-100">
            <img
              src={book.picture}
              alt={`Cover of ${book.bookname}`}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
          <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {book.bookname}
                </h1>
                <BookStatusBadge status={book.status} size="md" />
              </div>
              <p className="text-lg text-gray-700">{book.author}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary-700 mr-3" />
                <span className="text-gray-700">
                  <strong>Subject:</strong> {book.subject}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-primary-700 mr-3" />
                <span className="text-gray-700">
                  <strong>Author:</strong> {book.author}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-700 mr-3" />
                <span className="text-gray-700">
                  <strong>Book ID:</strong> {book.bookid}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Availability Information</h2>
              {book.status.toLowerCase() === 'available' ? (
                <div className="bg-success-50 text-success-700 p-4 rounded-md">
                  <p className="font-medium">This book is currently available in the library.</p>
                  <p className="mt-1 text-sm">
                    Visit the library desk to borrow this book. Remember to bring your student ID.
                  </p>
                </div>
              ) : (
                <div className="bg-error-50 text-error-700 p-4 rounded-md">
                  <p className="font-medium">This book is currently unavailable.</p>
                  <p className="mt-1 text-sm">
                    The book has been borrowed by another student. Check back later or ask the librarian about the expected return date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;