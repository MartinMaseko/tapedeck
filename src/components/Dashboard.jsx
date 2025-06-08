import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "Artists"));
        const usersData = [];
        querySnapshot.forEach(docSnap => {
          usersData.push({ id: docSnap.id, ...docSnap.data() });
        });
        setUsers(usersData);
      } catch (err) {
        alert("Error fetching users: " + err.message);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {users.length === 0 && <p>No user uploads found.</p>}
      {users.map(user => (
        <div key={user.id} className="user-section" style={{border: "1px solid #ccc", margin: "20px 0", padding: "20px"}}>
          <h2>User: {user.id}</h2>
          <h3>YouTube Links</h3>
          <ul>
            {(user.youtubelinks || []).map((link, idx) => (
              <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
            ))}
          </ul>
          <p><b>YouTube Channel:</b> <a href={user.youtubeChannelLink} target="_blank" rel="noopener noreferrer">{user.youtubeChannelLink}</a></p>
          
          <h3>Streaming Links</h3>
          <ul>
            {user.streamingLinks && Object.entries(user.streamingLinks).map(([service, link]) => (
              <li key={service}><b>{service}:</b> <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
            ))}
          </ul>

          <h3>Album</h3>
          {user.album && (
            <div>
              {user.album.cover && <img src={user.album.cover} alt="Album Cover" style={{maxWidth: 200}} />}
              <ul>
                {(user.album.songs || []).map((song, idx) => (
                  <li key={idx}>
                    Track {song.track}: {song.name} - <a href={song.url} target="_blank" rel="noopener noreferrer">Listen</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3>Merchandise</h3>
          <ul>
            {(user.merch || []).map((product, idx) => (
              <li key={idx}>
                <b>{product.label}</b><br />
                {product.image && <img src={product.image} alt={product.label} style={{maxWidth: 100}} />}<br />
                {product.description}<br />
                {product.merchPaypalButton && (
                  <details>
                    <summary>PayPal Button Script</summary>
                    <pre style={{whiteSpace: "pre-wrap"}}>{product.merchPaypalButton}</pre>
                  </details>
                )}
              </li>
            ))}
          </ul>

          <h3>Events</h3>
          <ul>
            {(user.events || []).map((event, idx) => (
              <li key={idx}>
                <b>{event.title}</b><br />
                {event.poster && <img src={event.poster} alt={event.title} style={{maxWidth: 100}} />}<br />
                {event.details}<br />
                <a href={event.buyLinks} target="_blank" rel="noopener noreferrer">{event.buyLinks}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;