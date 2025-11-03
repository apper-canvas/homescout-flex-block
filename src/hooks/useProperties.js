import { useState, useEffect } from "react";
import propertyService from "@/services/api/propertyService";

export const useProperties = (filters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = Object.keys(filters).length > 0 
        ? await propertyService.searchProperties(filters)
        : await propertyService.getAll();
      
      setProperties(data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const isFavorited = await propertyService.toggleFavorite(propertyId);
      
      // Update local state
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.Id === propertyId
            ? { ...property, isFavorite: isFavorited }
            : property
        )
      );
      
      return isFavorited;
    } catch (err) {
      console.error("Error toggling favorite:", err);
      throw err;
    }
  };

const getPropertyById = async (propertyId) => {
    try {
      return await propertyService.getById(propertyId);
    } catch (err) {
      console.error("Error loading property:", err);
      throw err;
    }
  };

  useEffect(() => {
loadProperties();
  }, [JSON.stringify(filters)]);

  return {
    properties,
    loading,
    error,
    loadProperties,
    toggleFavorite,
    getPropertyById
  };
};

export const useFavoriteProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await propertyService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError("Failed to load favorite properties.");
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await propertyService.toggleFavorite(propertyId);
      setFavorites(prevFavorites =>
        prevFavorites.filter(property => property.Id !== propertyId)
      );
    } catch (err) {
      console.error("Error removing favorite:", err);
      throw err;
    }
  };

  const updatePropertyNote = async (propertyId, note) => {
    try {
      await propertyService.savePropertyNote(propertyId, note);
      setFavorites(prevFavorites =>
        prevFavorites.map(property =>
          property.Id === propertyId
            ? { ...property, note: note }
            : property
        )
      );
    } catch (err) {
      console.error("Error updating property note:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    removeFavorite,
    updatePropertyNote
  };
};