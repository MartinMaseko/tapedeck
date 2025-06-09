import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Videos({ username }) {
  const [links, setLinks] = useState([]);
  const [channel, setChannel] = useState("");

  useEffect(() => {
    async function fetchLinks() {
      if (!username) {
        console.log("No username provided");
        return;
      }
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setLinks(data.youtubelinks || []);
        setChannel(data.youtubeChannelLink || "");
      } else {
        console.log("No artist found for username:", username);
      }
    }
    fetchLinks();
  }, [username]);

  function sanitizeLink(link) {
    const match = link.match(/src=["']([^"']+)["']/);
    return match ? match[1] : link;
  }

  return (
    <div className="videos-container">
      <h3>Music Videos</h3>
      {links.map((link, idx) => {
        const sanitized = sanitizeLink(link);
        return (
          <iframe
            key={idx}
            className="video-iframe"
            width="300"
            height="200"
            src={sanitized}
            title={`YouTube video ${idx}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        );
      })}
      <img
        className="youtube-icon"
        src="https://img.icons8.com/fluency/35/youtube.png"
        alt="YouTube Icon"
        onClick={() => window.open(channel, "_blank")}
      />
    </div>
  );
}

export default Videos;