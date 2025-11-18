

import React, { useState } from "react";
import "./offersUser.css";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";

const OffersUser = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const allOffers = [
    "السيارات والمركبات",
    "العقارات",
    "الالكترونيات",
    "الوظائف",
    "اثاث",
    "خدمات",
    "ازياء",
    "اطعمه",
    "نوادر",
    "حدائق",
    "رحلات",
    "حيوانات",
  ];

  const ads = [
    {
      image: "/images/filter1.webp",
      title: "للبيع شقة تمليك الدور الأول",
      time: "قبل 4 دقائق",
      location: "مصر, القاهرة",
    },
    {
      image: "/images/filter1.webp",
      title: "للبيع شقة تمليك الدور الأول",
      time: "قبل 4 دقائق",
      location: "مصر, القاهرة",
    },
    {
      image: "/images/filter1.webp",
      title: "للبيع شقة تمليك الدور الأول",
      time: "قبل 4 دقائق",
      location: "مصر, القاهرة",
    },
  ];

  return (
    <div className="offers_user_up">
      {/* البحث */}
      <div className="offers_filters_search">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">ابحث حسب الفئه</option>
          {allOffers.map((offer, index) => (
            <option key={index} value={offer}>
              {offer}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="ابحث بعنوان العرض"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      {/* الحالة */}
      <div className="offers_status_items">
        <span>عرض الكل ({ads.length})</span>
        <h4>الإعلانات المميزه</h4>
      </div>

      {/* كروت الإعلانات */}
      <div className="offers_list_head">
        {ads.map((ad, index) => (
          <div key={index} className="offer_card">
            {/* صورة الإعلان */}
            <div className="offer_img_head_list">
              <img src={ad.image} alt={ad.title} />
            </div>

            {/* تفاصيل الإعلان */}
            <div className="offer_content_user">
              <h5 className="offer_user_title">{ad.title}</h5>
              <div className="offer_user_meta">
                <span className="info">
                  <IoLocationOutline /> {ad.location}
                  <MdOutlineTimer /> {ad.time}
                </span>
              </div>
              <button className="offer_actions_pro_btn">عرض الاعلان</button>
            </div>

            {/* أزرار تعديل وحذف قصاد الصورة */}
            <div className="offer_actions_pro">
              <button className="edit_btn_pro">تعديل</button>
              <button className="delete_btn_pro">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {/* عرض المزيد */}
      <div className="show_more_all">
        <button>عرض المزيد...</button>
      </div>
    </div>
  );
};

export default OffersUser;
