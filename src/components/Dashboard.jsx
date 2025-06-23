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
            {/* Button Row */}
            <div className="dropdown-btn-row">
              <h3>User: {user.username}</h3>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "youtubeLinks")}>
                YouTube Links
              </button>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "youtubeChannel")}>
                YouTube Channel
              </button>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "streamingLinks")}>
                Streaming Links
              </button>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "album")}>
                Album
              </button>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "merch")}>
                Merchandise
              </button>
              <button className="dropdown-btn" onClick={() => toggleSection(user.id, "events")}>
                Events
              </button>
            </div>
            {/* Dropdown Content Grouped Below Buttons */}
            <div className="dropdown-content-group">
              {openSections[user.id]?.youtubeLinks && (
                <div className="dropdown-content">
                  <h4>YouTube Links</h4>
                  <ul>
                    {(user.youtubelinks || []).map((link, idx) => (
                      <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              {openSections[user.id]?.youtubeChannel && (
                <div className="dropdown-content">
                  <p>
                    <b>YouTube Channel:</b>{" "}
                    <a href={user.youtubeChannelLink} target="_blank" rel="noopener noreferrer">{user.youtubeChannelLink}</a>
                  </p>
                </div>
              )}
              {openSections[user.id]?.streamingLinks && (
                <div className="dropdown-content">
                  <h4>Streaming Links</h4>
                  <ul>
                    {user.streamingLinks && Object.entries(user.streamingLinks).map(([service, link]) => (
                      <li key={service}><b>{service}:</b> <a href={link} target="_blank" rel="noopener noreferrer">{link  || "None"}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              {openSections[user.id]?.album && user.album && (
                <div className="dropdown-content">
                  <h4>Album</h4>
                  {user.album.cover && <img src={user.album.cover} alt="Album Cover" className="album-cover-dash" />}
                  <ul>
                    {(user.album.songs || []).map((song, idx) => (
                      <li key={idx}>
                        Track {song.track}: {song.name} - <a href={song.url} target="_blank" rel="noopener noreferrer">Listen</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {openSections[user.id]?.merch && (
                <div className="dropdown-content">
                  <h4>Merchandise</h4>
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
                </div>
              )}
              {openSections[user.id]?.events && (
                <div className="dropdown-content">
                  <h4>Events</h4>
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
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

