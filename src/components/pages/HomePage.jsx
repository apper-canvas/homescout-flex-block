import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeroSection from "@/components/organisms/HeroSection";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import { useProperties } from "@/hooks/useProperties";
const HomePage = () => {
  const navigate = useNavigate();
const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState("Buy");
  
  // Load featured properties based on listing type
  const { 
    properties, 
    loading, 
    error, 
    loadProperties, 
    toggleFavorite, 
    getPropertyById 
  } = useProperties({ listingType });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search page with query
      navigate(`/search?location=${encodeURIComponent(searchQuery)}&type=${listingType}`);
    } else {
      toast.error("Please enter a location to search");
    }
  };

  const handleListingTypeChange = (type) => {
    setListingType(type);
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
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        listingType={listingType}
        onListingTypeChange={handleListingTypeChange}
      />

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PropertyGrid
          properties={properties}
          loading={loading}
          error={error}
          onRetry={loadProperties}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          title={`Featured Properties - For ${listingType}`}
        />
</section>
    </div>
  );
};

export default HomePage;