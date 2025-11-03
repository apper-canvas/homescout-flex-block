import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useProperties } from "@/hooks/useProperties";
import ContactAgentModal from "@/components/molecules/ContactAgentModal";
import TourSchedulingModal from "@/components/molecules/TourSchedulingModal";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, toggleFavorite } = useProperties();
const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);

  // Utility functions
  const formatPrice = (price) => {
    if (!price) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    if (!sqft) return '0';
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  // Image navigation functions
  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
};

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyById(parseInt(id));
      setProperty(data);
    } catch (err) {
      console.error("Failed to load property:", err);
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!property) return;
    try {
      await toggleFavorite(property.Id);
      setProperty(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      toast.success(property.isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

const handleScheduleTour = () => {
    setShowTourModal(true);
  };

  const handleContactAgent = () => {
    setShowContactModal(true);
  };

  const handleSaveProperty = () => {
    handleToggleFavorite();
  };

  const handleShare = () => {
    if (navigator.share && property) {
      navigator.share({
        title: `Property at ${property.address}`,
        text: `Check out this ${property.bedrooms}br/${property.bathrooms}ba ${property.propertyType} for ${formatPrice(property.price)}`,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Property link copied to clipboard!");
      });
    } else if (property) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Property link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Loading type="skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Error 
            message={error} 
            onRetry={loadProperty}
            showRetry={true}
          />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <Button onClick={() => navigate(-1)}>
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Back to Properties
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 py-6 max-w-7xl"
      >
        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-card mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.address}
                </h1>
                <p className="text-lg text-gray-600">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="text-4xl font-bold text-primary">
                    {formatPrice(property.price)}
                    {property.listingType === 'Rent' && (
                      <span className="text-xl font-normal text-gray-600">/month</span>
                    )}
                  </div>
                  <Badge variant="primary" className="text-sm">
                    For {property.listingType}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleToggleFavorite}
                  className="flex items-center"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={20} 
                    className={`mr-2 ${property.isFavorite ? "text-red-500 fill-current" : "text-gray-600"}`} 
                  />
                  {property.isFavorite ? 'Saved' : 'Save'}
                </Button>
                
                <Button variant="outline" onClick={handleShare}>
                  <ApperIcon name="Share" size={20} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Property Stats */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ApperIcon name="Bed" size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ApperIcon name="Bath" size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ApperIcon name="Square" size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatSquareFeet(property.squareFeet)}</div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              
              {property.lotSize && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ApperIcon name="TreePine" size={24} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{formatSquareFeet(property.lotSize)}</div>
                  <div className="text-sm text-gray-600">Lot Size</div>
                </div>
              )}
              
              {property.yearBuilt && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ApperIcon name="Calendar" size={24} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              )}
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ApperIcon name="Home" size={24} className="text-primary" />
                </div>
                <div className="text-lg font-bold text-gray-900">{property.propertyType}</div>
                <div className="text-sm text-gray-600">Type</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="relative">
                <div className="aspect-[16/10] bg-gray-100">
                  <img
                    src={property.images?.[currentImageIndex] || '/api/placeholder/800/500'}
                    alt={`Property ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {property.images && property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <ApperIcon name="ChevronLeft" size={24} />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <ApperIcon name="ChevronRight" size={24} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Strip */}
                {property.images && property.images.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex space-x-2 overflow-x-auto">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? "border-primary shadow-md" 
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>
            )}

            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(property.features || [
                  "Central Air Conditioning",
                  "Hardwood Floors", 
                  "Updated Kitchen",
                  "Spacious Master Suite",
                  "Private Backyard",
                  "Garage Parking",
                  "Walk-in Closets",
                  "Modern Appliances"
                ]).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ApperIcon name="Check" size={18} className="text-success flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* School Information */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">School Information</h2>
              <div className="space-y-4">
                {[
                  { name: "Washington Elementary", rating: 8, distance: "0.3 miles", type: "Elementary" },
                  { name: "Lincoln Middle School", rating: 9, distance: "0.7 miles", type: "Middle School" },
                  { name: "Roosevelt High School", rating: 7, distance: "1.2 miles", type: "High School" }
                ].map((school, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{school.name}</h4>
                      <p className="text-sm text-gray-600">{school.type} • {school.distance}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Star" size={16} className="text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{school.rating}/10</span>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Details */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Neighborhood</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Walk Score</h4>
                  <p className="text-2xl font-bold text-primary">87</p>
                  <p className="text-sm text-gray-600">Very Walkable</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Car" size={24} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Transit Score</h4>
                  <p className="text-2xl font-bold text-primary">72</p>
                  <p className="text-sm text-gray-600">Excellent Transit</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Bike" size={24} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Bike Score</h4>
                  <p className="text-2xl font-bold text-primary">65</p>
                  <p className="text-sm text-gray-600">Bikeable</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Nearby Amenities</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Coffee" size={16} className="text-gray-400" />
                    <span>Starbucks - 2 min walk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="ShoppingCart" size={16} className="text-gray-400" />
                    <span>Whole Foods - 5 min walk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Dumbbell" size={16} className="text-gray-400" />
                    <span>LA Fitness - 8 min walk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Trees" size={16} className="text-gray-400" />
                    <span>Central Park - 3 min walk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Tax Information */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Tax Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Annual Tax Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium">{formatPrice(Math.round(property.price * 0.012))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">School Tax</span>
                      <span className="font-medium">{formatPrice(Math.round(property.price * 0.008))}</span>
                    </div>
                    {property.hoaFees && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">HOA Fees (Annual)</span>
                        <span className="font-medium">{formatPrice(property.hoaFees * 12)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                      <span>Total Annual</span>
                      <span>{formatPrice(Math.round(property.price * 0.02) + (property.hoaFees ? property.hoaFees * 12 : 0))}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tax Rate</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Tax Rate</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">County Average</span>
                      <span className="font-medium">1.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State Average</span>
                      <span className="font-medium">1.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price History */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Price History</h2>
              <div className="space-y-4">
                {[
                  { date: "Dec 2024", price: property.price, event: "Listed for sale", change: null },
                  { date: "Aug 2023", price: Math.round(property.price * 0.95), event: "Sold", change: "+2.1%" },
                  { date: "Mar 2022", price: Math.round(property.price * 0.88), event: "Sold", change: "+8.5%" },
                  { date: "Nov 2019", price: Math.round(property.price * 0.78), event: "Sold", change: "+12.3%" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{item.date}</div>
                      <div className="text-sm text-gray-600">{item.event}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{formatPrice(item.price)}</div>
                      {item.change && (
                        <div className={`text-sm ${item.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                          {item.change}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  size="large" 
                  className="w-full"
                  onClick={handleScheduleTour}
                >
                  <ApperIcon name="Calendar" size={20} className="mr-2" />
                  Schedule Tour
                </Button>
                
                <Button 
                  variant="outline" 
                  size="large" 
                  className="w-full"
                  onClick={handleContactAgent}
                >
                  <ApperIcon name="Phone" size={20} className="mr-2" />
                  Contact Agent
                </Button>
                
                <Button 
                  variant="outline" 
                  size="large" 
                  className="w-full"
                  onClick={handleSaveProperty}
                >
                  <ApperIcon 
                    name="Heart" 
                    size={20} 
                    className={`mr-2 ${property.isFavorite ? "text-red-500 fill-current" : ""}`} 
                  />
                  {property.isFavorite ? 'Saved Property' : 'Save Property'}
                </Button>
              </div>
            </div>

            {/* Listing Agent */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Listing Agent</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Premier Realty Group</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <ApperIcon name="Star" size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-sm text-gray-600">(127 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={16} className="text-gray-400" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={16} className="text-gray-400" />
                  <span>sarah@premierrealty.com</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-gray-900">8 years</div>
                    <div className="text-gray-600">Experience</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">156</div>
                    <div className="text-gray-600">Properties Sold</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator Preview */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estimated Monthly Payment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal & Interest</span>
                  <span className="font-medium">{formatPrice(Math.round(property.price * 0.005))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Taxes</span>
                  <span className="font-medium">{formatPrice(Math.round(property.price * 0.02 / 12))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium">{formatPrice(Math.round(property.price * 0.003 / 12))}</span>
                </div>
                {property.hoaFees && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">HOA Fees</span>
                    <span className="font-medium">{formatPrice(property.hoaFees)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3">
                  <span>Total Monthly</span>
                  <span>{formatPrice(Math.round(property.price * 0.005) + Math.round(property.price * 0.02 / 12) + Math.round(property.price * 0.003 / 12) + (property.hoaFees || 0))}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                *Estimate based on 20% down, 7.2% interest rate, 30-year term
              </p>
            </div>
          </div>
        </div>
</motion.div>

{/* Contact Agent Modal */}
      <ContactAgentModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        agent={property?.agent}
        propertyId={id}
      />

      {/* Tour Scheduling Modal */}
      <TourSchedulingModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        property={property}
      />
</div>
  );
};

export default PropertyDetailsPage;