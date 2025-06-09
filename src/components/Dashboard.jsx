import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Cassette from "./assets/cassette.webp";
import Logo from "./assets/Logo.png";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    // Always show splash for at least 3 seconds
    const splashTimeout = setTimeout(() => setShowSplash(false), 3000);

    async function fetchUsers() {
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

    return () => clearTimeout(splashTimeout);
  }, []);

  const toggleSection = (userId, section) => {
    setOpenSections(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [section]: !prev[userId]?.[section]
      }
    }));
  };

  if (loading || showSplash) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <img src={Cassette} alt="Cassette" style={{ width: 200, height: "auto" }} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashNav">
        <img src={Logo} alt="Logo" className="Dashlogo" />
        <img 
        width="30" 
        height="30" 
        className="menu-icon" 
        src="https://img.icons8.com/material-two-tone/30/006400/squared-menu.png" 
        alt="squared-menu"
        />
      </div>
      <h2>Admin Dashboard</h2>
      {users.length === 0 && <p>No user uploads found.</p>}
      <div className="dashboard-users">
        {users.map(user => (
          <div key={user.id} className="user-section">
            <h3>User: {user.username}</h3>
            {/* YouTube Links */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "youtubeLinks")}>
                YouTube Links
              </button>
              {openSections[user.id]?.youtubeLinks && (
                <ul>
                  {(user.youtubelinks || []).map((link, idx) => (
                    <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                  ))}
                </ul>
              )}
            </div>
            {/* YouTube Channel */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "youtubeChannel")}>
                YouTube Channel
              </button>
              {openSections[user.id]?.youtubeChannel && (
                <p>
                  <b>YouTube Channel:</b>{" "}
                  <a href={user.youtubeChannelLink} target="_blank" rel="noopener noreferrer">{user.youtubeChannelLink}</a>
                </p>
              )}
            </div>
            {/* Streaming Links */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "streamingLinks")}>
                Streaming Links
              </button>
              {openSections[user.id]?.streamingLinks && (
                <ul>
                  {user.streamingLinks && Object.entries(user.streamingLinks).map(([service, link]) => (
                    <li key={service}><b>{service}:</b> <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                  ))}
                </ul>
              )}
            </div>
            {/* Album */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "album")}>
                Album
              </button>
              {openSections[user.id]?.album && user.album && (
                <div>
                  {user.album.cover && <img src={user.album.cover} alt="Album Cover" className="album-cover" />}
                  <ul>
                    {(user.album.songs || []).map((song, idx) => (
                      <li key={idx}>
                        Track {song.track}: {song.name} - <a href={song.url} target="_blank" rel="noopener noreferrer">Listen</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Merchandise */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "merch")}>
                Merchandise
              </button>
              {openSections[user.id]?.merch && (
                <ul>
                  {(user.merch || []).map((product, idx) => (
                    <li key={idx}>
                      <b>{product.label}</b><br />
                      {product.image && <img src={product.image} alt={product.label} className="merch-image" />}<br />
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
              )}
            </div>
            {/* Events */}
            <div>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "events")}>
                Events
              </button>
              {openSections[user.id]?.events && (
                <ul>
                  {(user.events || []).map((event, idx) => (
                    <li key={idx}>
                      <b>{event.title}</b><br />
                      {event.poster && <img src={event.poster} alt={event.title} className="event-poster" />}<br />
                      {event.details}<br />
                      <a href={event.buyLinks} target="_blank" rel="noopener noreferrer">{event.buyLinks}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;