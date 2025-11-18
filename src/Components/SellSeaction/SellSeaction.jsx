import React from "react";
import "./sellSeaction.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; 
import { parseAuthCookie } from "../../utils/auth";

const SellSeaction = () => {

  // للنقل الي الاعلانات
  const navigate = useNavigate();

    // لتخزين التوكين
    const [cookie] = useCookies(["token"]);
    const { token } = parseAuthCookie(cookie?.token);

  // للتاكد من تسجيل الدخول
  const handelForOffers = (path) => {
    // تاكيد التوكين
    if(token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  }
  return (
    <section className="sell-section">
      <div className="container">
        <h2 className="sell-title">عندك شيء للبيع؟</h2>
        <p className="sell-subtitle">
          وصل إعلانك لآلاف المشترين في دقائق... ابدأ الآن واعرض منتجاتك بسهولة
        </p>
        <div className="sell-btn" onClick={() =>handelForOffers("/Advertisements")}>
          أضف عرضك
        </div>
        <div className="sell-features">
          <span>
            آمن وموثوق
            <FaCheckCircle className="sell-icon" />
          </span>
          <span>
            ظهور فوري
            <FaCheckCircle className="sell-icon" />
          </span>
          <span>
            النشر مجاني
            <FaCheckCircle className="sell-icon" />
          </span>
        </div>
      </div>
    </section>
  );
};
export default SellSeaction;
