import React, { useState, useRef } from "react";
import "./tapestyle.css";
import IN4U from "./assets/IN4U.webp";
import song1 from "./assets/Staxx Luciano Ft Thibe Da King [HQ MP3].mp3";
import song2 from "./assets/Staxx Luciano Ft Thibe Da King, B.O.Y Wonder - Six Tiger Master.mp3";
import song3 from "./assets/Staxx Luciano - Simon Says [Master].mp3";
import song4 from "./assets/Staxx Luciano Ft BlakLez - Roll A Dice Final Master.mp3";
import song5 from "./assets/Staxx Luciano Ft OneTake 267 - Pillow Talk [HQ MP3].mp3";

const IN4UAlbum = [
  { title: "Round Here Ft Thibe Da King", file: song1 },
  { title: "Six Tiger (ft. Thibe Da King, B.O.Y Wonder)", file: song2 },
  { title: "Simon Says", file: song3 },
  { title: "Roll A Dice (ft. BlakLez)", file: song4 },
  { title: "Pillow Talk (ft. OneTake 267)", file: song5 },
];

function Albums() {
  const [currentSong, setCurrentSong] = useState(IN4UAlbum[0]);
  const audioRef = useRef(null);

  const handleSongClick = (song) => {
    setCurrentSong(song);
    // Play the song immediately after selecting
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }, 0);
  };

  return (
    <div>
      <h3>Albums</h3>
      <div className="albums">
        <div className="songs-list">
          <h4 className="catalogue-title">It's Not 4 U, It's for hustlers Vol.1</h4>
          <img src={IN4U} className="album-cover" alt="IN4U Album Cover" />
          <div>
            {IN4UAlbum.map((song, idx) => (
              <div
                key={idx}
                className={`song-row${currentSong.title === song.title ? " active-song" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleSongClick(song)}
              >
                <span className="song-title">{song.title}</span>
              </div>
            ))}
          </div>
          <audio
            ref={audioRef}
            controls
            src={currentSong.file}
            className="audio-player"
            controlsList="nodownload"
          >
            Your browser does not support the audio element.
          </audio>
          <div id="paypal-container-HVXKEJ5DGGQVJ"></div><div id="paypal-container-HVXKEJ5DGGQVJ"></div>
        </div>
      </div>
    </div>
  );
}

export default Albums;