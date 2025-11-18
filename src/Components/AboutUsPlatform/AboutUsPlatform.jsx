import React from "react";
import "./aboutUsPlatform.css";

export default function AboutUsPlatform() {
  return (
    <div className="aboutUsPlatform">
      {/* القسم الأيمن */}
      <div className="aboutUsPlatform_right">
        <h2 className="aboutUsPlatform_right_heading">منصه ماشي</h2>
        <p className="aboutUsPlatform_right_para">
          ماشي هو منصّة إعلانات مبوّبة مبتكرة، تساعدك على بيع منتجاتك أو شراء ما
          تحتاجه في دقائق.
        </p>
        <div className="aboutUsPlatform_categories_container">
          {/* أيقونات الفئات */}
          <div className="aboutUsPlatform_category">
            <div className="aboutUsPlatform_line">
              <img src="/Icons/categore4.svg" alt="العقارات" />
            </div>
            <span className="aboutUsPlatform_line_text_real_estate">عقارات</span>
          </div>

          <div className="aboutUsPlatform_category">
            <span className="aboutUsPlatform_line">
              <img src="/Icons/grayCar.svg" alt="السيارات" />
            </span>
            <span className="aboutUsPlatform_line_text_car">سيارات</span>
          </div>

          <div className="aboutUsPlatform_category">
            <span className="aboutUsPlatform_line">
              <img src="/Icons/categore5.svg" alt="الأجهزة" />
            </span>
            <span className="aboutUsPlatform_line_text_devices">الأجهزة</span>
          </div>

          <div className="aboutUsPlatform_category">
            <span className="aboutUsPlatform_line">
              <img src="/Icons/grayJobs.svg" alt="الوظائف" />
            </span>
            <span className="aboutUsPlatform_line_text_jobs">الوظائف</span>
          </div>
        </div>
      </div>

      {/* القسم الأيسر */}
      <div className="aboutUsPlatform_left">
        <div className="aboutUsPlatform_left_avatar">
          <img src="./images/platform.webp" alt="منصة ماشي" className="avatar_img" />
        </div>
        
        <div className="aboutUsPlatform_left_avatar_icon">
          <img src="./Icons/DeviceMobileCamera.svg" alt="DeviceMobileCamera" />
        </div>
      </div>
    </div>
  )
}
