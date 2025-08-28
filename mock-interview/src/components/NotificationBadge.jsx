import React from 'react';

const NotificationBadge = ({ count, className = "" }) => {
  if (count === 0) return null;

  return (
    <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;
