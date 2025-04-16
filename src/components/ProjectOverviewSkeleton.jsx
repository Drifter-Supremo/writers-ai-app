import React from "react";

export default function ProjectOverviewSkeleton() {
  return (
    <div className="card-creative p-8 max-w-2xl mx-auto mb-8 break-words animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="h-8 w-2/3 bg-cream-gray/30 rounded mb-2"></div>
        <div className="h-6 w-12 bg-cream-gray/20 rounded"></div>
      </div>
      <div className="h-5 w-full bg-cream-gray/20 rounded mb-2"></div>
      <div className="h-5 w-5/6 bg-cream-gray/20 rounded mb-2"></div>
      <div className="h-5 w-2/3 bg-cream-gray/20 rounded mb-6"></div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 w-16 bg-cream-gray/20 rounded-full"></div>
        <div className="h-6 w-14 bg-cream-gray/20 rounded-full"></div>
        <div className="h-6 w-20 bg-cream-gray/20 rounded-full"></div>
      </div>
      <div className="h-4 w-1/2 bg-cream-gray/10 rounded mx-auto"></div>
    </div>
  );
}
