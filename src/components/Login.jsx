import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebase";
import "./tapestyle.css"; 
import cassette from "./assets/cassette.webp";
import tapedeckLogo from "./assets/Logo.png";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      navigate("/updates"); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      navigate("/updates"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
    <img src={cassette} alt="Cassette" className="cassette" />
    <img src={tapedeckLogo} alt="Tape Deck Logo" className="logo" />
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <button className="google-sign" onClick={handleGoogleLogin}>
        <img width="30" height="30" src="https://img.icons8.com/color/30/google-logo.png" alt="google-logo"/>
        Sign in with Google</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}