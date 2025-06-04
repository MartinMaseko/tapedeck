import "./tapestyle.css"
import profileimage from "./assets/profileimage.webp";

function UserProfile({ goToSlide }) {
  return (
    <div className="user-profile-container">
      <div className="profile-content">
        <img
          src={profileimage}
          alt="Profile"
          className="profile-pic"
        />
        <div className="verified">
          <h3>Staxx Luciano</h3>
          <img 
            width="25" 
            height="25" 
            src="https://img.icons8.com/material-sharp/25/006400/verified-account.png" 
            alt="verified-account"
          />
        </div>
        {/* Navigation Icons */}
        <div className="profile-nav-icons">
          <button title="Videos" onClick={() => goToSlide(0)} className="icons-btns">
            <img width="30" height="30" src="https://img.icons8.com/ios/30/006400/video--v1.png" alt="videos"/>
          </button>
          <button title="Albums" onClick={() => goToSlide(1)} className="icons-btns">
            <img width="30" height="30" src="https://img.icons8.com/ios/30/006400/music-record.png" alt="Album"/>
          </button>
          <button title="Merch" onClick={() => goToSlide(2)} className="icons-btns">
            <img width="30" height="30" src="https://img.icons8.com/material-outlined/30/006400/t-shirt.png" alt="t-shirt"/>
          </button>
          <button title="Events" onClick={() => goToSlide(3)} className="icons-btns">
            <img width="30" height="30" src="https://img.icons8.com/ios/30/006400/starred-ticket.png" alt="Event"/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;