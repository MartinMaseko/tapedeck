import "./tapestyle.css";
import IN4U from "./assets/IN4U.webp";
import { useEffect } from "react";

function Albums() {
  useEffect(() => {
    if (window.paypal && window.paypal.HostedButtons) {
      window.paypal.HostedButtons({
        hostedButtonId: "HVXKEJ5DGGQVJ",
      }).render("#paypal-container-HVXKEJ5DGGQVJ");
    }
  }, []);

  return (
    <div>
      <h3>Albums</h3>
      <div className="albums">
        <div className="songs-list">
          <img src={IN4U} className="album-cover" alt="IN4U Album Cover" />
          <div id="paypal-container-HVXKEJ5DGGQVJ"></div>
        </div>
      </div>
    </div>
  );
}

export default Albums;