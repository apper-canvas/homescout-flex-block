import { toast } from "react-toastify";
import notesService from "./notesService.js";
import React from "react";
import Error from "@/components/ui/Error";

const FAVORITES_KEY = 'favoriteProperties';

// Get favorites from localStorage
const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Store favorites in memory for session
const favoriteProperties = new Set(getFavoritesFromStorage());

class PropertyService {
  constructor() {
    // Initialize ApperClient
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "listed_date_c"}},
          {"field": {"Name": "listing_type_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "hoa_fees_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "walk_score_c"}},
          {"field": {"Name": "transit_score_c"}},
          {"field": {"Name": "bike_score_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Add favorite status to results
      return response.data.map(property => ({
        ...property,
        isFavorite: favoriteProperties.has(property.Id),
        // Parse features if it's a string
        features_c: property.features_c ? 
          (typeof property.features_c === 'string' ? property.features_c.split('\n') : property.features_c) : 
          [
            "Central Air Conditioning",
            "Hardwood Floors",
            "Updated Kitchen", 
            "Spacious Master Suite",
            "Private Backyard",
            "Garage Parking",
            "Walk-in Closets",
            "Modern Appliances"
          ],
        // Parse images if it's a string
        images_c: property.images_c ? 
          (typeof property.images_c === 'string' ? property.images_c.split('\n') : property.images_c) : 
          [
            '/api/placeholder/800/600',
            '/api/placeholder/800/601',
            '/api/placeholder/800/602',
            '/api/placeholder/800/603',
            '/api/placeholder/800/604'
          ]
      }));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      toast.error("Failed to load properties");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "listed_date_c"}},
          {"field": {"Name": "listing_type_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "hoa_fees_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "walk_score_c"}},
          {"field": {"Name": "transit_score_c"}},
          {"field": {"Name": "bike_score_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById('property_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error("Property not found");
      }

      const property = response.data;
      
      // Add enhanced data for UI
      return {
        ...property,
        isFavorite: favoriteProperties.has(property.Id),
        features_c: property.features_c ? 
          (typeof property.features_c === 'string' ? property.features_c.split('\n') : property.features_c) : 
          [
            "Central Air Conditioning",
            "Hardwood Floors",
            "Updated Kitchen", 
            "Spacious Master Suite",
            "Private Backyard",
            "Garage Parking",
            "Walk-in Closets",
            "Modern Appliances"
          ],
        images_c: property.images_c ? 
          (typeof property.images_c === 'string' ? property.images_c.split('\n') : property.images_c) : 
          [
            '/api/placeholder/800/600',
            '/api/placeholder/800/601',
            '/api/placeholder/800/602',
            '/api/placeholder/800/603',
            '/api/placeholder/800/604'
          ],
        neighborhood: {
          walkScore: property.walk_score_c || 85,
          transitScore: property.transit_score_c || 72,
          bikeScore: property.bike_score_c || 78,
          amenities: [
            { name: "Whole Foods", distance: "5 min walk", icon: "ShoppingCart" },
            { name: "LA Fitness", distance: "8 min walk", icon: "Dumbbell" },
            { name: "Central Park", distance: "3 min walk", icon: "Trees" }
          ]
        },
        agent: {
          name: "Sarah Johnson",
          company: "Premier Realty Group",
          phone: "(555) 123-4567",
          email: "sarah@premierrealty.com",
          rating: 4.9,
          reviews: 127,
          experience: 8,
          propertiesSold: 156
        }
      };
    } catch (error) {
      console.error("Error fetching property:", error?.response?.data?.message || error);
      throw new Error("Property not found");
    }
  }

  async getFavorites() {
    try {
      const allProperties = await this.getAll();
      const favorites = allProperties
        .filter(property => favoriteProperties.has(property.Id))
        .map(property => ({
          ...property,
          isFavorite: true,
          note: notesService.getPropertyNote(property.Id)
        }));
      
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error?.response?.data?.message || error);
      return [];
    }
  }

async toggleFavorite(id) {
    return new Promise((resolve) => {
      const propertyId = parseInt(id);
      if (favoriteProperties.has(propertyId)) {
        favoriteProperties.delete(propertyId);
        saveFavoritesToStorage(Array.from(favoriteProperties));
        resolve(false); // Not favorited anymore
      } else {
        favoriteProperties.add(propertyId);
        saveFavoritesToStorage(Array.from(favoriteProperties));
        resolve(true); // Now favorited
      }
    });
  }

  async savePropertyNote(propertyId, note) {
    await notesService.savePropertyNote(propertyId, note);
    return { success: true };
  }
  async searchProperties(filters = {}) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "listed_date_c"}},
          {"field": {"Name": "listing_type_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "is_favorite_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "hoa_fees_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: []
      };

      // Build where conditions based on filters
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "city_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "state_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "zip_code_c", "operator": "Contains", "values": [searchTerm]},
                {"fieldName": "address_c", "operator": "Contains", "values": [searchTerm]}
              ],
              operator: "OR"
            }
          ]
        }];
      }

      if (filters.listingType && filters.listingType !== 'All') {
        params.where.push({
          "FieldName": "listing_type_c",
          "Operator": "EqualTo",
          "Values": [filters.listingType]
        });
      }

      if (filters.minPrice) {
        params.where.push({
          "FieldName": "price_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.minPrice]
        });
      }

      if (filters.maxPrice) {
        params.where.push({
          "FieldName": "price_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [filters.maxPrice]
        });
      }

      if (filters.minBeds) {
        params.where.push({
          "FieldName": "bedrooms_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.minBeds]
        });
      }

      if (filters.minBaths) {
        params.where.push({
          "FieldName": "bathrooms_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.minBaths]
        });
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        params.where.push({
          "FieldName": "property_type_c",
          "Operator": "ExactMatch",
          "Values": filters.propertyTypes,
          "Include": true
        });
      }

      const response = await this.apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Add favorite status and parse fields
      const results = response.data.map(property => ({
        ...property,
        isFavorite: favoriteProperties.has(property.Id),
        features_c: property.features_c ? 
          (typeof property.features_c === 'string' ? property.features_c.split('\n') : property.features_c) : [],
        images_c: property.images_c ? 
          (typeof property.images_c === 'string' ? property.images_c.split('\n') : property.images_c) : []
      }));

      return results;
    } catch (error) {
      console.error("Error searching properties:", error?.response?.data?.message || error);
      toast.error("Failed to search properties");
      return [];
    }
  }

  // Get properties by listing type for homepage
  async getByListingType(listingType = 'Buy', limit = 6) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "listing_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "images_c"}}
        ],
        where: [{
          "FieldName": "listing_type_c",
          "Operator": "EqualTo",
          "Values": [listingType]
        }],
        pagingInfo: { limit: limit || 6, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords('property_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(property => ({
        ...property,
        isFavorite: favoriteProperties.has(property.Id),
        images_c: property.images_c ? 
          (typeof property.images_c === 'string' ? property.images_c.split('\n') : property.images_c) : 
          ['/api/placeholder/800/600']
      }));
    } catch (error) {
      console.error("Error fetching properties by listing type:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PropertyService();