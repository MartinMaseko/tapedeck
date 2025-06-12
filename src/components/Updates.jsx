import "./tapestyle.css";
import NavBar from "./NavBar";
import { db, auth } from "../firebase";
import { doc, setDoc, updateDoc, arrayUnion, query, where, getDocs, collection, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import banner from "./assets/tapedeckbanner.webp";
import pcbanner from "./assets/pcbanner.webp";

function Updates() {
  const [youtubelinks, setyoutubeLinks] = useState(["", "", ""]);
  const [youtubeChannelLink, setYoutubeChannelLink] = useState("");
  const [numSongs, setNumSongs] = useState(1);
  const [songFiles, setSongFiles] = useState([]); 
  const [albumCover, setAlbumCover] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameCreated, setUsernameCreated] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updating, setUpdating] = useState(false);
  const [ArtistName, setArtistName] = useState("");
  const [presskitBio, setPresskitBio] = useState("");
  const [presskitEmail, setPresskitEmail] = useState("");
  const [presskitContact, setPresskitContact] = useState("");
  const [presskitGallery, setPresskitGallery] = useState([]);

  const [streamingLinks, setStreamingLinks] = useState({
    spotify: "",
    apple: "",
    youtubeMusic: "",
    ShareLink: ""
  });

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "Artists", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.username) {
          setUsername(data.username);
          setUsernameCreated(true);
        }
      }
    }
  };

  // Username uniqueness check
  const checkUsernameUnique = async (username) => {
    const q = query(collection(db, "Artists"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  // Handle username creation
  const handleCreateUsername = async () => {
    setUsernameError("");
    setUsernameLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setUsernameError("You must be logged in.");
      setUsernameLoading(false);
      return;
    }
    if (!username) {
      setUsernameError("Username is required.");
      setUsernameLoading(false);
      return;
    }
    // Only check uniqueness if admin
    let isUnique = true;
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
      isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setUsernameError("Username already exists. Please choose another.");
        setUsernameLoading(false);
        return;
      }
    }
    try {
      await setDoc(doc(db, "Artists", user.uid), { username }, { merge: true });
      setUsernameCreated(true);
      setUsernameError("");
    } catch (err) {
      setUsernameError("Error saving username: " + err.message);
    }
    setUsernameLoading(false);
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...youtubelinks];
    newLinks[index] = value;
    setyoutubeLinks(newLinks);
  };

  const handleYoutubeChannelChange = (value) => {
    setYoutubeChannelLink(value);
  }

  const handleStreamingLinkChange = (service, value) => {
    setStreamingLinks(prev => ({
      ...prev,
      [service]: value
    }));
  };

  const handleUpdateStreaming = async (e) => {
    e.preventDefault();
    setUpdateMsg("Just a sec...");
    setUpdating(true);
    const user = auth.currentUser;
    if (!user) {
      setUpdateMsg("");
      setUpdating(false);
      alert("You must be logged in.");
      return;
    }
    try {
      await setDoc(doc(db, "Artists", user.uid), {
        username,
        streamingLinks
      }, { merge: true });
      setUpdateMsg("All done!");
      alert("Streaming links updated!");
    } catch (err) {
      alert("Error saving streaming links: " + err.message);
    }
    setUpdating(false);
    setTimeout(() => setUpdateMsg(""), 2000);
  };

  const handleUpdateVideos = async (e) => {
    e.preventDefault();
    setUpdateMsg("Updating videos...");
    setUpdating(true);
    const user = auth.currentUser;
    if (!user) {
      setUpdateMsg("");
      setUpdating(false);
      alert("You must be logged in.");
      return;
    }
    const safeLinks = youtubelinks.map(link => link || "");
    try {
      await setDoc(doc(db, "Artists", user.uid), {
        username,
        youtubelinks: safeLinks,
        youtubeChannelLink: youtubeChannelLink || ""
      }, { merge: true }); // merge: true keeps other fields
      setUpdateMsg("All done!");
      alert("YouTube links updated!");
    } catch (err) {
      alert("Error saving links: " + err.message);
    }
    setUpdateMsg("Videos updated!");
    setUpdating(false);
  };

  const handleUploadRelease = async (e) => {
    e.preventDefault();
    setUpdateMsg("Uploading release...");
    setUpdating(true);
    const user = auth.currentUser;
    if (!user) {
      setUpdateMsg("");
      setUpdating(false);
      alert("You must be logged in.");
      return;
    }

    // 1. Upload album cover to Railway (optional)
    let albumCoverUrl = "";
    if (albumCover) {
      albumCoverUrl = await uploadToRailway(albumCover, "cover", "images");
    }

    // 2. Upload each song to Railway and get URLs
    const uploadedSongs = await Promise.all(songFiles.map(async (file, idx) => {
      if (!file) return null;
      const url = await uploadToRailway(file, `track${idx + 1}`, "songs");
      return {
        track: idx + 1,
        name: file.name,
        url
      };
    }));

    // 3. Build the album object
    const albumObj = {
      cover: albumCoverUrl || "",
      songs: uploadedSongs.filter(Boolean)
    };

    // 4. Append the album object to the albums array in Firestore
    try {
      const albumRef = doc(db, "Artists", user.uid);
      await updateDoc(albumRef, {
        username,
        albums: arrayUnion(albumObj)
      });
      setUpdateMsg("Release uploaded successfully!");
      // Optionally reset form fields here
    } catch (err) {
      setUpdateMsg("Error saving release: " + err.message);
    }
    setUpdating(false);
    setTimeout(() => setUpdateMsg(""), 3000); // Clear message after 3s
  };
  
  const handleUploadPresskit = async (e) => {
    e.preventDefault();
    setUpdateMsg("Uploading presskit...");
    setUpdating(true);
    const user = auth.currentUser;
    if (!user) {
      setUpdateMsg("");
      setUpdating(false);
      alert("You must be logged in.");
      return;
    }

    // Convert FileList to array if needed
    let galleryFiles = presskitGallery;
    if (galleryFiles && typeof galleryFiles.length === "number" && !Array.isArray(galleryFiles)) {
      galleryFiles = Array.from(galleryFiles);
    }

    // Upload all gallery images to Railway
    let galleryUrls = [];
    if (galleryFiles && galleryFiles.length > 0) {
      galleryUrls = await Promise.all(
        galleryFiles.map(async (file) => {
          return await uploadToRailway(file, "presskit-gallery", "images");
        })
      );
    }

    try {
      const artistRef = doc(db, "Artists", user.uid);
      await setDoc(artistRef, {
        username,
        presskit: {
          name: ArtistName,
          bio: presskitBio,
          email: presskitEmail,
          contact: presskitContact,
          gallery: galleryUrls.filter(Boolean),
        }
      }, { merge: true }); // Use merge to avoid overwriting other fields
      setUpdateMsg("Presskit uploaded successfully!");
      setArtistName("");
      setPresskitBio("");
      setPresskitEmail("");
      setPresskitContact("");
      setPresskitGallery([]);
    } catch (err) {
      setUpdateMsg("Error saving presskit: " + err.message);
    }
    setUpdating(false);
    setTimeout(() => setUpdateMsg(""), 3000);
  };

  async function uploadToRailway(file, label, fieldName = "images") {
    const formData = new FormData();
    formData.append(fieldName, file);

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
      // Return the correct URL from the response
      if (fieldName === "images" && data.images && data.images.length > 0) {
        return data.images[0];
      }
      if (fieldName === "songs" && data.songs && data.songs.length > 0) {
        return data.songs[0];
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload ${label}: ${error.message}`);
      return null;
    }
  }

  return (
    <div>
      <NavBar />
      <img src={banner} alt="TapeDeck Banner" style={{ width: "100%", maxHeight: "350px" }}  className="mobilebanner"/>
      <div
          className="updates-bg"
          style={{
            background: `url(${pcbanner}) no-repeat center center fixed`,
          }}
        >
        </div>
      {updateMsg && (
        <div className="update-message">{updateMsg}</div>
      )}
      <input
          className="form-inputs"
          type="text"
          placeholder="Choose a unique username"
          value={username}
          onChange={e => setUsername(e.target.value.trim())}
          style={{ display: "inline-block", margin: "10px 10px 10px 0", width: "300px" }}
          disabled={usernameCreated}
        />
        <button
          className="update-btns"
          type="button"
          onClick={handleCreateUsername}
          disabled={usernameCreated || usernameLoading}
        >
          {usernameCreated ? "Username Created" : usernameLoading ? "Checking..." : "Create Username"}
        </button>
        {usernameError && <p style={{color: "red"}}>{usernameError}</p>}
        {usernameCreated && <p style={{color: "green"}}>@{username}</p>}
      <form 
        className="form-container"
        onSubmit={handleUpdateVideos}>
        <div className="section-titles">
          <div className="sectiontitle-container">
          <img 
            width="30" 
            height="30" 
            src="https://img.icons8.com/windows/30/006400/youtube-squared.png" 
            alt="youtube-squared"
            />
            <h3>YouTube Links</h3>
          </div>
          {youtubelinks.map((link, idx) => (
              <input
                className="form-inputs"
                key={idx}
                type="text"
                placeholder={`YouTube Video Link ${idx + 1}`}
                value={link || ""} 
                onChange={e => handleLinkChange(idx, e.target.value)}
                style={{ display: "block", margin: "10px 0", width: "100%" }}
              />
            ))}
           <input
            className="form-inputs"
            type="text"
            placeholder="YouTube Channel Link"
            value={youtubeChannelLink}
            onChange={e => handleYoutubeChannelChange(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <button className="update-btns" type="submit" disabled={updating}>Update Videos</button>
          <div className="section-titles">
            <div className="sectiontitle-container">
              <img 
                width="30" 
                height="30" 
                src="https://img.icons8.com/ios/30/006400/itunes.png" 
                alt="streaming"
              />
              <h3>Streaming Links</h3>
            </div>
            <input
              className="form-inputs"
              type="text"
              placeholder="Spotify Link"
              value={streamingLinks.spotify}
              onChange={e => handleStreamingLinkChange("spotify", e.target.value)}
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
              className="form-inputs"
              type="text"
              placeholder="Apple Music Link"
              value={streamingLinks.apple}
              onChange={e => handleStreamingLinkChange("apple", e.target.value)}
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
              className="form-inputs"
              type="text"
              placeholder="YouTube Music Link"
              value={streamingLinks.youtubeMusic}
              onChange={e => handleStreamingLinkChange("youtubeMusic", e.target.value)}
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
              className="form-inputs"
              type="text"
              placeholder="Share Link"
              value={streamingLinks.ShareLink}
              onChange={e => handleStreamingLinkChange("ShareLink", e.target.value)}
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
          </div>
        <button className="update-btns" disabled={updating} type="button" onClick={handleUpdateStreaming}>Update Streaming</button>
        </div>
        <div className="section-titles">
          <div className="sectiontitle-container">
            <img 
              width="30" 
              height="30" 
              src="https://img.icons8.com/ios/30/006400/music-record.png" 
              alt="music-record"
            />
            <h3>Album Updates</h3>
          </div>
        </div>
        <p>Album Cover</p>
        <input
          type="file"
          accept="image/*"
          style={{ display: "block", margin: "10px 0" }}
          onChange={e => setAlbumCover(e.target.files[0])}
        />
        <p>How many songs?</p>
          <input
            className="form-inputs"
            type="number"
            value={numSongs === "" ? "" : numSongs}
            onChange={e => {
              const val = e.target.value;
              // Allow empty input for editing
              if (val === "") {
                setNumSongs("");
                setSongFiles([]);
                return;
              }
              // Only update if valid number
              const num = Math.max(1, Math.min(25, Number(val)));
              setNumSongs(num);
              setSongFiles(files => {
                const newFiles = [...files];
                newFiles.length = num;
                return newFiles;
              });
            }}
            style={{ display: "block", margin: "10px 0", width: "100px" }}
          />
            {[...Array(numSongs)].map((_, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <label>Track {idx + 1}:</label>
                <input
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  onChange={e => {
                    const file = e.target.files[0];
                    setSongFiles(files => {
                      const newFiles = [...files];
                      newFiles[idx] = file;
                      return newFiles;
                    });
                  }}
                  style={{ display: "block", margin: "5px 0" }}
                />
                {songFiles[idx] && <span>{songFiles[idx].name}</span>}
              </div>
            ))}
        <button className="update-btns" type="submit" disabled={updating} onClick={handleUploadRelease}>Upload Release</button>
        <div className="section-titles">
          <div className="sectiontitle-container">
            <img 
              width="30" 
              height="30" 
              src="https://img.icons8.com/puffy/30/006400/news.png" 
              alt="presskit"
            />
            <h3>Presskit</h3>
          </div>
          <input
            className="form-inputs"
            type="text"
            placeholder="Artist Name"
            value={ArtistName}
            onChange={e => setArtistName(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <textarea
            className="form-Bio-inputs"
            placeholder="Short Bio"
            value={presskitBio}
            onChange={e => setPresskitBio(e.target.value)}
            rows={3}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <input
            className="form-inputs"
            type="email"
            placeholder="Email"
            value={presskitEmail}
            onChange={e => setPresskitEmail(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <input
            className="form-inputs"
            type="text"
            placeholder="Contact Number"
            value={presskitContact}
            onChange={e => setPresskitContact(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <p>Gallery Images</p>
          <input
            className="form-inputs"
            type="file"
            accept="image/*"
            multiple
            onChange={e => setPresskitGallery(e.target.files)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <button
            className="update-btns"
            disabled={updating}
            type="button"
            onClick={handleUploadPresskit}
          >
            Upload Presskit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Updates;