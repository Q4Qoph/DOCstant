import React from 'react';

const PatientDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Header with title and buttons */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="space-x-2 flex">
          <div className="h-10 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white border rounded-2xl p-6 space-y-4 shadow">
        <div className="h-5 w-40 bg-gray-300 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Medical Information Card */}
      <div className="bg-white border rounded-2xl p-6 space-y-4 shadow">
        <div className="h-5 w-48 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      </div>
      
      <div className="bg-white border rounded-2xl p-6 space-y-4 shadow">
        <div className="h-5 w-48 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsSkeleton;
