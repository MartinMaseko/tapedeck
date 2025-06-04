import Videos from "./Videos.jsx";
import Albums from "./Albums.jsx";
import Merch from "./Merch.jsx";
import Events from "./Events.jsx";
import Slider from "react-slick";
import UserProfile from "./UserProfile.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useState } from "react";

function Main() {
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
  };

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <>
      <div className="main-container">
        <UserProfile goToSlide={goToSlide} />
        <div className="slider-wrapper">
          <Slider ref={sliderRef} {...settings} initialSlide={currentSlide}>
            <div className="slide"><Videos /></div>
            <div className="slide"><Albums /></div>
            <div className="slide"><Merch /></div>
            <div className="slide"><Events /></div>
          </Slider>
        </div>
      </div>
    </>
  );
}

export default Main;