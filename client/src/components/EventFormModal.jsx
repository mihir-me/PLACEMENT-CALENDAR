import { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'OA', label: 'OA' },
  { value: 'INTERVIEW_1', label: 'Interview 1' },
  { value: 'INTERVIEW_2', label: 'Interview 2' },
  { value: 'HR', label: 'HR' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'REJECTED', label: 'Rejected' },
];

const PLACE_OPTIONS = [
  { value: 'RVITM', label: 'RVITM' },
  { value: 'RVECE', label: 'RVECE' },
  { value: 'HOME', label: 'Home' },
];

const OFFER_TYPE_OPTIONS = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'INTERN_PBC', label: 'Intern + PBC' },
  { value: 'INTERN_FTE', label: 'Intern + FTE' },
  { value: 'FTE', label: 'FTE' },
];

const PROGRESS_OPTIONS = [
  { value: 'OA_CLEARED', label: 'OA Cleared' },
  { value: 'OA_REJECTED', label: 'OA Rejected' },
  { value: 'TI1', label: 'TI1' },
  { value: 'TI2', label: 'TI2' },
  { value: 'HR1', label: 'HR1' },
  { value: 'HR2', label: 'HR2' },
  { value: 'NOT_ELIGIBLE', label: 'Not Eligible' },
  { value: 'PLACED', label: 'Placed' },
];

const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EventFormModal = ({ mode, event, initialDate, onClose, onCreate, onUpdate }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyVisitDate, setCompanyVisitDate] = useState('');
  const [status, setStatus] = useState('OA');
  const [place, setPlace] = useState('RVITM');
  const [offerType, setOfferType] = useState('INTERN_FTE');
  const [progress, setProgress] = useState('OA_CLEARED');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && event) {
      setCompanyName(event.companyName);
      setCompanyVisitDate(formatDateForInput(event.companyVisitDate));
      setStatus(event.status);
      setPlace(event.place);
      setOfferType(event.offerType);
      setProgress(event.progress || 'OA_CLEARED');
    } else if (initialDate) {
      setCompanyVisitDate(formatDateForInput(initialDate));
    }
  }, [mode, event, initialDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }
    if (!companyVisitDate) {
      setError('Please select a valid date');
      return;
    }

    const data = {
      companyName: companyName.trim(),
      companyVisitDate,
      status,
      place,
      offerType,
      progress,
    };

    setLoading(true);
    try {
      if (mode === 'edit' && event) {
        await onUpdate(event._id, data);
      } else {
        await onCreate(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-lg rounded-t-2xl border border-gray-200 shadow-xl
                      max-h-[90vh] overflow-y-auto safe-bottom
                      animate-slide-up sm:animate-none">
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 sm:pt-5 pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Event' : 'New Event'}
          </h3>
          <button onClick={onClose} className="p-2 -m-2 text-gray-400 hover:text-gray-600 active:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 sm:pb-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Microsoft"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Company Visit Date</label>
            <input
              type="date"
              value={companyVisitDate}
              onChange={(e) => setCompanyVisitDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Progress</label>
            <select
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className={inputClass}
            >
              {PROGRESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Place</label>
              <select
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className={inputClass}
              >
                {PLACE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Offer Type</label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className={inputClass}
              >
                {OFFER_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons - stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700 rounded-md disabled:opacity-50"
            >
              {loading ? (mode === 'edit' ? 'Saving...' : 'Creating...') : (mode === 'edit' ? 'Save Changes' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
