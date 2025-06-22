import React from 'react';

const PatientsRecordSkeleton = () => {
  return (
    <div className="px-8 space-y-4 animate-pulse">
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="border rounded-2xl bg-white shadow p-4 space-y-4"
        >
          {/* Top: Name & Age */}
          <div className="h-4 bg-gray-200 rounded w-1/3" />

          {/* Divider */}
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone */}
            <div className="space-y-1">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>

            {/* Status badges */}
            <div className="space-y-1">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="pt-4 space-y-1">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientsRecordSkeleton;
