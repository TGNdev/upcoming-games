import ICAL from 'ical.js';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchICalEvents() {
  const webcalUrl = process.env.REACT_APP_EVENTS_CALENDAR;
  const httpsUrl = webcalUrl.replace(/^webcal:\/\//, 'https://');
  const res = await fetch(httpsUrl);
  const icalText = await res.text();

  const jcalData = ICAL.parse(icalText);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');
  const events = vevents.map(event => {
    const e = new ICAL.Event(event);
    const start = e.startDate.toJSDate();
    const end = e.endDate?.toJSDate();

    return {
      title: e.summary,
      start,
      end,
      allDay: e.startDate.isDate,
      source: 'ical'
    };
  });

  return events.sort((a, b) => a.start - b.start);
}

export async function fetchFirestoreEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      start: data.start.toDate ? data.start.toDate() : new Date(data.start),
      end: data.end?.toDate ? data.end.toDate() : (data.end ? new Date(data.end) : null),
      allDay: data.allDay || false,
      source: 'custom'
    };
  });
}

export async function fetchMergedEvents() {
  const [icalEvents, firestoreEvents] = await Promise.all([
    fetchICalEvents(),
    fetchFirestoreEvents()
  ]);

  return [...icalEvents, ...firestoreEvents].sort((a, b) => a.start - b.start);
}
