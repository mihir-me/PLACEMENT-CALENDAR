import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import CalendarHeader from '../components/CalendarHeader';
import CalendarGrid from '../components/CalendarGrid';
import EventModal from '../components/EventModal';
import EventFormModal from '../components/EventFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const STATUS_LABELS = {
  OA: 'OA',
  INTERVIEW_1: 'Interview 1',
  INTERVIEW_2: 'Interview 2',
  HR: 'HR',
  PLACED: 'Placed',
  REJECTED: 'Rejected',
};

const STATUS_COLORS = {
  OA: 'bg-gray-100 text-gray-700',
  INTERVIEW_1: 'bg-blue-100 text-blue-700',
  INTERVIEW_2: 'bg-blue-100 text-blue-700',
  HR: 'bg-purple-100 text-purple-700',
  PLACED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const STATUS_DOT_COLORS = {
  OA: 'bg-gray-400',
  INTERVIEW_1: 'bg-blue-400',
  INTERVIEW_2: 'bg-blue-500',
  HR: 'bg-purple-400',
  PLACED: 'bg-green-500',
  REJECTED: 'bg-red-400',
};

const Calendar = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formDate, setFormDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await eventAPI.getEvents(month, year);
      setEvents(response.data.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDateClick = (date) => {
    setFormDate(date);
    setFormMode('create');
    setEditingEvent(null);
    setShowFormModal(true);
  };

  const handleAddEvent = () => {
    setFormDate(new Date());
    setFormMode('create');
    setEditingEvent(null);
    setShowFormModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormMode('edit');
    setShowFormModal(true);
    setShowEventModal(false);
  };

  const handleDeleteClick = (event) => {
    setDeletingEvent(event);
    setShowDeleteModal(true);
    setShowEventModal(false);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await eventAPI.createEvent(eventData);
      setEvents((prev) => [...prev, response.data.data].sort(
        (a, b) => new Date(a.companyVisitDate) - new Date(b.companyVisitDate)
      ));
      setShowFormModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    try {
      const response = await eventAPI.updateEvent(id, eventData);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? response.data.data : e))
      );
      setShowFormModal(false);
      setEditingEvent(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      await eventAPI.deleteEvent(deletingEvent._id);
      setEvents((prev) => prev.filter((e) => e._id !== deletingEvent._id));
      setShowDeleteModal(false);
      setDeletingEvent(null);
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            <span className="sm:inline">Placement Calendar</span>
            <span className="sm:hidden">Calendar</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleAddEvent}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-gray-800 active:bg-gray-700"
            >
              <span className="sm:inline">+ Add Event</span>
              <span className="sm:hidden">+ Add</span>
            </button>
            <div className="relative group">
              <button className="p-2 sm:p-0 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 active:text-gray-900">
                <span className="hidden sm:inline">{user?.name}</span>
                <span className="sm:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">{user?.email}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        {error && (
          <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
            <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
          </div>
        )}

        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading calendar...</div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            statusColors={STATUS_DOT_COLORS}
          />
        )}

        {/* Legend - visible on all sizes */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
          {[
            { color: 'bg-gray-400', label: 'OA' },
            { color: 'bg-blue-400', label: 'Interview' },
            { color: 'bg-purple-400', label: 'HR' },
            { color: 'bg-green-500', label: 'Placed' },
            { color: 'bg-red-400', label: 'Rejected' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] sm:text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      {showEventModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteClick}
          statusLabels={STATUS_LABELS}
        />
      )}

      {showFormModal && (
        <EventFormModal
          mode={formMode}
          event={editingEvent}
          initialDate={formDate}
          onClose={() => { setShowFormModal(false); setEditingEvent(null); }}
          onCreate={handleCreateEvent}
          onUpdate={handleUpdateEvent}
        />
      )}

      {showDeleteModal && deletingEvent && (
        <DeleteConfirmModal
          event={deletingEvent}
          onConfirm={handleDeleteEvent}
          onCancel={() => { setShowDeleteModal(false); setDeletingEvent(null); }}
        />
      )}
    </div>
  );
};

export default Calendar;
