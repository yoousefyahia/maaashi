import React, { useState } from "react";
import "./helpUser.css";

const initialItems = [
  { id: 1, title: "أسباب رفض الإعلانات" },
  { id: 2, title: "الحد الأقصى للإعلانات" },
  { id: 3, title: "المعلومات القانونية والمعلومات الخصوصية" },
  { id: 4, title: "المعلومات القانونية والمعلومات الخصوصية" },
  { id: 5, title: "الحد الأقصى للإعلانات" },
  { id: 6, title: "أسباب رفض الإعلانات" },
  { id: 7, title: "المعلومات القانونية والمعلومات الخصوصية" },
  { id: 8, title: "الحد الأقصى للإعلانات" },
  { id: 9, title: "أسباب رفض الإعلانات" },
];

function HelpUser() {
  const [query, setQuery] = useState("");

  const filtered = initialItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="Help_user">
      {/* مربع البحث */}
      <div className="Help_user_search">
        <input
          type="text"
          placeholder="ابحث عن...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="Help_user_search_btn">بحث</button>
      </div>

      {/* النتائج */}
      <div className="Help_user_content">
        {filtered.length > 0 ? (
          filtered.map((e) => (
            <div className="Help_user_item" key={e.id}>
              {e.title}
            </div>
          ))
        ) : (
          <p className="Help_user_empty">لا توجد نتائج مطابقة</p>
        )}
      </div>
    </div>
  );
}
export default HelpUser;
