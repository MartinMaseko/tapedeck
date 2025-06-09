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
    <div>
      <h1>Merch</h1>
      <ul>
        {merch.map((item, idx) => (
          <li key={idx}>
            <b>{item.label}</b><br />
            {item.image && <img src={item.image} alt={item.label} className="merch-image" />}<br />
            {item.description}<br />
            {item.merchPaypalButton && (
              <div dangerouslySetInnerHTML={{ __html: item.merchPaypalButton }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Merch;