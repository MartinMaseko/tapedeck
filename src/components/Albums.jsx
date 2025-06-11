import "./tapestyle.css";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Albums({ username }) {
  const [albums, setAlbums] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchAlbums() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setAlbums(snapshot.docs[0].data().albums || []);
      }
    }
    fetchAlbums();
  }, [username]);

  // Play the song when currentSong changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  return ( 
    <div className="albums-maincontainer">
      <h3>Albums</h3>
      <div className="albums">
        {albums.map((album, idx) => (
          <div className="album-container" key={idx}>
            {album.cover && <img src={album.cover} className="album-cover" alt={`Album Cover ${idx + 1}`} />}
            <div className="album-section">
              <ul>
                {(album.songs || []).map((song, sidx) => (
                  <li
                    key={sidx}
                    style={{ cursor: "pointer", color: currentSong === song.url ? "#006400" : undefined }}
                    onClick={() => setCurrentSong(song.url)}
                  >
                    {song.track}: {song.name}
                  </li>
                ))} 
              </ul>
            </div>
          </div>
        ))}
      </div>
      <audio
          ref={audioRef}
          controls
          controlsList="nodownload noplaybackrate"
          src={currentSong || ""}
          style={{ width: "100%"}}
          >
          Your browser does not support the audio element.
        </audio>
    </div>
  );
}

export default Albums;