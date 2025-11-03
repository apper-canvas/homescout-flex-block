import { toast } from 'react-toastify';

class ContactService {
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

  // Get all contact requests
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
          {"field": {"Name": "preferred_contact_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "message_template_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "agent_phone_c"}},
          {"field": {"Name": "agent_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      toast.error("Failed to load contact requests");
      return [];
    }
  }

  // Get contact by ID
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
          {"field": {"Name": "preferred_contact_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "message_template_c"}},
          {"field": {"Name": "agent_id_c"}},
          {"field": {"Name": "agent_name_c"}},
          {"field": {"Name": "agent_phone_c"}},
          {"field": {"Name": "agent_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById('contact_c', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error('Contact request not found');
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error?.response?.data?.message || error);
      throw new Error('Contact request not found');
    }
  }

  // Create new contact request
  async create(contactData) {
    try {
      const params = {
        records: [{
          Name: `Contact - ${contactData.name}`,
          property_id_c: parseInt(contactData.propertyId),
          property_address_c: contactData.propertyAddress || '',
          user_name_c: contactData.name,
          user_email_c: contactData.email,
          user_phone_c: contactData.phone || '',
          preferred_contact_c: contactData.preferredContact || 'Email',
          message_c: contactData.message || '',
          message_template_c: contactData.messageTemplate || '',
          agent_id_c: parseInt(contactData.agentId || 1),
          agent_name_c: contactData.agentName || 'Agent',
          agent_phone_c: contactData.agentPhone || '',
          agent_email_c: contactData.agentEmail || '',
          status_c: 'Pending'
        }]
      };

      const response = await this.apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contact records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Contact request sent successfully!');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      toast.error("Failed to send contact request");
      return null;
    }
  }

  // Update contact request
  async update(id, data) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...data
        }]
      };

      const response = await this.apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contact records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      toast.error("Failed to update contact request");
      return null;
    }
  }

  // Delete contact request
  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contact records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length === 1;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      toast.error("Failed to delete contact request");
      return false;
    }
  }

  // Get contacts by property
  async getByProperty(propertyId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "property_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(propertyId)]
        }]
      };

      const response = await this.apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts by property:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get contacts by agent
  async getByAgent(agentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "user_email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "agent_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(agentId)]
        }]
      };

      const response = await this.apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts by agent:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const contactService = new ContactService();
export default contactService;