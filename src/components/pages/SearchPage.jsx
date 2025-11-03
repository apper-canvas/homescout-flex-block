import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import SearchBar from "@/components/molecules/SearchBar";
import ListingTypeTabs from "@/components/molecules/ListingTypeTabs";
import { useProperties } from "@/hooks/useProperties";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Initialize filters from URL params
const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    listingType: searchParams.get("type") || "Buy",
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")) : "",
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")) : "",
    minBeds: searchParams.get("minBeds") ? parseInt(searchParams.get("minBeds")) : "",
    minBaths: searchParams.get("minBaths") ? parseFloat(searchParams.get("minBaths")) : "",
    propertyTypes: searchParams.get("propertyTypes") ? searchParams.get("propertyTypes").split(",") : [],
    minSquareFeet: searchParams.get("minSquareFeet") ? parseInt(searchParams.get("minSquareFeet")) : "",
    maxSquareFeet: searchParams.get("maxSquareFeet") ? parseInt(searchParams.get("maxSquareFeet")) : "",
    minLotSize: searchParams.get("minLotSize") ? parseFloat(searchParams.get("minLotSize")) : "",
    maxLotSize: searchParams.get("maxLotSize") ? parseFloat(searchParams.get("maxLotSize")) : "",
    minYearBuilt: searchParams.get("minYearBuilt") ? parseInt(searchParams.get("minYearBuilt")) : "",
    maxYearBuilt: searchParams.get("maxYearBuilt") ? parseInt(searchParams.get("maxYearBuilt")) : "",
    features: searchParams.get("features") ? searchParams.get("features").split(",") : []
  });

const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const { 
    properties, 
    loading, 
    error, 
    loadProperties, 
    toggleFavorite, 
    getPropertyById 
  } = useProperties(filters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else if (!Array.isArray(value)) {
          params.set(key, value.toString());
        }
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      location: "",
listingType: "Buy",
      minPrice: "",
      maxPrice: "",
      minBeds: "",
      minBaths: "",
      propertyTypes: [],
      minSquareFeet: "",
      maxSquareFeet: "",
      minLotSize: "",
      maxLotSize: "",
      minYearBuilt: "",
      maxYearBuilt: "",
      features: []
    });
  };

  const handleSearch = () => {
    // Filters are already applied via useProperties hook
    setShowMobileFilters(false);
  };

  const handleLocationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  const handleListingTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      listingType: type
    }));
  };

  const handleToggleFavorite = async (propertyId) => {
    try {
      const isFavorited = await toggleFavorite(propertyId);
      toast.success(
        isFavorited ? "Property saved to favorites!" : "Property removed from favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const handleCloseModal = () => {
    setSelectedPropertyId(null);
  };

  // Sort properties
  const sortedProperties = React.useMemo(() => {
    if (!properties) return [];
    
    const sorted = [...properties];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "beds":
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      case "sqft":
        return sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      case "newest":
      default:
        return sorted.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
    }
  }, [properties, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Listing Type Tabs */}
            <ListingTypeTabs 
              activeType={filters.listingType} 
              onTypeChange={handleListingTypeChange} 
            />
            
            {/* Search Bar */}
            <SearchBar
              value={filters.location}
              onChange={handleLocationChange}
              onSearch={handleSearch}
              placeholder="Enter city, neighborhood, or ZIP code"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onResetFilters={handleResetFilters}
              className="sticky top-32"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
{/* Mobile Filter Button, View Toggle & Sort */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="Grid3X3" size={16} className="mr-2" />
                  Grid
                </button>
                <button
                  onClick={() => {
                    setViewMode("map");
                    toast.info("Map view functionality will be available soon");
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="Map" size={16} className="mr-2" />
                  Map
                </button>
              </div>
            </div>

            {/* Mobile Filter Button & Sort */}
            <div className="flex items-center justify-between mb-6 lg:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden"
              >
                <ApperIcon name="SlidersHorizontal" size={16} className="mr-2" />
                Filters
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="beds">Most Bedrooms</option>
                  <option value="sqft">Largest First</option>
                </Select>
              </div>
            </div>

{/* Property Results */}
            {viewMode === "grid" ? (
              <PropertyGrid
                properties={sortedProperties}
                loading={loading}
                error={error}
                onRetry={loadProperties}
                onToggleFavorite={handleToggleFavorite}
                onViewDetails={handleViewDetails}
                onResetFilters={handleResetFilters}
                title="Search Results"
              />
            ) : (
              <div className="bg-white rounded-lg shadow-card p-8 text-center">
                <ApperIcon name="Map" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
                <p className="text-gray-600 mb-4">
                  Interactive map with property pins and clustering will be available soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setViewMode("grid")}
                >
                  View as Grid
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          isMobile={true}
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
        />
)}
    </div>
  );
};

export default SearchPage;