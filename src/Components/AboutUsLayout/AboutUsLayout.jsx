// Landing.jsx
import React from "react";
import "./aboutUsLayout.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="aboutUsLayout">
      <div className="aboutUsLayout_landing">
        <h1>من نحن؟</h1>
        <p>
        ماشي منصه إعلانات مبتكرة تربطك بكل ما تحتاجه في مكان واحد ، سواء إن كنت تريد بيع سيارتك ، تقوم بعرض عقارات ، شراء إلكترونيات ، أو حتي تبحث عن منتجات متنوعه ..
تجدها كلها بسهوله وسرعه وبأعلي درجات الأمان.
        </p>
        <button className="aboutUsLayout_btn"> <Link to="/">ابدأ الآن</Link></button>
      </div>
    </div>
  );
};
export default Landing;
