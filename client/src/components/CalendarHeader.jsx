const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  const monthIdx = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-1 sm:gap-3">
        <button
          onClick={onPrevMonth}
          className="p-2 sm:p-1.5 hover:bg-gray-200 active:bg-gray-300 rounded-md text-gray-600"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 min-w-0 text-center">
          <span className="sm:hidden">{MONTH_NAMES_SHORT[monthIdx]} {year}</span>
          <span className="hidden sm:inline">{MONTH_NAMES[monthIdx]} {year}</span>
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 sm:p-1.5 hover:bg-gray-200 active:bg-gray-300 rounded-md text-gray-600"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <button
        onClick={onToday}
        className="px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-300 rounded-md border border-gray-300"
      >
        Today
      </button>
    </div>
  );
};

export default CalendarHeader;
