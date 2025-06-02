import "./tapestyle.css";

function Videos() {
  return (
    <div className="videos-container">
      <h3>Music Videos</h3>
      <iframe 
          className="video-iframe"
          src="https://www.youtube.com/embed/3uOC0b5M85I?si=6yFlJXFThFYvXzOz" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
      </iframe>
      <iframe 
          className="video-iframe" 
          src="https://www.youtube.com/embed/UjHyAhAUOYY?si=VkH_xOVbRQKo3kUI" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
      </iframe>
      <iframe 
          className="video-iframe"
          src="https://www.youtube.com/embed/ht3IOJ36Qxk?si=CYFIySS2Jw43GpA8" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
      </iframe>
      <img
          className="youtube-icon" 
          src="https://img.icons8.com/fluency/35/youtube.png"
          alt="YouTube Icon" 
          onClick={() => window.open("https://www.youtube.com/@staxxluciano", "_blank")}
      />
    </div>
  );
}

export default Videos;