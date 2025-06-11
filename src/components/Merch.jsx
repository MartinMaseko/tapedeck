import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Merch({ username }) {
  const [merch, setMerch] = useState([]);

  useEffect(() => {
    async function fetchMerch() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setMerch(snapshot.docs[0].data().merch || []);
      }
    }
    fetchMerch();
  }, [username]);

  return (
    <div className="merch-container">
      <h1>Merch</h1>
      <div className="merch-list">
        {merch.map((item, idx) => (
          <div key={idx}>
            <h4>{item.label}</h4>
            {item.image && <img src={item.image} alt={item.label} className="merch-image" />}
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Merch;