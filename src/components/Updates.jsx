import "./tapestyle.css";
import NavBar from "./NavBar";
import { useState } from "react";
import banner from "./assets/tapedeckbanner.webp";

function Updates() {
  const [links, setLinks] = useState(["", "", ""]);
  const [mp3File, setMp3File] = useState(null);
  const [songs, setSongs] = useState([]);
  const [showMp3Input, setShowMp3Input] = useState(false);
  const [paypalHead, setPaypalHead] = useState("");
  const [paypalEffect, setPaypalEffect] = useState("");

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleAddSong = () => {
    if (mp3File) {
      setSongs([...songs, mp3File]);
      setMp3File(null);
      setShowMp3Input(false);
    }
  };

  return (
    <div>
      <NavBar />
      <img src={banner} alt="TapeDeck Banner" style={{ width: "100%", maxHeight: "350px" }} />
      <form className="form-container">
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
          {links.map((link, idx) => (
            <input
              className="form-inputs"
            key={idx}
            type="text"
            placeholder={`YouTube Video ${idx + 1}`}
            value={link}
            onChange={e => handleLinkChange(idx, e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
        ))}
           <input
            className="form-inputs"
            type="text"
            placeholder="YouTube Channel Link"
            value={links[3]}
            onChange={e => handleLinkChange(3, e.target.value)}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
        <button className="update-btns" type="submit">Update Links</button>
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
        />
        <p>Mp3</p>
        {!showMp3Input ? (
          <button
            className="update-btns"
            type="button"
            style={{ margin: "10px 0" }}
            onClick={() => setShowMp3Input(true)}
          >
            Add Song
          </button>
        ) : (
          <>
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              style={{ display: "block", margin: "10px 0" }}
              onChange={e => setMp3File(e.target.files[0])}
            />
            <div className="mp3-actions">
              <button
                className="update-btns"
                type="button"
                onClick={handleAddSong}
                style={{ margin: "10px 0" }}
                disabled={!mp3File}
              >
                Add
              </button>
              <button
                className="update-btns"
                type="button"
                onClick={() => {
                  setShowMp3Input(false);
                  setMp3File(null);
                }}
                style={{ margin: "10px 0" }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        <button className="update-btns" type="submit">Upload Release</button>
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
        <button className="update-btns" type="submit">Update Buy Links</button>
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
          <input
            className="form-inputs"
            type="text"
            placeholder="Product Label"
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <p>Product Image</p>
          <input
            className="form-inputs"
            type="file"
            accept="image/*"
            placeholder="Upload Product Image"
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <textarea
            className="form-inputs"
            placeholder="Product Description"
            rows={3}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
        </div>
        <button className="update-btns" type="submit">Upload Item</button>
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
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <p>Event Poster</p>
          <input
            className="form-inputs"
            type="file"
            accept="image/*"
            placeholder="Upload Event Poster"
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <textarea
            className="form-inputs"
            placeholder="Event Details"
            rows={3}
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
          <input
            className="form-inputs"
            type="text"
            placeholder="Event Buy Links"
            style={{ display: "block", margin: "10px 0", width: "100%" }}
          />
        </div>
        <button className="update-btns" type="submit">Upload Event</button>
      </form>
    </div>
  );
}

export default Updates;