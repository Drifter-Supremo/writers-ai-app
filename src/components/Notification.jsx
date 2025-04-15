import React from 'react';

export default function Notification({ message, type = 'success', onClose }) {
  if (!message) return null;

  // Use new theme colors for base and status types
  const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-sm z-50 border"; // Added base border
  const typeStyle = type === 'success'
    ? "bg-status-success/20 border-status-success text-status-success" // Use success status colors
    : "bg-status-error/20 border-status-error text-status-error"; // Use error status colors

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <span>{message}</span>
      {/* Use inherit color for close button to match text */}
      <button onClick={onClose} className="ml-4 font-bold text-lg leading-none text-inherit">&times;</button>
    </div>
  );
}