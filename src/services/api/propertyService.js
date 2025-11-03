import properties from "@/services/mockData/properties.json";
import notesService from "./notesService.js";

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

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Store favorites in memory for session
const favoriteProperties = new Set(getFavoritesFromStorage());

// Properties data reference
const propertiesData = properties;

class PropertyService {
  async getAll() {
    await delay(300);
    
    // Return properties with current favorite status
    return propertiesData.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));
  }

  async getById(id) {
    await delay(200);
    
    const property = propertiesData.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    
    // Add mock data for additional fields not in the JSON
    const enhancedProperty = {
      ...property,
      isFavorite: favoriteProperties.has(property.Id),
      features: property.features || [
        "Central Air Conditioning",
        "Hardwood Floors",
        "Updated Kitchen", 
        "Spacious Master Suite",
        "Private Backyard",
        "Garage Parking",
        "Walk-in Closets",
        "Modern Appliances"
      ],
      hoaFees: property.hoaFees || (property.propertyType === 'Condo' ? 250 : null),
      images: property.images || [
        '/api/placeholder/800/600',
        '/api/placeholder/800/601',
        '/api/placeholder/800/602',
        '/api/placeholder/800/603',
        '/api/placeholder/800/604'
      ],
      neighborhood: {
        walkScore: 85,
        transitScore: 72,
        bikeScore: 78,
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
    
    return enhancedProperty;
  }

  async getFavorites() {
    await delay(250);
    
    const favorites = propertiesData
      .filter(property => favoriteProperties.has(property.Id))
      .map(property => ({
        ...property,
        isFavorite: true,
        note: notesService.getPropertyNote(property.Id)
      }));
    
    return favorites;
  }

  async toggleFavorite(id) {
    await delay(100);
    
    const propertyId = parseInt(id);
    if (favoriteProperties.has(propertyId)) {
      favoriteProperties.delete(propertyId);
      saveFavoritesToStorage(Array.from(favoriteProperties));
      return false; // Not favorited anymore
    } else {
      favoriteProperties.add(propertyId);
      saveFavoritesToStorage(Array.from(favoriteProperties));
      return true; // Now favorited
    }
  }

  async savePropertyNote(propertyId, note) {
    await notesService.savePropertyNote(propertyId, note);
    // Simulate API delay
    await delay(200);
    return { success: true };
  }

  async searchProperties(filters = {}) {
    await delay(400);
    
    let results = [...propertiesData];

    // Filter by location
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      results = results.filter(property => 
        property.city.toLowerCase().includes(searchTerm) ||
        property.state.toLowerCase().includes(searchTerm) ||
        property.zipCode.includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by listing type
    if (filters.listingType && filters.listingType !== 'All') {
      results = results.filter(property => property.listingType === filters.listingType);
    }

    // Filter by price range
    if (filters.minPrice) {
      results = results.filter(property => property.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(property => property.price <= filters.maxPrice);
    }

    // Filter by minimum bedrooms
    if (filters.minBeds) {
      results = results.filter(property => property.bedrooms >= filters.minBeds);
    }

    // Filter by minimum bathrooms
    if (filters.minBaths) {
      results = results.filter(property => property.bathrooms >= filters.minBaths);
    }

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    // Additional filtering for advanced features
    if (filters.minSquareFeet) {
      results = results.filter(property => 
        property.squareFeet && property.squareFeet >= filters.minSquareFeet
      );
    }
    if (filters.maxSquareFeet) {
      results = results.filter(property => 
        property.squareFeet && property.squareFeet <= filters.maxSquareFeet
      );
    }
    
    // Lot size filters
    if (filters.minLotSize) {
      results = results.filter(property => 
        property.lotSize && property.lotSize >= filters.minLotSize
      );
    }
    if (filters.maxLotSize) {
      results = results.filter(property => 
        property.lotSize && property.lotSize <= filters.maxLotSize
      );
    }
    
    // Year built filters
    if (filters.minYearBuilt) {
      results = results.filter(property => 
        property.yearBuilt && property.yearBuilt >= filters.minYearBuilt
      );
    }
    if (filters.maxYearBuilt) {
      results = results.filter(property => 
        property.yearBuilt && property.yearBuilt <= filters.maxYearBuilt
      );
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
      results = results.filter(property => {
        if (!property.features) return false;
        return filters.features.every(feature => property.features.includes(feature));
      });
    }

    // Add favorite status to results
    results = results.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));

    return results;
  }

  // Get properties by listing type for homepage
  async getByListingType(listingType = 'Buy', limit = 6) {
    await delay(300);
    
    let properties = propertiesData.filter(property => property.listingType === listingType);
    
    // Limit results
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));
  }
}

export default new PropertyService();