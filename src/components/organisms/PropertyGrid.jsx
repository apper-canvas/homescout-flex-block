import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry, 
  onToggleFavorite, 
  onViewDetails,
  onResetFilters,
  title = "Featured Properties"
}) => {
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        <Loading type="grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        <Error message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        <Empty
          icon="Home"
          title="No properties found"
          description="Try adjusting your search criteria or explore different areas."
          actionText="Reset Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
<p className="text-gray-600 font-medium">
          {properties.length === 0 ? 'No properties' : `${properties.length.toLocaleString()} propert${properties.length !== 1 ? 'ies' : 'y'}`} found
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <PropertyCard
              property={property}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PropertyGrid;