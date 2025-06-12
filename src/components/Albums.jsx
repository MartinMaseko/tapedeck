import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Albums({ username, onSongSelect }) {
  const [albums, setAlbums] = useState([]);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);

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
                    style={{ cursor: "pointer", color: currentSongUrl === song.url ? "#006400" : undefined }}
                    onClick={() => {
                      setCurrentSongUrl(song.url);
                      onSongSelect({
                        title: `Track ${song.track}: ${song.name}`,
                        url: song.url,
                        cover: album.cover
                      });
                    }}
                  >
                    {song.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;