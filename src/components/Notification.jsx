import React from 'react';

export default function Notification({ message, type = 'success', onClose }) {
  if (!message) return null;

  const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-sm z-50";
  const typeStyle = type === 'success'
    ? "bg-green-100 border border-green-300 text-green-800"
    : "bg-red-100 border border-red-300 text-red-800"; // Add other types if needed

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none">&times;</button>
    </div>
  );
}