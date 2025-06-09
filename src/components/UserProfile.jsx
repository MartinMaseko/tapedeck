import "./tapestyle.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function UserProfile({ goToSlide, currentSlide, username }) {
  const [profile, setProfile] = useState({
    name: "",
    profileImageUrl: "",
    verified: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;
      const q = query(collection(db, "Artists"), where("username", "==", username));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setProfile({
          name: data.name || data.username || "",
          profileImageUrl: data.profileImageUrl || "",
          verified: data.verified || false,
        });
      }
    }
    fetchProfile();
  }, [username]);

  const icons = [
    {
      title: "Videos",
      img: "https://img.icons8.com/ios/30/006400/video--v1.png",
      alt: "videos"
    },
    {
      title: "Albums",
      img: "https://img.icons8.com/ios/30/006400/music-record.png",
      alt: "Album"
    },
    {
      title: "Merch",
      img: "https://img.icons8.com/material-outlined/30/006400/t-shirt.png",
      alt: "t-shirt"
    },
    {
      title: "Events",
      img: "https://img.icons8.com/ios/30/006400/starred-ticket.png",
      alt: "Event"
    }
  ];

  return (
    <div className="user-profile-container">
      <div className="profile-content">
        <img
          src={profile.profileImageUrl || require("./assets/Logo.png")}
          alt="Profile"
          className="profile-pic"
        />
        <div className="verified">
          <h3>{profile.name}</h3>
            <img 
              width="25" 
              height="25" 
              src="https://img.icons8.com/material-sharp/25/006400/verified-account.png" 
              alt="verified-account"
            />
        </div>
        {/* Navigation Icons */}
        <div className="profile-nav-icons">
          {icons.map((icon, idx) => (
            <button
              key={icon.title}
              title={icon.title}
              onClick={() => goToSlide(idx)}
              className="icons-btns"
            >
              <img
                width={currentSlide === idx ? 35 : 30}
                height={currentSlide === idx ? 35 : 30}
                src={icon.img}
                alt={icon.alt}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;