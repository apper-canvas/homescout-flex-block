import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const PropertyCard = ({ property, onToggleFavorite, onViewDetails }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login with current property page as return URL
      const currentPath = `/property/${property.Id}`;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    // Proceed with favorite toggle for authenticated users
    await onToggleFavorite(property.Id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        hover 
        className="overflow-hidden cursor-pointer group"
        onClick={() => onViewDetails(property.Id)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
<img
src={property.images_c?.[0] ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
            alt={property.address}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <motion.div
              animate={property.isFavorite ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon 
                name="Heart" 
                size={16} 
                className={property.isFavorite ? "text-red-500 fill-current" : "text-gray-600"} 
              />
            </motion.div>
          </button>

          {/* Listing Type Badge */}
          <div className="absolute top-3 left-3">
<span className={`px-2 py-1 text-xs font-medium rounded-md ${
              property.listing_type_c === 'Buy' 
                ? 'bg-primary text-white' 
                : property.listing_type_c === 'Rent'
                ? 'bg-success text-white'
                : 'bg-warning text-white'
            }`}>
              For {property.listing_type_c}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-primary">
{formatPrice(property.price_c)}
              {property.listing_type_c === 'Rent' && <span className="text-sm font-normal text-gray-600">/month</span>}
            </h3>
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Bed" size={14} />
<span>{property.bedrooms_c} bed{property.bedrooms_c !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Bath" size={14} />
<span>{property.bathrooms_c} bath{property.bathrooms_c !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Square" size={14} />
<span>{formatSquareFeet(property.square_feet_c)} sqft</span>
            </div>
          </div>

          {/* Address */}
          <p className="text-gray-700 text-sm truncate">
{property.address_c}, {property.city_c}, {property.state_c} {property.zip_code_c}
          </p>

          {/* Property Type */}
          <p className="text-gray-500 text-xs mt-1">
{property.property_type_c}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;