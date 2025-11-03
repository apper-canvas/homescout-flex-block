import React from "react";
import { cn } from "@/utils/cn";

const ListingTypeTabs = ({ activeType, onTypeChange }) => {
  const types = [
    { id: "Buy", label: "Buy", color: "text-primary" },
    { id: "Rent", label: "Rent", color: "text-success" },
    { id: "Sold", label: "Sold", color: "text-warning" }
  ];

  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            activeType === type.id
              ? "bg-primary text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default ListingTypeTabs;