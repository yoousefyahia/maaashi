import React from 'react';
import "./aboutUsWork.css";

export default function AboutUsWork() {
  const firstSection = [
    { icon: "./Icons/aboutUs/sereach.svg", title: "ابحث عن ما تحتاجه", desc: "استخدم البحث المقدم للعثور على المنتج المطلوب بسرعة وسهولة" },
    { icon: "./Icons/aboutUs/ChatTeardrop.svg", title: "تواصل مع البائع", desc: "تحدث مع البائع مباشرة للاستفسار عن التفاصيل والتفاوض على السعر" },
    { icon: "./Icons/aboutUs/Handshake.svg", title: "أكمل الصفقة بأمان", desc: "اتفق على التفاصيل النهائية وأتمم عملية الشراء بكل ثقة وأمان" },
  ];

  const secondSection = [
    { icon: "./Icons/aboutUs/TrendUp.svg", title: "إضافة مجانية", desc: "انشر إعلانك مجاناً ووصل إلى آلاف المهتمين" },
    { icon: "./Icons/aboutUs/child.svg", title: "آمن وموثوق", desc: "نضمن لك تجربة آمنة مع أفضل المشترين والبائعين" },
    { icon: "./Icons/aboutUs/doller.svg", title: "سهل وسريع", desc: "أضف إعلانك في أقل من دقيقة واحدة" },
  ];

  const Card = ({ icon, title, desc }) => (
    <div className="AboutUsWork_card">
      <div className="card_icon">
        <img src={icon} alt={title} className="img_icon" />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );

  return (
    <div className="AboutUsWork_container">
      <div className="howItWork">
        <div className="howItWork_container">
          <h2 className="section-title">كيف يعمل <span>ماشي؟</span></h2>
          <div className="cards-grid">
            {firstSection.map((item, i) => <Card key={i} {...item} />)}
          </div>
        </div>
      </div>

      <div className="choose_container">
        <h2 className="section-title">لماذا تختار <span>ماشي؟</span></h2>
        <p className="subtitle">منصتك المثالية للبيع والشراء بكل ثقة وأمان</p>
        <div className="cards-grid">
          {secondSection.map((item, i) => <Card key={i} {...item} />)}
        </div>
      </div>
    </div>
  );
};