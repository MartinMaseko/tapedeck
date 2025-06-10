import UserProfile from "./UserProfile";
import Videos from "./Videos";
import Albums from "./Albums";
import Merch from "./Merch";
import Events from "./Events";
import { useState } from "react";

const slides = [
  { component: Videos, label: "Videos" },
  { component: Albums, label: "Albums" },
  { component: Merch, label: "Merch" },
  { component: Events, label: "Events" }
];

function ArtistPage({ username }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className="main-container">
      <UserProfile goToSlide={setCurrentSlide} currentSlide={currentSlide} username={username} />
      <div className="slide-fake">
        <CurrentComponent username={username} />
      </div>
    </div>
  );
}

export default ArtistPage;