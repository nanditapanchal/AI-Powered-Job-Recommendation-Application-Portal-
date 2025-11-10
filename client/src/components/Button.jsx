import React from "react";
import { useNavigate } from "react-router-dom";

export default function Button({
  children,
  className = "",
  onClick,
  type = "button",
  to,
  ...props
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (to) {
      e.preventDefault();
      navigate(to);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      {...props}
      className={`inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-all duration-300 
      bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${className}`}
    >
      {children}
    </button>
  );
}
