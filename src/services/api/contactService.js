import contactData from '@/services/mockData/contacts.json';
import { toast } from 'react-toastify';

let contacts = [...contactData];
let nextId = Math.max(...contacts.map(c => c.Id), 0) + 1;

class ContactService {
  // Get all contact requests
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return contacts.map(contact => ({ ...contact }));
  }

  // Get contact by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error('Contact request not found');
    }
    return { ...contact };
  }

  // Create new contact request
  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newContact = {
      ...contactData,
      Id: nextId++,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contacts.unshift(newContact);
    toast.success('Contact request sent successfully!');
    return { ...newContact };
  }

  // Update contact request
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact request not found');
    }

    contacts[index] = {
      ...contacts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return { ...contacts[index] };
  }

  // Delete contact request
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Contact request not found');
    }

    contacts.splice(index, 1);
    return true;
  }

  // Get contacts by property
  async getByProperty(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return contacts
      .filter(contact => contact.propertyId === parseInt(propertyId))
      .map(contact => ({ ...contact }));
  }

  // Get contacts by agent
  async getByAgent(agentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return contacts
      .filter(contact => contact.agentId === parseInt(agentId))
      .map(contact => ({ ...contact }));
  }
}

const contactService = new ContactService();
export default contactService;