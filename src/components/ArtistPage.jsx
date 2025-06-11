import { useRef, useState } from "react";
import UserProfile from "./UserProfile";
import Videos from "./Videos";
import Albums from "./Albums";
import Merch from "./Merch";
import Events from "./Events";

function ArtistPage({ username }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const videosRef = useRef(null);
  const albumsRef = useRef(null);
  const merchRef = useRef(null);
  const eventsRef = useRef(null);

  const goToSection = (section) => {
    setShowDropdown(false);
    setTimeout(() => {
      if (section === "videos" && videosRef.current) videosRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "albums" && albumsRef.current) albumsRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "merch" && merchRef.current) merchRef.current.scrollIntoView({ behavior: "smooth" });
      if (section === "events" && eventsRef.current) eventsRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="main-container">
      <UserProfile
        username={username}
        onMenuClick={() => setShowDropdown((v) => !v)}
        showDropdown={showDropdown}
        onSectionClick={goToSection}
      />
      <div ref={videosRef}><Videos username={username} /></div>
      <div ref={albumsRef}><Albums username={username} /></div>
      <div ref={merchRef}><Merch username={username} /></div>
      <div ref={eventsRef}><Events username={username} /></div>
    </div>
  );
}

export default ArtistPage;