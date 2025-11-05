import React from 'react';

export default function Card({ children, className }) {
  return (
    <div className={`bg-white p-4 rounded shadow hover:shadow-md transition ${className}`}>
      {children}
    </div>
  );
}
