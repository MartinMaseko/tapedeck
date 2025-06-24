import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Presskit({ username }) {
  const [presskit, setPresskit] = useState(null);

  useEffect(() => {
    async function fetchPresskit() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setPresskit(data.presskit || null);
      } else {
        setPresskit(null);
      }
    }
    fetchPresskit();
  }, [username]);

  if (!presskit) {
    return (
      <div className="presskit-container">
        <h2>Press Kit</h2>
        <p>No press kit available for this artist.</p>
      </div>
    );
  }

  return (
    <div className="presskit-container">
      <h2>Press Kit</h2>
      <p><b>Name:</b> {presskit.name}</p>
      <p><b>Bio:</b> {presskit.bio}</p>
      <p><b>Email:</b> {presskit.email}</p>
      <p><b>Contact:</b> {presskit.contact}</p>
      <div>
        <b>Gallery:</b>
        <div className="presskit-gallery">
          {(presskit.gallery || []).map((img, idx) => (
            <img
              className="presskit-image"
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Presskit;