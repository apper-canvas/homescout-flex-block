import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import contactService from '@/services/api/contactService';

const ContactAgentModal = ({ isOpen, onClose, agent, propertyId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'Email',
    message: '',
    messageTemplate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageTemplates = [
    { value: '', label: 'Write custom message' },
    { value: 'Schedule Tour', label: 'I\'d like to schedule a tour' },
    { value: 'Price Negotiability', label: 'What\'s the price negotiability?' },
    { value: 'More Information', label: 'I need more information' },
    { value: 'Serious Buyer', label: 'I\'m a serious buyer ready to make an offer' }
  ];

  const templateMessages = {
    'Schedule Tour': 'I\'d like to schedule a tour of this property. When would be the best time?',
    'Price Negotiability': 'What\'s the price negotiability on this property? I\'m a serious buyer.',
    'More Information': 'I\'m interested in this property and would like more information about the neighborhood and amenities.',
    'Serious Buyer': 'I\'m a serious buyer and ready to make an offer on this property. Please contact me at your earliest convenience.'
  };

  const handleTemplateChange = (template) => {
    setFormData(prev => ({
      ...prev,
      messageTemplate: template,
      message: templateMessages[template] || ''
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.create({
        ...formData,
        propertyId: parseInt(propertyId),
        agentId: agent?.id || 1,
        agentName: agent?.name || 'Agent',
        agentEmail: agent?.email || 'agent@realty.com',
        agentPhone: agent?.phone || '(555) 000-0000'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredContact: 'Email',
        message: '',
        messageTemplate: ''
      });
      onClose();
    } catch (error) {
      console.error('Error sending contact request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Contact Agent</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Agent Info */}
          {agent && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.company}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ApperIcon name="Star" size={14} className="text-yellow-400 fill-current" />
                    <span>{agent.rating} ({agent.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <Select
                  value={formData.preferredContact}
                  onValueChange={(value) => handleInputChange('preferredContact', value)}
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Text">Text Message</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Message Templates
                </label>
                <Select
                  value={formData.messageTemplate}
                  onValueChange={handleTemplateChange}
                >
                  {messageTemplates.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell the agent about your interest..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactAgentModal;