import "./tapestyle.css"
import profileimage from "./assets/profileimage.webp";

function UserProfile() {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#1da1f2"
            viewBox="0 0 24 24"
            style={{ marginLeft: 8, verticalAlign: "middle" }}
          >
            <circle cx="12" cy="12" r="10" fill="#1da1f2" />
            <path
              d="M10.5 14.5l-2.5-2.5 1.06-1.06L10.5 12.38l4.44-4.44 1.06 1.06z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;