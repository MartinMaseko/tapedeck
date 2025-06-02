import "./tapestyle.css";
import IN4U from "./assets/IN4U.webp";

function Albums() {
  return (
    <div>
      <h3>Albums</h3>
      <div className="albums">
        <div className="songs-list">
          <h4 className="catalogue-title">It's Not 4 U, It's for hustlers Vol.1</h4>
          <img src={IN4U} className="album-cover" alt="IN4U Album Cover" />
          <div id="paypal-container-HVXKEJ5DGGQVJ"></div><div id="paypal-container-HVXKEJ5DGGQVJ"></div>
        </div>
      </div>
    </div>
  );
}

export default Albums;