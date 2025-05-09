import ICAL from 'ical.js';

export async function fetchICalEvents() {
  const webcalUrl = process.env.REACT_APP_EVENTS_CALENDAR;
  const httpsUrl = webcalUrl.replace(/^webcal:\/\//, 'https://');
  const res = await fetch(httpsUrl);
  const icalText = await res.text();

  const jcalData = ICAL.parse(icalText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  const now = new Date();

  const events = vevents.map(event => {
    const e = new ICAL.Event(event);
    const start = e.startDate.toJSDate();
    const end = e.endDate?.toJSDate();

    return {
      title: e.summary,
      start,
      end,
      allDay: e.startDate.isDate
    };
  });

  return events
    .sort((a, b) => a.start - b.start);
}
