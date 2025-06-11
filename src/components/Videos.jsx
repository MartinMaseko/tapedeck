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

  function toEmbedLink(url) {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; 
  }

  return (
    <div className="videos-container">
      <div className="videos-header">
        <img
          className="youtube-icon"
          src="https://img.icons8.com/color/35/youtube-squared.png"
          alt="YouTube Icon"
          onClick={() => window.open(channel, "_blank")}
        />
        <h3>Music Videos</h3>
      </div>
      <div className="iframe-container">
        {links.map((link, idx) => {
          return (
            <iframe
              key={idx}
              className="video-iframe"
              src={toEmbedLink(link)}
              title={`YouTube video ${idx}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          );
        })}
      </div>
    </div>
  );
}

export default Videos;