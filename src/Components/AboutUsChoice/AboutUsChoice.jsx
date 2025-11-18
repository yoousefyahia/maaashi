import React from "react";
import "./aboutUsChoice.css";

export default function AboutUsChoice() {
  return (
    <div className="auc_container">
      <h2>
        انضم إلى آلاف المستخدمين وابدأ بيع <br />
        <span>وشراء ما تريد الآن!</span>
      </h2>
      <p>اكتشف عالماً من الفرص والعروض المميزة في انتظارك</p>
      <button className="auc_btn">
        <span>ابدأ باستخدام ماشي</span>
        <div className="left_arrow">
          <img src="./Icons/aboutUs/ArrowLeft.svg" alt="ArrowLeft" />
        </div>
      </button>
    </div>
  );
};