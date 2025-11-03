import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Home",
  title = "No properties found",
  description = "Try adjusting your search criteria to find more properties.",
  actionText = "Reset Filters",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;