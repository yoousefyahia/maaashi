import React, { useState } from "react";
import "./slider.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: "/images/filter1.webp",
    title: "اكتشف ألاف الإعلانات يومياً بسهولة",
    desc: "اعرض منتجاتك أو ابحث عن أفضل العروض بالقرب منك.. بكل سرعة وأمان",
    btn: "تصفح الإعلانات",
    link: "category/:cars",
  },
  {
    id: 2,
    image: "/images/filter2.webp",
    title: "أفضل العروض في مكانك",
    desc: "ابحث عن المنتجات أو الخدمات الأقرب إليك بسرعة فائقة",
    btn: "ابدأ الآن",
    link: "category/:realEstate",
  },
  {
    id: 3,
    image: "/images/filter3.webp",
    title: "بيع واشتري بثقة",
    desc: "منصتنا تضمن لك تجربة سهلة وآمنة لإتمام صفقاتك",
    btn: "انشر إعلانك",
    link: "category/:electronics",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="slider_container">
      <div className="slider-slide">
        <img src={slides[current].image} alt={slides[current].title} />
        <div className="slider-content">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].desc}</p>
          <button onClick={() => navigate(slides[current].link)}>
            {slides[current].btn}
          </button>
        </div>
        <button className="arrow left" onClick={prevSlide}>
          <IoIosArrowBack />
        </button>
        <button className="arrow right" onClick={nextSlide}>
          <IoIosArrowForward />
        </button>
      </div>

      <div className="dots">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
export default Slider;
