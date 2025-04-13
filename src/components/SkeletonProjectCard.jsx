import React from 'react';

const SkeletonProjectCard = () => {
  return (
    <div className="card-creative p-6 animate-pulse">
      {/* Skeleton Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      
      {/* Skeleton Description */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

      {/* Skeleton Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default SkeletonProjectCard;
