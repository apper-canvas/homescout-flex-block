import React from "react";

const Loading = ({ type = "grid" }) => {
  if (type === "skeleton") {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-card mb-4 shimmer"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loading;