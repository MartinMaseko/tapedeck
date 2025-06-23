import { useRef, useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import Videos from "./Videos";
import Albums from "./Albums";
import Presskit from "./Presskit.jsx";
import AudioFooter from "./AudioFooter.jsx";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function ArtistPage({ username }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ title: "", url: "" });
  const [artistData, setArtistData] = useState(null);

  const videosRef = useRef(null);
  const albumsRef = useRef(null);
  const presskitRef = useRef(null);

  useEffect(() => {
    async function fetchArtist() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setArtistData(snapshot.docs[0].data());
      } else {
        setArtistData(null);
      }
    }
    fetchArtist();
  }, [username]);

  const goToSection = (section) => {
    setShowDropdown(false);
    setTimeout(() => {
      if (section === "videos" && videosRef.current) videosRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "albums" && albumsRef.current) albumsRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "presskit" && presskitRef.current) presskitRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!artistData) {
    return (
      <div className="main-container" >
        <p>Loading..</p>
      </div>
    );
  }

  return (
    <div className="main-container" style={{ position: "relative" }}>
      <UserProfile
        username={artistData.username}
        onMenuClick={() => setShowDropdown((v) => !v)}
        showDropdown={showDropdown}
        onSectionClick={goToSection}
      />
      {(artistData.PaypalMe || artistData.paypalMe) && (
        <a
          className="donate-btn-container"
          href={`${artistData.PaypalMe || artistData.paypalMe}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="donate-icon" width="35" height="35" src="https://img.icons8.com/ios-filled/35/006400/wallet.png" alt="wallet"/>
          Proud to Pay {artistData.username}
        </a>
      )}
      <div ref={videosRef}><Videos username={artistData.username} /></div>
      <div ref={albumsRef}>
        <Albums username={artistData.username} onSongSelect={setNowPlaying} />
      </div>
      <div ref={presskitRef}>
        <Presskit username={artistData.username} />
      </div>
      <AudioFooter nowPlaying={nowPlaying} />
    </div>
  );
}

export default ArtistPage;