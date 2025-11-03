import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterSection = ({ title, children, isOpen = true, onToggle, collapsible = true }) => {
  if (!collapsible) {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">{title}</h4>
        {children}
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-500" 
        />
      </button>
      
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;