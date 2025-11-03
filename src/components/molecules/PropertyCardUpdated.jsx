import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const PropertyCard = ({ property, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(property.Id);
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.Id}`);
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
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer group overflow-hidden hover:shadow-card-hover transition-all duration-300"
        onClick={handleViewDetails}
      >
        <div className="relative">
          <div className="aspect-[4/3] bg-gray-100">
            <img
              src={property.images?.[0] || '/api/placeholder/400/300'}
              alt={property.address}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ApperIcon 
              name="Heart" 
              size={16} 
              className={property.isFavorite ? "text-red-500 fill-current" : "text-gray-600"} 
            />
          </button>
          
          {property.listingType && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                For {property.listingType}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatPrice(property.price)}
              {property.listingType === 'Rent' && (
                <span className="text-sm font-normal text-gray-600">/month</span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600 text-sm mb-2">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bed" size={14} />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bath" size={14} />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="Square" size={14} />
                <span>{formatSquareFeet(property.squareFeet)} sqft</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {property.address}
            </h3>
            <p className="text-gray-600 text-sm">
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          
          {property.propertyType && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {property.propertyType}
              </span>
              
              {property.listedDate && (
                <span className="text-xs text-gray-500">
                  Listed {new Date(property.listedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;