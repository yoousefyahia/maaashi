import React from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};
export default MainLayout;
