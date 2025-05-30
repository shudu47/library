import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/constants';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const SUBJECTS = [
  'Science', 'Computer Science', 'Religion', 'Architecture',
  'Sociology', 'Philosophy', 'Psychology', 'History',
  'Science Fiction', 'Nature', 'Mathematics', 'Novels', 'Other'
];

const EditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookname: '',
    author: '',
    subject: '',
    picture: '',
    status: 'Available'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/books/${id}`);
        setFormData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.bookname.trim()) {
      setError('Book title is required');
      return;
    }
    
    if (!formData.author.trim()) {
      setError('Author name is required');
      return;
    }
    
    if (!formData.subject) {
      setError('Subject is required');
      return;
    }
    
    if (!formData.picture.trim()) {
      setError('Book cover image URL is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await axios.put(`${API_URL}/admin/books/${id}`, formData);
      
      navigate('/admin/books');
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Failed to update book. Please try again later.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !formData.bookname) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-error-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/admin/books')} 
          className="btn-primary"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate('/admin/books')}
        className="flex items-center text-primary-700 hover:text-primary-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Books
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-primary-700 text-white">
          <h1 className="text-xl font-semibold">Edit Book</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-error-50 text-error-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="bookname" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                id="bookname"
                name="bookname"
                value={formData.bookname}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select a subject</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL *
            </label>
            <div className="flex">
              <input
                type="text"
                id="picture"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                placeholder="Enter URL to book cover image"
                className="input"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter the URL for the book cover image. For best results, use square or portrait images.
            </p>
          </div>
          
          {formData.picture && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Cover Image Preview</p>
              <div className="w-40 h-56 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={formData.picture} 
                  alt="Book cover preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;