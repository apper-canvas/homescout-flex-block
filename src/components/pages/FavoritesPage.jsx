import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import { useFavoriteProperties } from "@/hooks/useProperties";

const FavoritesPage = () => {
  const navigate = useNavigate();
  
  const { 
    favorites, 
    loading, 
    error, 
    loadFavorites, 
    removeFavorite,
    updatePropertyNote 
  } = useFavoriteProperties();

  const handleToggleFavorite = async (propertyId) => {
    try {
      await removeFavorite(propertyId);
      toast.success("Property removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleSaveNote = async (propertyId, note) => {
    try {
      await updatePropertyNote(propertyId, note);
      toast.success("Note saved successfully");
    } catch (error) {
      toast.error("Failed to save note");
    }
  };

  const handleShare = async (property) => {
    const shareData = {
      title: `Check out this property: ${property.title}`,
      text: `${property.title} - $${property.price?.toLocaleString()} | ${property.bedrooms} bed, ${property.bathrooms} bath`,
      url: window.location.origin + `/property/${property.Id}`
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Property shared successfully");
      } else {
        // Fallback to copying URL or email
        const subject = encodeURIComponent(shareData.title);
        const body = encodeURIComponent(`${shareData.text}\n\nView details: ${shareData.url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        toast.info("Opening email to share property");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error("Failed to share property");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Properties
          </h1>
          <p className="text-gray-600">
            Keep track of properties you're interested in
          </p>
        </div>

        {/* Properties Grid */}
<PropertyGrid
          properties={favorites}
          loading={loading}
          error={error}
          onRetry={loadFavorites}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          onSaveNote={handleSaveNote}
          onShare={handleShare}
          title="Saved Properties"
          showNotes={true}
        />
</div>
    </div>
  );
};

export default FavoritesPage;