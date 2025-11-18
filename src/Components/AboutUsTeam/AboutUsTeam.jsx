import React from "react";
import "./aboutUsTeam.css";
import { LuWebcam } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiHeart } from "react-icons/ci";

const AboutUsTeam = () => {
  const data = [
    {
      id: 1,
      image: "./images/team.webp",
      icon: <LuWebcam />,
      title: "هدفنا",
      desc: "توصيل البائع بالمشتري بسرعة وأمانة",
    },
    {
      id: 2,
      image: "./images/team1.webp",
      icon: <MdOutlineRemoveRedEye />,
      title: "رؤيتنا",
      desc: "توفير بيئة آمنة وموثوقة للتجارة",
    },
    {
      id: 3,
      image: "./images/team2.webp",
      icon: <CiHeart />,
      title: "قيمنا",
      desc: "الشفافية، الثقة، والمصداقية",
    },
  ];

  return (
    <div className="aboutUsTeam">
      <h2 className="aboutUsTeam_title">هدفنا ورؤيتنا وقيمنا</h2>
      <div className="aboutUsTeam_container">
        {data.map((item) => (
          <div className="aboutUsTeam_box" key={item.id}>
            <img src={`${item.image}`} alt={item.title} />
            <div className="aboutUsTeam_overlay">
              <div className="aboutUsTeam_icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AboutUsTeam;
