"use client";

import Image from "next/image";

const DashboardLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Image
        src="/logo.png"
        alt="Loading..."
        width={300}
        height={240}
        className="animate-pulse"
        priority
      />
    </div>
  );
};

export default DashboardLoader;
