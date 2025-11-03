import tourData from '@/services/mockData/tours.json';
import { toast } from 'react-toastify';

let tours = [...tourData];
let nextId = Math.max(...tours.map(t => t.Id), 0) + 1;

class TourService {
  // Get all tours for current user
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return tours.map(tour => ({ ...tour }));
  }

  // Get tour by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tour = tours.find(t => t.Id === parseInt(id));
    if (!tour) {
      throw new Error('Tour not found');
    }
    return { ...tour };
  }

  // Create new tour
  async create(tourData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTour = {
      ...tourData,
      Id: nextId++,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tours.unshift(newTour);
    toast.success('Tour scheduled successfully!');
    return { ...newTour };
  }

  // Update tour
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tours.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Tour not found');
    }

    tours[index] = {
      ...tours[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    toast.success('Tour updated successfully!');
    return { ...tours[index] };
  }

  // Cancel tour
  async cancel(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tours.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Tour not found');
    }

    tours[index] = {
      ...tours[index],
      status: 'Cancelled',
      updatedAt: new Date().toISOString()
    };

    toast.success('Tour cancelled successfully');
    return { ...tours[index] };
  }

  // Delete tour
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = tours.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Tour not found');
    }

    tours.splice(index, 1);
    toast.success('Tour deleted successfully');
    return true;
  }

  // Get upcoming tours
  async getUpcoming() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date();
    
    return tours
      .filter(tour => {
        const tourDate = new Date(tour.date + 'T' + tour.time);
        return tourDate > now && tour.status === 'Scheduled';
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateA - dateB;
      })
      .map(tour => ({ ...tour }));
  }

  // Get tours by property
  async getByProperty(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tours
      .filter(tour => tour.propertyId === parseInt(propertyId))
      .map(tour => ({ ...tour }));
  }
}

const tourService = new TourService();
export default tourService;