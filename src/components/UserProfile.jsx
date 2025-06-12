import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function UserProfile({ username, onMenuClick, showDropdown, onSectionClick }) {
  const [profile, setProfile] = useState({
    name: "",
    profileImageUrl: "",
    verified: false,
  });
  const [streamingLinks, setStreamingLinks] = useState({
    spotify: "",
    apple: "",
    youtubeMusic: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setProfile({
          name: data.name || data.username || "",
          profileImageUrl: data.profileImageUrl || "",
          verified: data.verified || false,
        });
        setStreamingLinks({
          spotify: data.streamingLinks?.spotify || "",
          apple: data.streamingLinks?.apple || "",
          youtubeMusic: data.streamingLinks?.youtubeMusic || "",
        });
      }
    }
    fetchProfile();
  }, [username]);

  return (
    <div className="artist-navigation" style={{ position: "relative" }}>
      <img
        src={profile.profileImageUrl || require("./assets/profileLogo.png")}
        alt="Profile"
        className="profile-pic"
      />
      <div className="artist-name">
        {username && (<h3>{username}</h3>)}
        <img 
          width="25" 
          height="25" 
          src="https://img.icons8.com/material-sharp/25/006400/verified-account.png" 
          alt="verified-account"
        />
      </div>
      <img
        width="35"
        height="35"
        className="menu-icon"
        src="https://img.icons8.com/material-two-tone/35/006400/squared-menu.png"
        alt="squared-menu"
        style={{ cursor: "pointer" }}
        onClick={onMenuClick}
      />
      {showDropdown && (
        <div className="artist-dropdown-panel">
          <ul className="artist-modal-list" style={{ margin: 0 }}>
            <li className="artist-modal-item" onClick={() => onSectionClick("videos")}>Videos</li>
            <li className="artist-modal-item" onClick={() => onSectionClick("albums")}>Albums</li>
          </ul>
          <div className="artist-dropdown-footer">
            <a href={streamingLinks.spotify} target="_blank" rel="noopener noreferrer">
              <img width="25" height="25" src="https://img.icons8.com/ios-filled/25/006400/spotify.png" alt="spotify"/>
            </a>
            <a href={streamingLinks.apple} target="_blank" rel="noopener noreferrer">
              <img width="25" height="25" src="https://img.icons8.com/ios-filled/25/006400/apple-music.png" alt="apple-music"/>
            </a>
            <a href={streamingLinks.youtubeMusic} target="_blank" rel="noopener noreferrer">
              <img width="25" height="25" src="https://img.icons8.com/ios-glyphs/25/006400/youtube-play.png" alt="youtube-play"/>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;