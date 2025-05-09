import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import { fetchICalEvents } from '../js/events';

const EventsView = () => {
  const [events, setEvents] = useState([]);
  const [initialDate, setInitialDate] = useState(null);

  useEffect(() => {
    fetchICalEvents()
      .then(events => {
        setEvents(events);
        if (events.length > 0) {
          const today = new Date();
          const firstFutureEvent = events.find(e => new Date(e.start) >= today);
          const initial = firstFutureEvent ? firstFutureEvent.start : events[0].start;

          setInitialDate(new Date(initial).toISOString().split('T')[0]);
        }
      })
      .catch(console.error);
  }, []);

  if (!initialDate) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[listPlugin]}
        initialView="listWeek"
        events={events}
        initialDate={initialDate}
        height="auto"
      />
    </div>
  );
};


export default EventsView;