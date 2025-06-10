import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Events({ username }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setEvents(snapshot.docs[0].data().events || []);
      }
    }
    fetchEvents();
  }, [username]);

  return (
    <div className="events-container">
      <h1>Events</h1>
      <ul>
        {events.map((event, idx) => (
          <li key={idx}>
            <b>{event.title}</b><br />
            {event.poster && <img src={event.poster} alt={event.title} className="event-poster" />}<br />
            {event.details}<br />
            <a href={event.buyLinks} target="_blank" rel="noopener noreferrer">{event.buyLinks}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;