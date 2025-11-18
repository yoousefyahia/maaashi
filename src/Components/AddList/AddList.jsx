import React from "react";
import "./addList.css";

const AddList = () => {
  const card = [
    {
      id: 1,
      img: "/Icons/categore3.svg",
      title: "سهل وسريع",
      desc: "اضف إعلانك في أقل من دقيقة واحدة",
    },
    {
      id: 2,
      img: "/Icons/gabal1.svg",
      title: "آمن وموثوق",
      desc: "نضمن لك تجربة آمنة مع أفضل المشتريين والبائعين",
    },
    {
      id: 3,
      img: "/Icons/gabal.svg",
      title: "إضافة مجانية",
      desc: "انشر إعلانك مجانًا ووصل إلى آلاف المهتمين",
    },
  ];

  return (
    <section className="add-list">
      <h1 className="add-list-title">
        لماذا تختار <span>ماشي؟</span>
      </h1>
      <div className="add-list-container">
        {card.map((item) => (
          <div key={item.id} className="add-card">
            <div className="icon-box">
              <img src={item.img} alt={item.title} />
            </div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default AddList;
