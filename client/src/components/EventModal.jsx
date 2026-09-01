const STATUS_LABELS = {
  OA: 'OA',
  INTERVIEW_1: 'Interview 1',
  INTERVIEW_2: 'Interview 2',
  HR: 'HR',
  PLACED: 'Placed',
  REJECTED: 'Rejected',
};

const PLACE_LABELS = {
  RVITM: 'RVITM',
  RVECE: 'RVECE',
  HOME: 'Home',
};

const OFFER_TYPE_LABELS = {
  INTERN: 'Intern',
  INTERN_PBC: 'Intern + PBC',
  INTERN_FTE: 'Intern + FTE',
  FTE: 'FTE',
};

const STATUS_BADGE_COLORS = {
  OA: 'bg-gray-100 text-gray-700',
  INTERVIEW_1: 'bg-blue-100 text-blue-700',
  INTERVIEW_2: 'bg-blue-100 text-blue-700',
  HR: 'bg-purple-100 text-purple-700',
  PLACED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const PROGRESS_LABELS = {
  OA_CLEARED: 'OA Cleared',
  OA_REJECTED: 'OA Rejected',
  TI1: 'TI1',
  TI2: 'TI2',
  HR1: 'HR1',
  HR2: 'HR2',
  NOT_ELIGIBLE: 'Not Eligible',
  PLACED: 'Placed',
};

const PROGRESS_BADGE_COLORS = {
  OA_CLEARED: 'bg-green-100 text-green-700',
  OA_REJECTED: 'bg-red-100 text-red-700',
  TI1: 'bg-blue-100 text-blue-700',
  TI2: 'bg-blue-100 text-blue-700',
  HR1: 'bg-purple-100 text-purple-700',
  HR2: 'bg-purple-100 text-purple-700',
  NOT_ELIGIBLE: 'bg-gray-100 text-gray-700',
  PLACED: 'bg-green-100 text-green-700',
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const EventModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Mobile: bottom sheet. Desktop: centered card */}
      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-lg rounded-t-2xl border border-gray-200 shadow-xl
                      max-h-[85vh] overflow-y-auto safe-bottom
                      animate-slide-up sm:animate-none">
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 sm:pt-5 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{event.companyName}</h3>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-gray-400 hover:text-gray-600 active:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(event.companyVisitDate)}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
            <p className="mt-1">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE_COLORS[event.status]}`}>
                {STATUS_LABELS[event.status]}
              </span>
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Place</label>
            <p className="mt-1 text-sm text-gray-900">{PLACE_LABELS[event.place]}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Offer Type</label>
            <p className="mt-1 text-sm text-gray-900">{OFFER_TYPE_LABELS[event.offerType]}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Progress</label>
            <p className="mt-1">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${PROGRESS_BADGE_COLORS[event.progress] || 'bg-gray-100 text-gray-700'}`}>
                {PROGRESS_LABELS[event.progress] || event.progress}
              </span>
            </p>
          </div>

          {/* Buttons - stacked on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onEdit(event)}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(event)}
              className="py-3 sm:py-2 px-4 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
