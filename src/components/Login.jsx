import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebase";
import "./tapestyle.css"; 
import cassette from "./assets/cassette.webp";
import tapedeckLogo from "./assets/Logo.png";
import logo from "./assets/Logo.png"; 

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const handleMenuClick = () => setMenuOpen((open) => !open);
  const handleNavigate = (path) => {
        setMenuOpen(false);
        navigate(path);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/updates"); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/updates"); 
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
          }
        }
      if (menuOpen) {
          document.addEventListener("mousedown", handleClickOutside);
      } else {
          document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          };
    }, [menuOpen]);

  return (
    <div className="login-container">
      <nav className="navbar">
                      <img src={logo} alt="TapeDeck Logo" className="homelogo"  onClick={() => navigate("/")}/>
                      <div style={{ position: "relative" }}>
                          <img
                              width="25"
                              height="25"
                              className="menu-icon"
                              src="https://img.icons8.com/material-two-tone/25/006400/squared-menu.png"
                              alt="squared-menu"
                              onClick={handleMenuClick}
                              style={{ cursor: "pointer" }}
                          />
                          {menuOpen && (
                              <div className="menu-dropdown">
                                  <button onClick={() => handleNavigate("/login")}>Login</button>
                                  <button onClick={() => handleNavigate("/login")}>Get Started</button>
                              </div>
                          )}
                      </div>
                  </nav>
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