import React, { useEffect, useState } from "react";
import "./detailsLayout.css";

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { RiStarSLine } from "react-icons/ri";
import { MdOutlineShield } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { LoginForm } from "../Auth/Login";
import { parseAuthCookie } from "../../utils/auth";
import { timeSince } from "../SpecificCategory/SpecificCategory";

// تحويل بيانات الإعلان لمواصفات داينمك
export function attributeMapForDetails(ad) {
  if (!ad) return {};

  const map = {};

  if (ad.category?.name) {
    map.category = {
      label: "الفئة",
      value: ad.category.name,
    };
  }

  if (ad.type) {
    map.type = {
      label: "نوع الإعلان",
      value: ad.type,
    };
  }

  if (ad.price) {
    map.price = {
      label: "السعر",
      value: `${ad.price} ريال`,
    };
  }

  if (ad.additional_info) {
    map.additional_info = {
      label: "معلومات إضافية",
      value: ad.additional_info,
    };
  }

  // أي خصائص إضافية من JSON تتحول لمواصفات داينمك
  Object.keys(ad).forEach((key) => {
    if (!map[key] && typeof ad[key] === "string" && ad[key]) {
      map[key] = {
        icon: "/icons/default.svg",
        label: key.replace(/_/g, " "),
        value: ad[key],
      };
    }
  });

  return map;
}

// وظيفة فتح WhatsApp
export function handleWhatsApp(seller, title) {
  if (!seller || !seller.phone) return;
  let phone = seller.phone.trim().replace(/\s+/g, "").replace(/^\+/, "");
  phone = phone.startsWith("966")
    ? phone
    : phone.startsWith("0")
    ? `966${phone.slice(1)}`
    : `966${phone}`;
  if (!/^9665\d{8}$/.test(phone)) return;

  const message = `مرحبًا ${seller.name}! أريد التواصل معك بشأن إعلانك "${title}" على موقع ماشي.`;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

const DetailsLayout = () => {
  const [cookies] = useCookies(["token"]);
  const { token: userToken } = parseAuthCookie(cookies?.token);
  const [loginModel, setLoginModel] = useState(false);

  const { details, id } = useParams();
  const [categories, setCategories] = useState([]);
  const [ad_details, setAd_details] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const images = ad_details?.images || [];

  // جلب الفئات
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
  }, []);

  const category =
    categories.find((cat) => details === cat.key) || { name: "اسم الفئة", key: "" };

  // جلب تفاصيل الإعلان
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.maaashi.com/api/ads/show?ad_id=${id}`
        );
        const data = response?.data;
        if (data) {
          setAd_details(data);
          if (data?.images?.length > 0) {
            setMainImage(data.images[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching ad details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // التحكم في overflow عند فتح/غلق المودال
  useEffect(() => {
    document.body.style.overflow = loginModel ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loginModel]);

  if (isLoading || !ad_details) {
    return <p>جاري تحميل الإعلان...</p>;
  }

  const attributesArray = Object.values(attributeMapForDetails(ad_details) || {});

  return (
    <div className="details-layout">
      <div className="details_header">
        <div className="details_links">
          <Link to="/" className="details-close">
            الرئيسيه <IoIosArrowBack />
          </Link>
          <Link to={`/${category.key}`} className="details-close">
            {category.name} <IoIosArrowBack />
          </Link>
          <span className="details-close">{ad_details?.title}</span>
        </div>

        <div className="details_header_content">
          <div className="details_header_title">
            <h2 className="details-title">{ad_details?.title}</h2>
            <div className="details_price">
              {ad_details?.price && (
                <>
                  <h1 className="details-left-price">{ad_details?.price} ريال</h1>
                  <span className="details-left-negotiable">
                    {ad_details?.isNegotiable ? "قابل للتفاوض" : "غير قابل للتفاوض"}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="details-close-titles">
            {ad_details?.is_featured && (
              <span className="details-close-title-yello">
                <RiStarSLine /> مميز
              </span>
            )}
            <span className="details-close-title-main">
              <MdOutlineShield /> بائع موثوق
            </span>
            <span className="details-close-title-empty">
              نشر منذ {ad_details?.created_at ? timeSince(ad_details.created_at) : ""}
            </span>
          </div>
        </div>
      </div>

      <section className="details_grid_container">
        {/* right section */}
        <div className="details-right">
          {/* الصور */}
          <div className="details_images">
            <div className="details-lay-image-main">
              {mainImage ? (
                <img src={mainImage} alt="Main" />
              ) : (
                <p>لا توجد صورة</p>
              )}
            </div>
            <div className="details-lay-image-thumbs">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setMainImage(img)}
                    className={mainImage === img ? "active-thumb" : ""}
                  />
                ))
              ) : (
                <p>لا توجد صور إضافية</p>
              )}
            </div>
          </div>

          {/* المواصفات */}
          <div className="details_specifications">
            <h3 className="details-lay-info-title">المواصفات</h3>
            {attributesArray.length > 0 ? (
              <div className="details_specifications_box">
                <div className="attributes">
                  {attributesArray.map((item, index) => (
                    <div className="attribute_item" key={index}>
                      {/* <div className="attribute_item_icon">
                        <img src={item.icon || "/icons/default.svg"} alt={item.label} />
                      </div> */}
                      <div className="attribute_item_text">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>لا توجد مواصفات</p>
            )}
          </div>

          {/* الوصف */}
          <div className="details-layout-decs">
            <h3 className="details-lay-decs-title">الوصف</h3>
            <p className="details-lay-decs-info">{ad_details?.description}</p>
            {ad_details?.additional_info && (
              <div className="attribute_item_text">
                <span>معلومات اضافية</span>
                <span>{ad_details.additional_info}</span>
              </div>
            )}
          </div>
        </div>

        {/* left section */}
        <div className="details-left">
          <div className="details_left_container">
            {/* معلومات البائع */}
            <div className="details-left-top">
              <div className="details-left-top-user">
                <Link
                  to={`/user/${ad_details?.user?.name}/${ad_details?.user?.id}`}
                  className="card_user"
                >
                  <div className="card_user_image">
                    {/* {ad_details?.user?.image ? (
                      <img src={ad_details.user.image} alt={ad_details.user.name} />
                    ) : ( */}
                      <img
                        src="data:image/png;base64,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" // رابط مباشر
                        alt="Default Avatar"
                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                      />
                    {/* )} */}
                  </div>

                  <div className="user_info">
                    <h5>{ad_details?.user?.name}</h5>
                    <p className="details-left-top-user-member">
                      عضو منذ{" "}
                      {ad_details?.user?.created_at
                        ? timeSince(ad_details.user.created_at)
                        : ""}
                    </p>
                  </div>
                </Link>

                <div className="details-left-top-user-actions">
                  <span>
                    <MdOutlineShield /> موثوق
                  </span>
                  <span>
                    <RiStarSLine />4.8
                  </span>
                  <span>{ad_details?.user?.ads_count || 0} اعلان</span>
                  <span>معدل الرد 95%</span>
                </div>

                <div className="details-left-top-user-buttons">
                  <button
                    className="details-left-top-user-btn1"
                    onClick={() => setLoginModel(true)}
                  >
                    <IoCallOutline /> تواصل
                  </button>
                  <button className="details-left-top-user-btn2">
                    <LuMessageCircleMore /> رساله
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleWhatsApp(ad_details?.user, ad_details?.title)}
                className="details-left-top-send"
              >
                واتساب
              </button>
            </div>

            {/* نصائح الأمان */}
            <div className="details-left-bottom">
              <h2>نصائح الامان</h2>
              <ul>
                <li>تأكد من فحص المنتج قبل الشراء.</li>
                <li>التق بالبائع في مكان عام.</li>
                <li>لا تدفع اي مبلغ قبل المعاينه.</li>
                <li>تحقق من الاوراق الرسميه.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* التعليقات */}
        <div className="details_footer_comments">
          <h3>التعليقات</h3>
          <p>شارك رايك او استفسارك حول هذا الاعلان</p>

          <div className="details-lay-comments-user">
            <img src="/images/logo.svg" alt="User" />
            <input type="text" placeholder="اكتب تعليقك هنا..." />
          </div>

          <div className="details-lay-comments-actions">
            <button>
              <AiOutlineSend /> اضافه تعليق
            </button>
          </div>
        </div>
      </section>

      {/* مودال التواصل */}
      {loginModel && (
        <section className="login_modal_fade">
          <div className="modal_dialog">
            <div className="modal_header">
              <button type="button" onClick={() => setLoginModel(false)}>
                X
              </button>
            </div>
            {userToken ? (
              <div className="model_content">
                <p>التواصل مع العارض</p>
                <a href={`tel:${ad_details?.user?.phone}`} className="sellerPhone">
                  {ad_details?.user?.phone}
                </a>
              </div>
            ) : (
              <div>
                <h1>تسجيل الدخول</h1>
                <LoginForm />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DetailsLayout;
