import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary-700 to-primary-800 text-white py-16 md:py-24">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Welcome to MUST Library
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8">
            Your gateway to knowledge. Explore our vast collection of books and resources.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for books by title, author, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-4 pr-12 rounded-md text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-accent-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;