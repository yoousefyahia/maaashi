import React from "react";
import "./headerDashboard.css";

const HeaderDashboard = ({ title, desc }) => {  
  return (
    <div className="Header_dashboard">
      <h2 className="Header_dashboard_title">
        {title}
        {title.trim() === "متجرك من" && <span>ماشي</span>}
      </h2>
      <p className="Header_dashboard_desc">{desc}</p>
    </div>
  );
};
export default HeaderDashboard;
