import React from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import ListingTypeTabs from "@/components/molecules/ListingTypeTabs";

const HeroSection = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  listingType, 
  onListingTypeChange 
}) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-primary to-blue-800 overflow-hidden">
{/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Perfect Home
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover thousands of properties in your area. From cozy apartments to luxury homes, 
            find the perfect place to call home.
          </p>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Listing Type Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ListingTypeTabs 
                activeType={listingType} 
                onTypeChange={onListingTypeChange} 
              />
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-hero p-2"
            >
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                onSearch={onSearch}
                placeholder="Enter city, neighborhood, or ZIP code"
                className="bg-white rounded-lg"
              />
            </motion.div>
          </div>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-blue-200 text-sm mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["San Francisco", "New York", "Los Angeles", "Chicago", "Austin"].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onSearchChange({ target: { value: city } });
                    onSearch();
                  }}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;