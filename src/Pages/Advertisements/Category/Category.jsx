import React, { useEffect, useRef } from "react";
import "./Category.css";

export default function Category({ formik, setCategories }) {
  const { values, setFieldValue, errors, setFieldError } = formik;
  const bottomRef = useRef(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/categories");
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };

    getCategories();
  }, [setCategories]);

  return (
    <div className='category_main'>
      <div className="categories-container">
        <h2 className="title">اختر فئة الإعلان</h2>
        <p className="subtitle">حدد الفئة المناسبة لإعلانك</p>

        <div className="grid-container">
          {Array.isArray(formik.values.dynamicCategories) &&
            formik.values.dynamicCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setFieldValue("category", cat.id);
                  setFieldError("category", "");
                  setTimeout(() => {
                    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                  console.log("Selected category id:", cat.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFieldValue("category", cat.id)}
                className={`categoryads_card ${values.category === cat.id ? "active_category" : ""}`}
              >
                <div className="icon">
                  <img src={cat.image || cat.icon} alt={cat.name} />
                </div>
                <p>{cat.name}</p>
              </div>
            ))}
        </div>

        {errors.category && <div className="error">{errors.category}</div>}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
