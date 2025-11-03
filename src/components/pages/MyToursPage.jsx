import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import TourSchedulingModal from '@/components/molecules/TourSchedulingModal';
import tourService from '@/services/api/tourService';

const MyToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAll();
      setTours(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTour = async (tourId) => {
    if (!confirm('Are you sure you want to cancel this tour?')) return;

    try {
      await tourService.cancel(tourId);
      await loadTours();
    } catch (err) {
      toast.error('Failed to cancel tour');
    }
  };

  const handleRescheduleTour = (tour) => {
    setSelectedTour(tour);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (newTourData) => {
    if (!selectedTour) return;

    try {
      await tourService.update(selectedTour.Id, {
        date: newTourData.date,
        time: newTourData.time,
        tourType: newTourData.tourType,
        specialRequests: newTourData.specialRequests,
        status: 'Scheduled'
      });
      await loadTours();
      setShowRescheduleModal(false);
      setSelectedTour(null);
    } catch (err) {
      toast.error('Failed to reschedule tour');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-success text-white';
      case 'Completed': return 'bg-primary text-white';
      case 'Cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getTourTypeIcon = (tourType) => {
    return tourType === 'Virtual' ? 'Video' : 'MapPin';
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    };
  };

  const filteredTours = tours.filter(tour => {
    if (filter === 'upcoming') return tour.status === 'Scheduled';
    if (filter === 'completed') return tour.status === 'Completed';
    if (filter === 'cancelled') return tour.status === 'Cancelled';
    return true;
  });

  const getUpcomingCount = () => tours.filter(t => t.status === 'Scheduled').length;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTours} />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tours</h1>
          <p className="text-gray-600 mt-2">
            Manage your property tours and appointments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {getUpcomingCount()} upcoming
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="small"
          onClick={() => setFilter('all')}
        >
          All Tours ({tours.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          size="small"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({tours.filter(t => t.status === 'Scheduled').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'outline'}
          size="small"
          onClick={() => setFilter('completed')}
        >
          Completed ({tours.filter(t => t.status === 'Completed').length})
        </Button>
        <Button
          variant={filter === 'cancelled' ? 'primary' : 'outline'}
          size="small"
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({tours.filter(t => t.status === 'Cancelled').length})
        </Button>
      </div>

      {/* Tours List */}
      {filteredTours.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No tours found"
          description={filter === 'all' 
            ? "You haven't scheduled any tours yet. Browse properties and schedule your first tour!"
            : `No ${filter} tours found.`
          }
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/search'}
        />
      ) : (
        <div className="space-y-4">
          {filteredTours.map((tour, index) => {
            const dateTime = formatDateTime(tour.date, tour.time);
            const isUpcoming = tour.status === 'Scheduled' && new Date(`${tour.date}T${tour.time}`) > new Date();
            
            return (
              <motion.div
                key={tour.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getStatusColor(tour.status)}>
                          {tour.status}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <ApperIcon name={getTourTypeIcon(tour.tourType)} size={14} />
                          <span>{tour.tourType} Tour</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tour.propertyAddress}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ApperIcon name="Calendar" size={14} />
                          <span>{dateTime.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ApperIcon name="Clock" size={14} />
                          <span>{dateTime.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ApperIcon name="User" size={14} />
                          <span>{tour.agentName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <ApperIcon name="Phone" size={14} />
                          <span>{tour.agentPhone}</span>
                        </div>
                      </div>

                      {tour.specialRequests && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Special Requests: </span>
                            {tour.specialRequests}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Scheduled on {new Date(tour.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {tour.status === 'Scheduled' && isUpcoming && (
                        <>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleRescheduleTour(tour)}
                          >
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleCancelTour(tour.Id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <ApperIcon name="X" size={14} className="mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {tour.status === 'Completed' && (
                        <Button variant="outline" size="small" disabled>
                          <ApperIcon name="Check" size={14} className="mr-1" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      <TourSchedulingModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedTour(null);
        }}
        property={{
          Id: selectedTour?.propertyId,
          address: selectedTour?.propertyAddress?.split(',')[0] || '',
          city: selectedTour?.propertyAddress?.split(',')[1]?.trim() || '',
          state: selectedTour?.propertyAddress?.split(',')[2]?.trim()?.split(' ')[0] || '',
          zipCode: selectedTour?.propertyAddress?.split(' ').pop() || '',
          agent: {
            name: selectedTour?.agentName,
            email: selectedTour?.agentEmail,
            phone: selectedTour?.agentPhone
          }
        }}
        initialData={{
          name: selectedTour?.userName || '',
          email: selectedTour?.userEmail || '',
          phone: selectedTour?.userPhone || '',
          date: selectedTour?.date || '',
          time: selectedTour?.time || '',
          tourType: selectedTour?.tourType || 'In-Person',
          specialRequests: selectedTour?.specialRequests || ''
        }}
        onSubmit={handleRescheduleSubmit}
        isReschedule={true}
      />
    </div>
  );
};

export default MyToursPage;