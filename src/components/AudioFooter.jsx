import "./tapestyle.css";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function AudioFooter({ nowPlaying }) {
  const hasSong = !!nowPlaying?.url;
  const hasCover = !!nowPlaying?.cover;

  return (
    <div className="sticky-audio-player">
      <div className="now-playing-title">
        {hasCover && (
          <img
            src={nowPlaying.cover}
            alt="album cover"
            className="now-playing-cover"
          />
        )}
        <span>{hasSong ? nowPlaying.title : "Select a song to play"}</span>
      </div>
      <AudioPlayer
        controls
        controlsList="nodownload noplaybackrate"
        src={hasSong ? nowPlaying.url : undefined}
        autoPlay={hasSong}
        showJumpControls={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        disabled={!hasSong}
      />
    </div>
  );
}

export default AudioFooter;