import React from "react";
import "./blogUser.css";

const BlogUser = () => {
  const blogUserArr = [
    {
      id: "1",
      image: "images/filter2.webp",
      title: "للبيع شقة تمليك الدور الأول",
      desc: "طبعاً مش محتاجين نقول اننا حالياً عايشين في أجواء إقتصادية صعبة جدا، من أهم أسباب الموضوع ده العطل العام في…",
    },
    {
      id: "2",
      image: "images/filter2.webp",
      title: "للبيع شقة تمليك الدور الأول",
      desc: "طبعاً مش محتاجين نقول اننا حالياً عايشين في أجواء إقتصادية صعبة جدا، من أهم أسباب الموضوع ده العطل العام في…",
    },
    {
      id: "3",
      image: "images/filter2.webp",
      title: "للبيع شقة تمليك الدور الأول",
      desc: "طبعاً مش محتاجين نقول اننا حالياً عايشين في أجواء إقتصادية صعبة جدا، من أهم أسباب الموضوع ده العطل العام في…",
    },
  ];
  return (
    <div className="Blog_user">
      <h2 className="Blog_user_addr">اهم المفالات</h2>
      <p className="Blog_user_desc">تابع وأدِر جميع عروضك بسهولة من هنا</p>
      <div className="Blog_user_content">
        {blogUserArr.map((e) => (
          <div className="Blog_user_content_items" key={e.id}>
            <div className="Blog_user_content_images">
              <img src={e.image} alt={e.title}/>
            </div>
            <h3>{e.title}</h3>
            <p>{e.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogUser;
