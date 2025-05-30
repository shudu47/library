import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/constants';

interface Book {
  bookid: number;
  bookname: string;
}

const NewBorrowingPage = () => {
  const navigate = useNavigate();
  // Form state management
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    bookName: '',
    dateBorrowed: '',
    dateToBeReturned: ''
  });
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/available`);
        if (response.data.success) {
          setAvailableBooks(response.data.books);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Show suggestions only for book name field
    if (name === 'bookName') {
      setShowSuggestions(true);
    }
  };

  // Handle book selection from suggestions
  const handleBookSelect = (bookname: string) => {
    setFormData(prev => ({ ...prev, bookName: bookname }));
    setShowSuggestions(false); // Hide suggestions after selection
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all required fields
    const errors = [];
    if (!formData.studentId.trim()) errors.push('Student ID');
    if (!formData.studentName.trim()) errors.push('Student name');
    if (!formData.bookName.trim()) errors.push('Book name');
    if (!formData.dateBorrowed) errors.push('Borrow date');
    if (!formData.dateToBeReturned) errors.push('Return date');

    if (errors.length > 0) {
      alert(`Please fill in the following fields: ${errors.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit data to backend
      const response = await axios.post(
        `${API_URL}/admin/orders`,
        {
          name: formData.studentName.trim(),
          bookname: formData.bookName.trim(),
          dateborrowed: formData.dateBorrowed,
          datetobereturned: formData.dateToBeReturned
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert(response.data.message || 'Record added successfully!');
        navigate('/admin/ManageOrders');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create record');
      console.error('Full error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">New Borrowing Record</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        {/* Book Name Field with Auto-complete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Name *
          </label>
          <input
            type="text"
            name="bookName"
            value={formData.bookName}
            onChange={handleInputChange}
            className="input w-full"
            required
            autoComplete="off"
            onFocus={() => setShowSuggestions(true)}
          />
          
          {/* Book Suggestions Dropdown */}
          {showSuggestions && availableBooks.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {availableBooks
                .filter(book => 
                  book.bookname.toLowerCase().includes(formData.bookName.toLowerCase())
                )
                .map((book) => (
                  <li
                    key={book.bookid}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleBookSelect(book.bookname)}
                  >
                    {book.bookname}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Student ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID *
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        {/* Student Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Name *
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrow Date *
            </label>
            <input
              type="date"
              name="dateBorrowed"
              value={formData.dateBorrowed}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date *
            </label>
            <input
              type="date"
              name="dateToBeReturned"
              value={formData.dateToBeReturned}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBorrowingPage;