import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
import Cassette from "./assets/cassette.webp";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <img src={Cassette} alt="Cassette" style={{ width: 200, height: "auto" }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;