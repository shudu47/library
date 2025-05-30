import React from 'react';

interface BookStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const BookStatusBadge: React.FC<BookStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const isAvailable = status.toLowerCase() === 'available';
  
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const statusClasses = isAvailable
    ? 'bg-success-50 text-success-700'
    : 'bg-error-50 text-error-700';

  return (
    <span className={`${baseClasses} ${sizeClasses} ${statusClasses}`}>
      {status}
    </span>
  );
};

export default BookStatusBadge;