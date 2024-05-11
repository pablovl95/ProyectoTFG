import React, { useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/ProductSlider.css"; // Importa tus estilos CSS aquí

function ProductSlider({ sliderList }) {
  let sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  };
  return (
    <div className="slider-container">
      <Slider ref={slider => (sliderRef = slider)} {...settings}>
        {sliderList.map(x => (
          <img src={x.imagen} alt={"SliderImage"} />
        ))}
      </Slider>
      <div className="slider-controls">
        <div className="slider-control-button-left" onClick={() => sliderRef.slickPrev()}>
          ◀
        </div>
        <div className="slider-control-button-right" onClick={() => sliderRef.slickNext()}>
            ▶
        </div>
      </div>
    </div>
  );
}

export default ProductSlider;
