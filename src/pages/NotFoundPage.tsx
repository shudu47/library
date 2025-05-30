import React from 'react';
import { Link } from 'react-router-dom';
import { BookX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container-custom py-16 text-center">
      <div className="max-w-md mx-auto">
        <BookX className="h-24 w-24 mx-auto text-primary-700 mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="btn-primary">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;