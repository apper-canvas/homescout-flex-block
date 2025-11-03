import { toast } from 'react-toastify';

class TourService {
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

  // Get all tours for current user
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "property_address_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "user_phone_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "tour_type_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "agent_phone_c"}},
          {"field": {"Name": "agent_email_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.fetchRecords('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tours:", error?.response?.data?.message || error);
      toast.error("Failed to load tours");
      return [];
    }
  }

  // Get tour by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "property_address_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "user_phone_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "tour_type_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "agent_phone_c"}},
          {"field": {"Name": "agent_email_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById('tour_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error('Tour not found');
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching tour:", error?.response?.data?.message || error);
      throw new Error('Tour not found');
    }
  }

  // Create new tour
  async create(tourData) {
    try {
      const params = {
        records: [{
          Name: `Tour - ${tourData.name}`,
          property_id_c: parseInt(tourData.propertyId),
          property_address_c: tourData.propertyAddress || '',
          user_name_c: tourData.name,
          user_email_c: tourData.email,
          user_phone_c: tourData.phone || '',
          date_c: tourData.date,
          time_c: tourData.time,
          tour_type_c: tourData.tourType || 'In-Person',
          special_requests_c: tourData.specialRequests || '',
          status_c: 'Scheduled',
          agent_id_c: parseInt(tourData.agentId || 1),
          agent_name_c: tourData.agentName || 'Agent',
          agent_phone_c: tourData.agentPhone || '',
          agent_email_c: tourData.agentEmail || ''
        }]
      };

      const response = await this.apperClient.createRecord('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tour records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Tour scheduled successfully!');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating tour:", error?.response?.data?.message || error);
      toast.error("Failed to schedule tour");
      return null;
    }
  }

  // Update tour
  async update(id, data) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          date_c: data.date,
          time_c: data.time,
          tour_type_c: data.tourType,
          special_requests_c: data.specialRequests,
          status_c: data.status || 'Scheduled'
        }]
      };

      const response = await this.apperClient.updateRecord('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tour records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Tour updated successfully!');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating tour:", error?.response?.data?.message || error);
      toast.error("Failed to update tour");
      return null;
    }
  }

  // Cancel tour
  async cancel(id) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: 'Cancelled'
        }]
      };

      const response = await this.apperClient.updateRecord('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to cancel ${failed.length} tour records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Tour cancelled successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error cancelling tour:", error?.response?.data?.message || error);
      toast.error("Failed to cancel tour");
      return null;
    }
  }

  // Delete tour
  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tour records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Tour deleted successfully');
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting tour:", error?.response?.data?.message || error);
      toast.error("Failed to delete tour");
      return false;
    }
  }

  // Get upcoming tours
  async getUpcoming() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_address_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "agent_name_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": ["Scheduled"]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const now = new Date();
      return (response.data || []).filter(tour => {
        const tourDate = new Date(tour.date_c + 'T' + tour.time_c);
        return tourDate > now;
      });
    } catch (error) {
      console.error("Error fetching upcoming tours:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get tours by property
  async getByProperty(propertyId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "property_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(propertyId)]
        }]
      };

      const response = await this.apperClient.fetchRecords('tour_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tours by property:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const tourService = new TourService();
export default tourService;