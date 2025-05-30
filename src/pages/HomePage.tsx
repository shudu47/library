import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';
import Hero from '../components/shared/Hero';
import BookGrid from '../components/books/BookGrid';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Book } from '../types/Book';

const SUBJECTS = [
  'Science', 'Computer Science', 'Religion', 'Architecture',
  'Sociology', 'Philosophy', 'Psychology', 'History',
  'Science Fiction', 'Nature', 'Mathematics', 'Novels'
];

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/featured`);
        setFeaturedBooks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured books:', err);
        setError('Failed to load featured books. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div>
      <Hero />

      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Books</h2>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-error-600">{error}</p>
            </div>
          ) : (
            <BookGrid 
              books={featuredBooks} 
              emptyMessage="No featured books available at the moment." 
            />
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Browse by Subject</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {SUBJECTS.map((subject) => (
              <a 
                key={subject}
                href={`/search?subject=${encodeURIComponent(subject)}`}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all group card-hover"
              >
                <span className="text-lg font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
                  {subject}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="bg-primary-50 rounded-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-800">
                About MUST Library
              </h2>
              <p className="text-gray-700 mb-6">
                MUST Library is dedicated to fostering academic excellence and supporting the intellectual growth of our students and faculty. 
                Our collection spans numerous disciplines and includes current research materials, classic literature, and specialized resources.
              </p>
              <p className="text-gray-700">
                With our easy-to-use online catalog system, you can check book availability, browse our collection, and even place hold requests for borrowed items.
                Our goal is to make knowledge accessible to everyone in our academic community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;