import React from "react";
import "./AddHeader.css";

export default function AddHeader({ currentStep, successMessage }) {
  // const steps = ["الفئة", "المعلومات", "الصور", "الموقع", "بيانات البائع", "تأكيد"];
  const steps = ["الفئة", "المعلومات", "الصور" , "بيانات البائع", "تأكيد"];

  return (
    <div className="addHeaderContainer">
      <header className="addHeader">
        <h1>أضف إعلانك الآن</h1>
        <p>املأ البيانات التالية ليظهر إعلانك للآلاف من المشترين خلال دقائق</p>
      </header>

      <div className="header_container">
        <div className="line" />

        {steps.map((label, index) => (
          <div
            key={index}
            className={`category ${currentStep > index + 1 ? "active_Header" : currentStep === index + 1 ? "current_step" : ""}`}
          >
            <div className="lineProgress" style={{ display: currentStep != index + 1 ? "none" : "" }} />
            <div className="big_circle" style={{backgroundColor: currentStep === 5 && successMessage ? "var(--main-color)" : ""}}>
              <div className={currentStep === 5 && successMessage ? "success_border_circle" : "border_circle"}>
                <img
                  src="./advertisements/CheckCircle.svg"
                  alt="CheckCircle"
                  className={currentStep > index + 1 || (currentStep === 5 && successMessage) ? "CheckCircle" : "Check_none"}
                />
              </div>
            </div>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
