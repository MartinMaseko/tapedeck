import "./tapestyle.css";
import NavBar from "./NavBar";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import banner from "./assets/tapedeckbanner.webp";

function Updates() {
  const [youtubelinks, setyoutubeLinks] = useState(["", "", ""]);
  const [youtubeChannelLink, setYoutubeChannelLink] = useState("");
  const [numSongs, setNumSongs] = useState(1);
  const [songFiles, setSongFiles] = useState([]); 
  const [albumCover, setAlbumCover] = useState(null);
  const [paypalHead, setPaypalHead] = useState("");
  const [paypalEffect, setPaypalEffect] = useState("");

  const [products, setProducts] = useState([
    { label: "", image: null, description: "" }
  ]);

  const [eventTitle, setEventTitle] = useState("");
  const [eventPoster, setEventPoster] = useState(null);
  const [eventDetails, setEventDetails] = useState("");
  const [eventBuyLinks, setEventBuyLinks] = useState("");

  const handleLinkChange = (index, value) => {
    const newLinks = [...youtubelinks];
    newLinks[index] = value;
    setyoutubeLinks(newLinks);
  };

  const handleYoutubeChannelChange = (value) => {
    setYoutubeChannelLink(value);
  }


  const handleUpdateVideos = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    const safeLinks = youtubelinks.map(link => link || "");
    try {
      await setDoc(doc(db, "Artists", user.uid), {
        youtubelinks: safeLinks,
        youtubeChannelLink: youtubeChannelLink || ""
      }, { merge: true }); // merge: true keeps other fields
      alert("YouTube links updated!");
    } catch (err) {
      alert("Error saving links: " + err.message);
    }
  };

  const handleUploadRelease = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
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

    // 3. Save to Firestore
    try {
      await setDoc(doc(db, "Artists", user.uid), {
        album: {
          cover: albumCoverUrl,
          songs: uploadedSongs.filter(Boolean),
          paypalHead: paypalHead || "",
          paypalEffect: paypalEffect || ""
        }
      }, { merge: true });
      alert("Release uploaded!");
    } catch (err) {
      alert("Error saving release: " + err.message);
    }
  };
  
  const handleUploadMerch = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    // Upload all images and build product objects
    const uploadedProducts = await Promise.all(products.map(async (product) => {
      let imageUrl = "";
      if (product.image) {
        imageUrl = await uploadToRailway(product.image, product.label, "images");
      }
      return {
        label: product.label,
        description: product.description,
        image: imageUrl
      };
    }));

    try {
      await setDoc(doc(db, "Artists", user.uid), {
        merch: uploadedProducts
      }, { merge: true });
      alert("Merchandise uploaded!");
      setProducts([{ label: "", image: null, description: "" }]);
    } catch (err) {
      alert("Error saving merch: " + err.message);
    }
  };

  const handleUploadEvent = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    let posterUrl = "";
    if (eventPoster) {
      posterUrl = await uploadToRailway(eventPoster, "eventPoster", "images");
    }
    try {
      await setDoc(doc(db, "Artists", user.uid), {
        event: {
          title: eventTitle,
          poster: posterUrl,
          details: eventDetails,
          buyLinks: eventBuyLinks
        }
      }, { merge: true });
      alert("Event uploaded!");
      setEventTitle("");
      setEventPoster(null);
      setEventDetails("");
      setEventBuyLinks("");
    } catch (err) {
      alert("Error saving event: " + err.message);
    }
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
      <img src={banner} alt="TapeDeck Banner" style={{ width: "100%", maxHeight: "350px" }} />
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
                placeholder={`YouTube Video ${idx + 1}`}
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
        <button className="update-btns" type="submit">Update Videos</button>
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
            min={1}
            max={20}
            value={numSongs}
            onChange={e => {
              const val = Math.max(1, Math.min(20, Number(e.target.value)));
              setNumSongs(val);
              setSongFiles(files => {
                const newFiles = [...files];
                newFiles.length = val;
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
                <div className="section-titles">
                  <div className="sectiontitle-container">
                    <img 
                      width="30" 
                      height="30" 
                      src="https://img.icons8.com/ios/30/006400/paypal.png" 
                      alt="paypal"
                    />
                    <h3>PayPal Buy Button Scripts</h3>
                  </div>
                  <p> PayPal Script for Head tag:</p>
                  <textarea
                    className="form-inputs"
                    value={paypalHead}
                    onChange={e => setPaypalHead(e.target.value)}
                    placeholder="Paste your &lt;script&gt; for head here"
                    style={{ display: "block", margin: "10px 0", width: "100%" }}
                    rows={3}
                  />
                <p> PayPal Script for body:</p>
                  <textarea
                    className="form-inputs"
                    value={paypalEffect}
                    onChange={e => setPaypalEffect(e.target.value)}
                    placeholder="Paste your PayPal button code for useEffect here"
                    style={{ display: "block", margin: "10px 0", width: "100%" }}
                    rows={3}
                  />
                </div>
              </div>
            ))}
        <button className="update-btns" type="submit" onClick={handleUploadRelease}>Upload Release</button>
        <div className="section-titles">
          <div className="sectiontitle-container">
            <img 
              width="30" 
              height="30" 
              src="https://img.icons8.com/material-outlined/30/006400/t-shirt.png" 
              alt="t-shirt"
            />
            <h3>Merchandise</h3>
          </div>
          {/* Merchandise Inputs */}
          {products.map((product, idx) => (
            <div key={idx}>
              <input
                className="form-inputs"
                type="text"
                placeholder="Product Label"
                value={product.label}
                onChange={e => {
                  const newProducts = [...products];
                  newProducts[idx].label = e.target.value;
                  setProducts(newProducts);
                }}
                style={{width: "100%" }}
              />
              <p>Product Image</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const newProducts = [...products];
                  newProducts[idx].image = e.target.files[0];
                  setProducts(newProducts);
                }}
                style={{ width: "100%", marginTop: "10px" }}
              />
              <textarea
                className="form-inputs"
                placeholder="Product Description"
                value={product.description}
                onChange={e => {
                  const newProducts = [...products];
                  newProducts[idx].description = e.target.value;
                  setProducts(newProducts);
                }}
                rows={3}
                style={{width: "100%", marginTop: "30px", height: "100px" }}
              />
            </div>
          ))}
          <button
            className="update-btns"
            type="button"
            onClick={() => setProducts([...products, { label: "", image: null, description: "" }])}
          >
            Add Another Product
          </button>
          <button className="update-btns" type="button" onClick={handleUploadMerch}>Upload Item</button>
        </div>
        <div className="section-titles">
          <div className="sectiontitle-container">
            <img 
              width="30" 
              height="30" 
              src="https://img.icons8.com/ios/30/006400/starred-ticket.png" 
              alt="Event"
            />
            <h3>Event Tickets</h3>
          </div>
          {/* Event Tickets Inputs */}
          <input
            className="form-inputs"
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <p>Event Poster </p>
          <input
            className="form-inputs"
            type="file"
            accept="image/*"
            onChange={e => setEventPoster(e.target.files[0])}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <textarea
            className="form-inputs"
            placeholder="Event Details"
            value={eventDetails}
            onChange={e => setEventDetails(e.target.value)}
            rows={3}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <input
            className="form-inputs"
            type="text"
            placeholder="Event Buy Links"
            value={eventBuyLinks}
            onChange={e => setEventBuyLinks(e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
        </div>
        <button className="update-btns" type="button" onClick={handleUploadEvent}>Upload Event</button>
      </form>
    </div>
  );
}

export default Updates;