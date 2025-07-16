// components/PatientSkeleton.js
export default function PatientDetailsSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="w-1/2 space-y-2">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <div className="h-10 w-40 bg-gray-300 rounded"></div>
          <div className="h-10 w-40 bg-gray-300 rounded"></div>
        </div>

      </div>
      {/* Tabs */}
      <div className="flex justify-between space-x-6 mt-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-gray-200 rounded"></div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="mt-6 p-4 border rounded-lg">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {["Blood Pressure", "Temperature", "Heart Rate", "Respiratory Rate"].map((label, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-2">
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
