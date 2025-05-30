import React from 'react';
import BookCard from './BookCard';
import { Book } from '../../types/Book';

interface BookGridProps {
  books: Book[];
  title?: string;
  emptyMessage?: string;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  title,
  emptyMessage = "No books found."
}) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <BookCard key={book.bookid} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookGrid;