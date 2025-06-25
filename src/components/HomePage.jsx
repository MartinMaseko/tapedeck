import "./tapestyle.css";
import { useNavigate } from "react-router-dom";
import banner from "./assets/gifbanner.webp";
import logo from "./assets/whttapelogo.png"; 

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <nav className="navbar">
                <img src={logo} alt="TapeDeck Logo" className="homelogo" />
                <img
                    width="25"
                    height="25"
                    className="menu-icon"
                    src="https://img.icons8.com/material-two-tone/25/006400/squared-menu.png"
                    alt="squared-menu"
                    />
            </nav>
            <img src={banner} alt="TapeDeck Banner" className="homebanner" />
            <div className="home-content">
                <div className="content-section">
                    <h1>Decentralizing Getting Paid</h1>
                    <p>TapeDeck is a next-generation platform designed for musicians. <br></br>
                    <br></br>TapeDeck brings all your content together and most importantly, helps you get paid directly by your fans.</p>
                    <button
                        className="get-started-button"
                        onClick={() => navigate("/login")}
                    >
                        Get Started
                    </button>
                </div>
                <div className="content-section">
                    <h2>All Your Content In One Place</h2>
                    <div className="feature-icons">
                        <img width="50" height="50" src="https://img.icons8.com/bubbles/50/youtube-music.png" alt="youtube-music"/>
                        <img width="50" height="50" src="https://img.icons8.com/clouds/50/music.png" alt="music"/>
                        <img width="45" height="45" src="https://img.icons8.com/color/45/music-record--v1.png" alt="music-record--v1"/>
                        <img width="45" height="45" src="https://img.icons8.com/pulsar-gradient/45/online-payment-.png" alt="online-payment-"/>
                    </div>
                    <p>TapeDeck allows you to manage all your music, videos, and fan interactions from a single landing page.</p>
                </div>
                <div className="content-section">
                    <h2>Get Paid Directly</h2>
                    <p>Monetize your core fanbase with TapeDeck's integrated payment solutions.</p>
                    <p>With TapeDeck, you can receive payments directly from your fans without relying on third-party platforms.</p>
                    <img width="50" height="50" src="https://img.icons8.com/external-those-icons-flat-those-icons/50/external-PayPal-logos-and-brands-those-icons-flat-those-icons.png" alt="external-PayPal-logos-and-brands-those-icons-flat-those-icons"/>
                    <p>Powered by Paypal</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;