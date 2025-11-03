import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FilterSection from "@/components/molecules/FilterSection";
import PriceRange from "@/components/molecules/PriceRange";

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onResetFilters, 
  className = "",
  isMobile = false,
  isOpen = true,
  onClose
}) => {
  const [openSections, setOpenSections] = useState({
price: true,
    bedsBaths: true,
    propertyType: true,
    squareFootage: true,
    lotSize: true,
    yearBuilt: true,
    features: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const propertyTypes = [
    "Single Family Home",
    "Townhome",
    "Condo",
    "Apartment",
    "Multi-Family",
    "Land"
  ];

  const bedOptions = [
    { value: "", label: "Any" },
    { value: 1, label: "1+" },
    { value: 2, label: "2+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" },
    { value: 5, label: "5+" }
  ];

  const bathOptions = [
    { value: "", label: "Any" },
    { value: 1, label: "1+" },
    { value: 1.5, label: "1.5+" },
    { value: 2, label: "2+" },
    { value: 2.5, label: "2.5+" },
    { value: 3, label: "3+" },
    { value: 4, label: "4+" }
  ];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="small"
            onClick={onResetFilters}
            className="text-sm"
          >
            Reset
          </Button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ApperIcon name="X" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <PriceRange
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinChange={(value) => handleFilterChange("minPrice", value)}
          onMaxChange={(value) => handleFilterChange("maxPrice", value)}
          listingType={filters.listingType}
        />
      </FilterSection>

      {/* Beds & Baths */}
      <FilterSection
        title="Beds & Baths"
        isOpen={openSections.bedsBaths}
        onToggle={() => toggleSection("bedsBaths")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <Select
              value={filters.minBeds || ""}
              onChange={(e) => handleFilterChange("minBeds", e.target.value ? parseInt(e.target.value) : "")}
            >
              {bedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <Select
              value={filters.minBaths || ""}
              onChange={(e) => handleFilterChange("minBaths", e.target.value ? parseFloat(e.target.value) : "")}
            >
              {bathOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </FilterSection>

{/* Property Type */}
      <FilterSection
        title="Property Type"
        isOpen={openSections.propertyType}
        onToggle={() => toggleSection("propertyType")}
      >
        <div className="space-y-3">
          {["Single Family", "Condo", "Townhouse", "Land"].map((type) => (
            <label key={type} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) || false}
                onChange={(e) => {
                  const currentTypes = filters.propertyTypes || [];
                  const newTypes = e.target.checked
                    ? [...currentTypes, type]
                    : currentTypes.filter(t => t !== type);
                  handleFilterChange("propertyTypes", newTypes);
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Square Footage */}
      <FilterSection
        title="Square Footage"
        isOpen={openSections.squareFootage}
        onToggle={() => toggleSection("squareFootage")}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Square Feet
            </label>
            <Select
              value={filters.minSquareFeet || ""}
              onChange={(e) => handleFilterChange("minSquareFeet", e.target.value ? parseInt(e.target.value) : "")}
            >
              <option value="">No Min</option>
              <option value="500">500+ sq ft</option>
              <option value="750">750+ sq ft</option>
              <option value="1000">1,000+ sq ft</option>
              <option value="1250">1,250+ sq ft</option>
              <option value="1500">1,500+ sq ft</option>
              <option value="1750">1,750+ sq ft</option>
              <option value="2000">2,000+ sq ft</option>
              <option value="2500">2,500+ sq ft</option>
              <option value="3000">3,000+ sq ft</option>
              <option value="3500">3,500+ sq ft</option>
              <option value="4000">4,000+ sq ft</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Square Feet
            </label>
            <Select
              value={filters.maxSquareFeet || ""}
              onChange={(e) => handleFilterChange("maxSquareFeet", e.target.value ? parseInt(e.target.value) : "")}
            >
              <option value="">No Max</option>
              <option value="750">750 sq ft</option>
              <option value="1000">1,000 sq ft</option>
              <option value="1250">1,250 sq ft</option>
              <option value="1500">1,500 sq ft</option>
              <option value="1750">1,750 sq ft</option>
              <option value="2000">2,000 sq ft</option>
              <option value="2500">2,500 sq ft</option>
              <option value="3000">3,000 sq ft</option>
              <option value="3500">3,500 sq ft</option>
              <option value="4000">4,000 sq ft</option>
              <option value="5000">5,000+ sq ft</option>
            </Select>
          </div>
        </div>
      </FilterSection>

      {/* Lot Size */}
      <FilterSection
        title="Lot Size"
        isOpen={openSections.lotSize}
        onToggle={() => toggleSection("lotSize")}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Lot Size
            </label>
            <Select
              value={filters.minLotSize || ""}
              onChange={(e) => handleFilterChange("minLotSize", e.target.value ? parseFloat(e.target.value) : "")}
            >
              <option value="">No Min</option>
              <option value="0.1">0.1+ acres</option>
              <option value="0.25">0.25+ acres</option>
              <option value="0.5">0.5+ acres</option>
              <option value="1">1+ acre</option>
              <option value="2">2+ acres</option>
              <option value="5">5+ acres</option>
              <option value="10">10+ acres</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Lot Size
            </label>
            <Select
              value={filters.maxLotSize || ""}
              onChange={(e) => handleFilterChange("maxLotSize", e.target.value ? parseFloat(e.target.value) : "")}
            >
              <option value="">No Max</option>
              <option value="0.25">0.25 acres</option>
              <option value="0.5">0.5 acres</option>
              <option value="1">1 acre</option>
              <option value="2">2 acres</option>
              <option value="5">5 acres</option>
              <option value="10">10 acres</option>
              <option value="20">20+ acres</option>
            </Select>
          </div>
        </div>
      </FilterSection>

      {/* Year Built */}
      <FilterSection
        title="Year Built"
        isOpen={openSections.yearBuilt}
        onToggle={() => toggleSection("yearBuilt")}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Year Built
            </label>
            <Select
              value={filters.minYearBuilt || ""}
              onChange={(e) => handleFilterChange("minYearBuilt", e.target.value ? parseInt(e.target.value) : "")}
            >
              <option value="">No Min</option>
              <option value="2020">2020+</option>
              <option value="2010">2010+</option>
              <option value="2000">2000+</option>
              <option value="1990">1990+</option>
              <option value="1980">1980+</option>
              <option value="1970">1970+</option>
              <option value="1960">1960+</option>
              <option value="1950">1950+</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Year Built
            </label>
            <Select
              value={filters.maxYearBuilt || ""}
              onChange={(e) => handleFilterChange("maxYearBuilt", e.target.value ? parseInt(e.target.value) : "")}
            >
              <option value="">No Max</option>
              <option value="1950">1950</option>
              <option value="1960">1960</option>
              <option value="1970">1970</option>
              <option value="1980">1980</option>
              <option value="1990">1990</option>
              <option value="2000">2000</option>
              <option value="2010">2010</option>
              <option value="2020">2020</option>
            </Select>
          </div>
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection
        title="Property Features"
        isOpen={openSections.features}
        onToggle={() => toggleSection("features")}
      >
        <div className="space-y-3">
          {[
            { key: "pool", label: "Pool" },
            { key: "garage", label: "Garage" },
            { key: "fireplace", label: "Fireplace" },
            { key: "hardwoodFloors", label: "Hardwood Floors" }
          ].map((feature) => (
            <label key={feature.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.features?.includes(feature.key) || false}
                onChange={(e) => {
                  const currentFeatures = filters.features || [];
                  const newFeatures = e.target.checked
                    ? [...currentFeatures, feature.key]
                    : currentFeatures.filter(f => f !== feature.key);
                  handleFilterChange("features", newFeatures);
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
              />
              <span className="text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button (Mobile) */}
      {isMobile && (
        <div className="pt-6 border-t border-gray-200">
          <Button
            variant="primary"
            size="large"
            className="w-full"
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">
            {content}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-card p-6 ${className}`}>
      {content}
    </div>
  );
};

export default FilterSidebar;