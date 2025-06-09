import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Albums({ username }) {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    async function fetchAlbum() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setAlbum(snapshot.docs[0].data().album || null);
      }
    }
    fetchAlbum();
  }, [username]);

  useEffect(() => {
    if (album && album.paypalButtonId) {
      function renderButton() {
        if (window.paypal && window.paypal.HostedButtons) {
          window.paypal.HostedButtons({
            hostedButtonId: album.paypalButtonId,
          }).render(`#paypal-container-${album.paypalButtonId}`);
        } else {
          setTimeout(renderButton, 200);
        }
      }
      renderButton();
    }
  }, [album]);

  if (!album) return <div>No album found.</div>;

  return (
    <div>
      <h3>Albums</h3>
      <div className="albums">
        <div className="album-container">
          {album.cover && <img src={album.cover} className="album-cover" alt="Album Cover" />}
          <ul>
            {(album.songs || []).map((song, idx) => (
              <li key={idx}>
                Track {song.track}: {song.name}
                <audio controls src={song.url} style={{ marginLeft: 8 }} />
              </li>
            ))}
          </ul>
          {album.paypalButtonId && (
            <div id={`paypal-container-${album.paypalButtonId}`}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Albums;