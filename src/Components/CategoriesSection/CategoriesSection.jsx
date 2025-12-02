import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./categoriesSection.css";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://api.maaashi.com/api/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل الأقسام.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>جاري تحميل الأقسام...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="categories">
      <div className="categories-header">
        <h1>
          اختر <span>قسمك</span> وابدأ رحلتك
        </h1>
        <p>
          تصفح بين الإلكترونيات، الأثاث، العقارات والمزيد...
          <br />
          اعثر بسرعة على ما تبحث عنه أو اعرض منتجاتك في المكان المناسب
        </p>
      </div>

<div className="categories-grid">
  {categories.map((cat) => (
    <Link
      key={cat.id}               
      to={`/category/${cat.id}`}
      className="category-card"
    >
      <div className="icon-box">
        <img src={cat.image} alt={cat.name} />
      </div>

      <h2>{cat.name}</h2>
      <p>{cat.description}</p>

      <span className="browse-spen">تصفح القسم</span>
    </Link>
  ))}
</div>

    </section>
  );
};

export default CategoriesSection;
