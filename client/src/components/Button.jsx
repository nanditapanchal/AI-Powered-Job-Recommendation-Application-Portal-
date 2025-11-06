import React from "react";

export default function Button({ children, className = "", onClick, type = "button", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={`inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-all duration-300 
      bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}
