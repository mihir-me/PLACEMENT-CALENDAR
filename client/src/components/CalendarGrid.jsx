const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const STATUS_DOT_COLORS = {
  OA: 'bg-gray-400',
  INTERVIEW_1: 'bg-blue-400',
  INTERVIEW_2: 'bg-blue-500',
  HR: 'bg-purple-400',
  PLACED: 'bg-green-500',
  REJECTED: 'bg-red-400',
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const CalendarGrid = ({ currentDate, events, onEventClick, onDateClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    cells.push({ day, date, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ day, date, isCurrentMonth: true });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day);
    cells.push({ day, date, isCurrentMonth: false });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.companyVisitDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === date.getTime();
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAY_NAMES.map((day, i) => (
          <div
            key={day}
            className="py-2 sm:py-2.5 text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{DAY_NAMES_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, index) => {
          const dayEvents = getEventsForDate(cell.date);
          const isToday = cell.date.getTime() === today.getTime();

          return (
            <div
              key={index}
              onClick={() => onDateClick(cell.date)}
              className={`
                min-h-[52px] sm:min-h-[90px] md:min-h-[100px]
                p-0.5 sm:p-1.5
                border-b border-r border-gray-100
                cursor-pointer
                active:bg-gray-100
                transition-colors
                ${!cell.isCurrentMonth ? 'bg-gray-50/50' : ''}
              `}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span
                  className={`
                    text-[11px] sm:text-sm leading-none
                    ${isToday
                      ? 'bg-gray-900 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-medium'
                      : cell.isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                    }
                  `}
                >
                  {cell.day}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-px">
                {dayEvents.slice(0, 2).map((event) => (
                  <button
                    key={event._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`
                      w-full text-left
                      px-1 py-px sm:py-0.5
                      rounded
                      text-[8px] sm:text-[10px] md:text-xs
                      font-medium
                      truncate
                      active:opacity-70
                      ${STATUS_DOT_COLORS[event.status]} text-white
                    `}
                    title={event.companyName}
                  >
                    <span className="hidden sm:inline">{event.companyName}</span>
                    <span className="sm:hidden">{event.companyName.slice(0, 4)}</span>
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[8px] sm:text-[10px] text-gray-500 px-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
