import React from "react";
import Input from "@/components/atoms/Input";

const PriceRange = ({ minPrice, maxPrice, onMinChange, onMaxChange, listingType = "Buy" }) => {
  const formatValue = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseValue = (value) => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
  };

  const handleMinChange = (e) => {
    const value = parseValue(e.target.value);
    onMinChange(value);
  };

  const handleMaxChange = (e) => {
    const value = parseValue(e.target.value);
    onMaxChange(value);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Min Price {listingType === 'Rent' ? '(per month)' : ''}
        </label>
        <Input
          type="text"
          placeholder={listingType === 'Rent' ? "$1,000" : "$100,000"}
          value={minPrice ? formatValue(minPrice) : ""}
          onChange={handleMinChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Price {listingType === 'Rent' ? '(per month)' : ''}
        </label>
        <Input
          type="text"
          placeholder={listingType === 'Rent' ? "$5,000" : "$1,000,000"}
          value={maxPrice ? formatValue(maxPrice) : ""}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default PriceRange;