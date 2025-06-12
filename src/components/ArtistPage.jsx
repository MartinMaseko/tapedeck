import { useRef, useState } from "react";
import UserProfile from "./UserProfile";
import Videos from "./Videos";
import Albums from "./Albums";
import AudioFooter from "./AudioFooter.jsx";

function ArtistPage({ username }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ title: "", url: "" });

  const videosRef = useRef(null);
  const albumsRef = useRef(null);

  const goToSection = (section) => {
    setShowDropdown(false);
    setTimeout(() => {
      if (section === "videos" && videosRef.current) videosRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "albums" && albumsRef.current) albumsRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="main-container" style={{ position: "relative" }}>
      <UserProfile
        username={username}
        onMenuClick={() => setShowDropdown((v) => !v)}
        showDropdown={showDropdown}
        onSectionClick={goToSection}
      />
      <div ref={videosRef}><Videos username={username} /></div>
      <div ref={albumsRef}>
        <Albums username={username} onSongSelect={setNowPlaying} />
      </div>
      <AudioFooter nowPlaying={nowPlaying} />
    </div>
  );
}

export default ArtistPage;