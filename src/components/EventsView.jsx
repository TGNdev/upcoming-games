import { useState, useEffect } from 'react';
import { fetchMergedEvents } from '../js/events';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const EventsView = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [todayWeekStart, setTodayWeekStart] = useState(getStartOfWeek(new Date()));
  const [firstFutureWeekStart, setFirstFutureWeekStart] = useState(null);

  useEffect(() => {
    fetchMergedEvents()
      .then(events => {
        events.sort((a, b) => new Date(a.start) - new Date(b.start));
        setAllEvents(events);

        const today = new Date();
        const futureEvent = events.find(e => new Date(e.start) >= today);
        const initialDate = futureEvent ? new Date(futureEvent.start) : new Date(events[0].start);
        const initialWeekStart = getStartOfWeek(initialDate);
        setCurrentWeekStart(initialWeekStart);
        setFirstFutureWeekStart(initialWeekStart);
      })
      .catch(console.error);
  }, []);

  if (!currentWeekStart) return <div>Loading events...</div>;

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

  const eventsThisWeek = allEvents.filter(event => {
    const date = new Date(event.start);
    return date >= currentWeekStart && date <= currentWeekEnd;
  });

  const groupedByDay = eventsThisWeek.reduce((acc, event) => {
    const dateKey = new Date(event.start).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedByDay).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="w-full flex flex-col justify-between">
      <div className='flex justify-end'>
        {currentWeekStart.getTime() !== todayWeekStart.getTime() && (
            <button
              onClick={() => setCurrentWeekStart(todayWeekStart)}
              className="hidden sm:flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-300 transition"
            >
              Today
            </button>
          )}

          {firstFutureWeekStart && currentWeekStart.getTime() !== firstFutureWeekStart.getTime() && (
            <button
              onClick={() => setCurrentWeekStart(firstFutureWeekStart)}
              className="hidden sm:flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-300 transition"
            >
              Next Event
            </button>
          )}
      </div>
      <div className="flex flex-row justify-between sm:items-center mb-8 gap-2">
        <div className="flex flex-row gap-2">
          <button
            onClick={() => shiftWeek(-1)}
            className="size-6 p-1 sm:w-fit sm:py-2 sm:px-3 sm:flex flex-row items-center bg-blue-500 text-white rounded-md hover:scale-110 transition"
          >
            <FaArrowLeft className='block sm:hidden' />
            <div className='hidden sm:block'>Previous</div>
          </button>
        </div>

        <h1 className="text-xl font-bold text-center sm:text-left">
          {formatWeekRange(currentWeekStart)}
        </h1>

        <button
          onClick={() => shiftWeek(1)}
          className="size-6 p-1 sm:w-fit sm:py-2 sm:px-3 sm:flex flex-row items-center bg-blue-500 text-white rounded-md hover:scale-110 transition"
        >
          <FaArrowRight className='block sm:hidden' />
          <div className='hidden sm:block'>Next</div>
        </button>
      </div>
      {eventsThisWeek.length === 0 ? (
        <div className="text-gray-500 text-center mt-12">No events this week</div>
      ) : (
        sortedDays.map(date => (
          <div key={date} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{formatDate(date)}</h2>
            <ul className="space-y-2">
              {groupedByDay[date].map((event, i) => (
                <li
                  key={i}
                  className={`p-3 border rounded shadow-sm ${i % 2 === 1 ? 'bg-slate-100' : ''}`}
                >
                  <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-col'>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {formatTimeRange(event.start, event.end)}
                      </p>
                    </div>
                    {event.source === 'ical' && (
                      <>
                        <div className='bg-blue-100 text-blue-500 rounded-md h-fit text-sm px-2 py-1 italic hidden sm:block'>
                          Official SGF Calendar
                        </div>
                        <div className='bg-blue-100 text-blue-500 rounded-md h-fit text-xs px-2 py-1 italic block sm:hidden'>
                          SGF Cal.
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );

  function shiftWeek(offset) {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + offset * 7);
    setCurrentWeekStart(newStart);
  }
};

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeRange(start, end) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const opts = { hour: '2-digit', minute: '2-digit' };
  const startStr = startDate.toLocaleTimeString(undefined, opts);
  const endStr = endDate ? endDate.toLocaleTimeString(undefined, opts) : '';
  return endStr ? `${startStr} – ${endStr}` : startStr;
}

function formatWeekRange(startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const sameYear = start.getFullYear() === end.getFullYear();

  const options = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', {
    ...options,
    year: sameYear ? undefined : 'numeric',
  });

  const yearSuffix = sameYear ? start.getFullYear() : '';

  return `${startStr} – ${endStr}${yearSuffix ? `, ${yearSuffix}` : ''}`;
}

export default EventsView;
