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
      [userId]: {
        [section]: prev[userId]?.[section] ? false : true
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
      <nav className="dashNav">
        <img src={Logo} alt="Logo" className="Dashlogo" />
        <img
          width="30"
          height="30"
          className="menu-icon"
          src="https://img.icons8.com/material-two-tone/30/006400/squared-menu.png"
          alt="squared-menu"
        />
      </nav>
      <h2>Admin Dashboard</h2>
      {users.length === 0 && <p>No user uploads found.</p>}
      <div className="dashboard-users">
        {users.map(user => (
          <div key={user.id} className="user-section">
            {/* Button Row */}
            <div className="dropdown-btn-row">
              <h4>User: {user.username}</h4>
              <button 
              className={`dropdown-btn${openSections[user.id]?.youtubeLinks ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "youtubeLinks")}>
                YouTube Links
              </button>
              <button 
              className={`dropdown-btn${openSections[user.id]?.youtubeChannel ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "youtubeChannel")}>
                YouTube Channel
              </button>
              <button 
              className={`dropdown-btn${openSections[user.id]?.streamingLinks ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "streamingLinks")}>
                Streaming Links
              </button>
              <button 
              className={`dropdown-btn${openSections[user.id]?.albums ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "albums")}>
                Albums
              </button>
              <button 
              className={`dropdown-btn${openSections[user.id]?.presskit ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "presskit")}>
                Presskit
              </button>
              <button 
              className={`dropdown-btn${openSections[user.id]?.paypalMe ? " open" : ""}`} 
              onClick={() => toggleSection(user.id, "paypalMe")}>
                PayPalMe
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
                      <li key={service}><b>{service}:</b> <a href={link} target="_blank" rel="noopener noreferrer">{link || "None"}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              {openSections[user.id]?.albums && (
                <div className="dropdown-content">
                  <h4>Albums</h4>
                  {(user.albums || []).length === 0 && <p>No albums uploaded.</p>}
                  {(user.albums || []).map((album, aIdx) => (
                    <div key={aIdx} style={{ marginBottom: "20px" }}>
                      {album.cover && <img src={album.cover} alt="Album Cover" className="album-cover-dash" />}
                      <ul>
                        {(album.songs || []).map((song, idx) => (
                          <li key={idx}>
                            Track {song.track}: {song.name} - <a href={song.url} target="_blank" rel="noopener noreferrer">Listen</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {openSections[user.id]?.presskit && user.presskit && (
                <div className="dropdown-content">
                  <h4>Presskit</h4>
                  <p><b>Name:</b> {user.presskit.name}</p>
                  <p><b>Bio:</b> {user.presskit.bio}</p>
                  <p><b>Email:</b> {user.presskit.email}</p>
                  <p><b>Contact:</b> {user.presskit.contact}</p>
                  <div>
                    <b>Gallery:</b>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {(user.presskit.gallery || []).map((img, idx) => (
                        <img key={idx} src={img} alt={`Gallery ${idx + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {openSections[user.id]?.paypalMe && (user.PaypalMe || user.paypalMe) && (
                <div className="dropdown-content">
                  <h4>PayPalMe</h4>
                  <a
                    href={`https://paypal.me/${user.PaypalMe || user.paypalMe}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.PaypalMe || user.paypalMe}
                  </a>
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

