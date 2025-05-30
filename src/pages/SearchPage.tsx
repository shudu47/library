import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { Book } from '../types/Book';
import BookGrid from '../components/books/BookGrid';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

const SUBJECTS = [
  'All', 'Science', 'Computer Science', 'Religion', 'Architecture',
  'Sociology', 'Philosophy', 'Psychology', 'History',
  'Science Fiction', 'Nature', 'Mathematics', 'Novels'
];

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const query = searchParams.get('q') || '';
  const subject = searchParams.get('subject') || 'All';
  const availability = searchParams.get('availability') || 'all';

  const [searchQuery, setSearchQuery] = useState<string>(query);
  const [selectedSubject, setSelectedSubject] = useState<string>(subject);
  const [selectedAvailability, setSelectedAvailability] = useState<string>(availability);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (subject && subject !== 'All') params.append('subject', subject);
        if (availability && availability !== 'all') params.append('status', availability);
        
        const response = await axios.get(`${API_URL}/books/search?${params.toString()}`);
        setBooks(response.data);
        setError(null);
      } catch (err) {
        console.error('Error searching books:', err);
        setError('Failed to search books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, subject, availability]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    
    if (selectedSubject !== 'All') {
      newParams.set('subject', selectedSubject);
    } else {
      newParams.delete('subject');
    }
    
    if (selectedAvailability !== 'all') {
      newParams.set('availability', selectedAvailability);
    } else {
      newParams.delete('availability');
    }
    
    setSearchParams(newParams);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Search Books</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or keyword..."
                className="input pl-10"
              />
            </div>
            <div className="flex">
              <button type="submit" className="btn-primary flex-shrink-0">
                Search
              </button>
              <button 
                type="button" 
                className="btn-secondary ml-2 md:hidden"
                onClick={toggleFilters}
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`md:flex gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input"
              >
                {SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:w-1/2">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                id="availability"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="input"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
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
          <p className="text-error-600">{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {books.length === 0 
              ? 'No books found' 
              : `Found ${books.length} book${books.length === 1 ? '' : 's'}`}
            {query && <span> for "{query}"</span>}
            {subject !== 'All' && <span> in {subject}</span>}
            {availability !== 'all' && <span> that are {availability}</span>}
          </h2>
          <BookGrid 
            books={books} 
            emptyMessage="No books match your search criteria. Try adjusting your filters." 
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;