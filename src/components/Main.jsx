import Videos from "./Videos.jsx";
import Beats from "./Beats.jsx";
import Albums from "./Albums.jsx";
import Merch from "./Merch.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Main() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear"
  };

  return (
    <div className="slider-wrapper">
      <Slider {...settings}>
        <div className="slide"><Videos /></div>
        <div className="slide"><Albums /></div>
        <div className="slide"><Beats /></div>
        <div className="slide"><Merch /></div>
      </Slider>
    </div>
  );
}

export default Main;