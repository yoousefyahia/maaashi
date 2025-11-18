import React, { useEffect } from "react";
import "./home.css";
import SearchBar from "../../Components/SearchBar/SearchBar";
import Slider from '../../Components/Slider/Slider.jsx';
import AddList from '../../Components/AddList/AddList';
import CategoriesSection from "../../Components/CategoriesSection/CategoriesSection";
import CarCard from "../../Components/CarCard/CarCard";
import SellSeaction from "../../Components/SellSeaction/SellSeaction";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  return (
      <div className="home-container">
        <SearchBar />
        <Slider />
        <AddList />
        <CategoriesSection />
        <CarCard />
        <SellSeaction />
      </div>
  );
};
export default Home;
