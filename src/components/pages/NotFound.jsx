import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <ApperIcon name="Home" size={64} className="mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold text-secondary mb-2">404 - Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Link>
          
          <div className="mt-4">
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ApperIcon name="Search" size={16} className="mr-2" />
              Search Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;