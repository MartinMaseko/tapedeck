import React, { useState, useRef, useEffect } from "react";
import "./tapestyle.css";
import { useNavigate } from "react-router-dom";
import banner from "./assets/banner.png";
import taperesponsive from "./assets/taperesponsive.png";
import template from "./assets/template.png";
import footerbanner from "./assets/footerbanner.png";
import logo from "./assets/whttapelogo.png"; 

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handleMenuClick = () => setMenuOpen((open) => !open);
    const handleNavigate = (path) => {
        setMenuOpen(false);
        navigate(path);
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
        <div className="home-container">
            <nav className="navbar" ref={menuRef}>
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
            <img src={banner} alt="TapeDeck Banner" className="homebanner" />
            <div className="home-content">
                <div className="content-sectionone">
                    <div>
                        <img src={taperesponsive} alt="TapeDeck Responsive" className="responsiveimg" />
                    </div>
                    <div className="content-text">
                        <h2>Album & Single One Page templates</h2>
                        <h3>Direct Fan Engagement Optimization & Monetization features</h3>
                        <p>
                            TapeDeck is a next-generation platform designed for musicians. TapeDeck brings all your content together and most importantly, helps you get paid directly by your fans.
                        </p>
                        <button
                            className="get-started-button"
                            onClick={() => navigate("/login")}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
                <div className="content-sectiontwo">
                    <img src={template} alt="TapeDeck Template" className="templateimg" />
                    <div>
                        <h2>All Your Content In One Place</h2>
                        <div className="feature-icons">
                            <img width="50" height="50" src="https://img.icons8.com/bubbles/50/youtube-music.png" alt="youtube-music"/>
                            <img width="50" height="50" src="https://img.icons8.com/clouds/50/music.png" alt="music"/>
                            <img width="45" height="45" src="https://img.icons8.com/color/45/music-record--v1.png" alt="music-record--v1"/>
                            <img width="45" height="45" src="https://img.icons8.com/pulsar-gradient/45/online-payment-.png" alt="online-payment-"/>
                        </div>
                        <p>
                            TapeDeck allows you to manage all your music, videos, and fan interactions from a single landing page.
                        </p>
                    </div>
                </div>
                <div className="content-section">
                    <h2>Get Paid Directly</h2>
                    <p>Monetize your core fanbase with TapeDeck's integrated payment solutions.</p>
                    <p>With TapeDeck, you can receive payments directly from your fans without relying on third-party platforms.</p>
                    <img width="50" height="50" src="https://img.icons8.com/external-those-icons-flat-those-icons/50/external-PayPal-logos-and-brands-those-icons-flat-those-icons.png" alt="external-PayPal-logos-and-brands-those-icons-flat-those-icons"/>
                    <p>Powered by Paypal</p>
                </div>
                <div className="content-section">
                    <h2>Simply Share your Links</h2>
                    <p>Share your music links and update fans effortlessly. Just copy your unique TapeDeck link and share it anywhere!</p>
                    <img src={footerbanner} alt="TapeDeck Footer Banner" className="footerbanner" />
                </div>
            </div>
        </div>
    );
}

export default HomePage;