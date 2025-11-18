import React from "react";
import "./searchBar.css";

const SearchBar = () => {
  return (
    <div className="search-par">
      <div className="overlay">
        <div className="search-par-container">
          <div className="search-par-text">
            <h1>كل ما تحتاجه في مكان واحد</h1>
            <p>
              اعرض منتجاتك أو ابحث عن أفضل العروض بالقرب منك.. بكل سرعة وأمان{" "}
            </p>
          </div>
          <form className="search-par-search">
            <div className="search-par-content">
              <label>الكلمات المفتاحيه</label>
              <input type="search" placeholder="ابحث عن..." />
            </div>
            <div className="search-par-content">
              <label>الموقع</label> <input type="search" placeholder="اين" />
            </div>
            <div className="search-par-content">
              <label>القسم</label> <input type="search" placeholder="في قسم" />
            </div>
            <button className="btn-search-par">بحث...</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
