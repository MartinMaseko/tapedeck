import "./tapestyle.css"

function Videos() {
  return (
    <div className="videos-container">
      <h1>Staxx Luciano</h1>
      <h2>Music Videos</h2>
      <iframe 
          className="video-iframe"
          src="https://www.youtube.com/embed/3uOC0b5M85I?si=6yFlJXFThFYvXzOz" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
      </iframe>
      <iframe 
          className="video-iframe" 
          src="https://www.youtube.com/embed/UjHyAhAUOYY?si=VkH_xOVbRQKo3kUI" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
      </iframe>
      <iframe 
          className="video-iframe"
          src="https://www.youtube.com/embed/ht3IOJ36Qxk?si=CYFIySS2Jw43GpA8" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
      </iframe>
    </div>
  );
}

export default Videos;