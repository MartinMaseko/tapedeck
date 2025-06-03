import "./tapestyle.css";
import
logo from "./assets/Logo.png";
function NavBar() {
  return (
    <nav className="navbar">
      <img 
      className="navlogo" 
      src={logo} 
      alt="Logo" 
      />
      <img 
        width="25" 
        height="25" 
        className="menu-icon" 
        src="https://img.icons8.com/material-two-tone/25/006400/squared-menu.png" 
        alt="squared-menu"
        />
    </nav>
  );
}

export default NavBar;