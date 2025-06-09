import "./tapestyle.css";
import logo from "./assets/Logo.png";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function NavBar() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [bank, setBank] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, "Artists", u.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setSurname(data.surname || "");
          setBank(data.bank || "");
          setProfileImageUrl(data.profileImageUrl || "");
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setProfileImageUrl(URL.createObjectURL(file)); // For preview
    }
  };

  // Upload image to Railway and return the URL
  async function uploadToRailway(file) {
    const formData = new FormData();
    formData.append("images", file);
    try {
      const response = await fetch('https://tapedeck-production.up.railway.app/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      if (data.images && data.images.length > 0) {
        return data.images[0];
      }
      return "";
    } catch (error) {
      alert("Failed to upload profile image: " + error.message);
      return "";
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setUploading(true);

    let imageUrl = profileImageUrl;
    // If a new image is selected, upload it
    if (profileImage) {
      imageUrl = await uploadToRailway(profileImage);
    }

    await setDoc(doc(db, "Artists", user.uid), {
      name,
      surname,
      bank,
      profileImageUrl: imageUrl,
    }, { merge: true });

    setUploading(false);
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <img className="navlogo" src={logo} alt="Logo" />
        <img
          width="25"
          height="25"
          className="menu-icon"
          src="https://img.icons8.com/material-two-tone/25/006400/squared-menu.png"
          alt="squared-menu"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer" }}
        />
      </nav>
      {showModal && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            {user && (
              <span className="navbar-username">
                {name && surname ? `${name}` : user.email}
              </span>
            )}
            <h3>Edit Profile</h3>
            <form className="profile-form" onSubmit={handleSave}>
              {profileImageUrl && (
                  <img src={profileImageUrl} alt="Profile" className="profile-preview" />
                )}
              <input
              className="form-inputs"
                type="text"
                placeholder="Username"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className="form-inputs"
                type="text"
                placeholder="Name & Surname"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                required
              />
              <input
                className="form-inputs"
                type="text"
                placeholder="Bank Details"
                value={bank}
                onChange={e => setBank(e.target.value)}
                required
              />
              <input
                className="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
                <button type="submit" className="update-btns" disabled={uploading}>
                  {uploading ? "Saving..." : "Save"}
                </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;