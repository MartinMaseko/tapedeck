import UserProfile from "./UserProfile";
import Videos from "./Videos";
import Albums from "./Albums";
import Merch from "./Merch";
import Events from "./Events";
import { useRef, useState } from "react";
import Slider from "react-slick";

function ArtistPage({ username }) {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    arrows: false
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <div className="main-container">
      <UserProfile goToSlide={goToSlide} currentSlide={currentSlide} username={username} />
      <div className="slider-wrapper">
        <Slider ref={sliderRef} {...settings} initialSlide={currentSlide}>
          <div className="slide"><Videos username={username} /></div>
          <div className="slide"><Albums username={username} /></div>
          <div className="slide"><Merch username={username} /></div>
          <div className="slide"><Events username={username} /></div>
        </Slider>
      </div>
    </div>
  );
}

export default ArtistPage;