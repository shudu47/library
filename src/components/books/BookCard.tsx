import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types/Book';
import BookStatusBadge from './BookStatusBadge';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/books/${book.bookid}`} className="block">
      <div className="card card-hover h-full flex flex-col">
        <div className="relative pb-[140%] overflow-hidden bg-gray-100">
          <img
            src={book.picture}
            alt={`Cover of ${book.bookname}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <BookStatusBadge status={book.status} />
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{book.bookname}</h3>
          <p className="text-gray-600 text-sm mb-1.5">by {book.author}</p>
          <div className="mt-auto">
            <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full inline-block mt-1">
              {book.subject}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;