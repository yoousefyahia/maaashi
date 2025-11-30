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


export function formatFullDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// تحويل بيانات الإعلان لمواصفات داينمك
export function attributeMapForDetails(ad) {
  if (!ad) return {};

  const map = {};

  if (ad.category?.name) {
    map.category = { label: "الفئة", value: ad.category.name };
  }

  if (ad.type) {
    map.type = { label: "نوع الإعلان", value: ad.type };
  }

  if (ad.price) {
    map.price = { label: "السعر", value: `${ad.price} ريال` };
  }

  if (ad.additional_info) {
    map.additional_info = { label: "معلومات إضافية", value: ad.additional_info };
  }

  Object.keys(ad).forEach((key) => {
    if (!map[key] && typeof ad[key] === "string" && ad[key]) {
      map[key] = { icon: "/icons/default.svg", label: key.replace(/_/g, " "), value: ad[key] };
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

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
          if (data?.images?.length > 0) setMainImage(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching ad details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // جلب التعليقات
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api.maaashi.com/api/ads/comments?ad_id=${id}`
        );
        setComments(response.data.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [id]);

  // التحكم في overflow عند فتح/غلق المودال
  useEffect(() => {
    document.body.style.overflow = loginModel ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [loginModel]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        `https://api.maaashi.com/api/ads/comment`,
        {
          ad_id: id,
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setComments([response.data.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (isLoading || !ad_details) return <p>جاري تحميل الإعلان...</p>;

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
              {mainImage ? <img src={mainImage} alt="Main" /> : <p>لا توجد صورة</p>}
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
{/* المواصفات */}
{/* المواصفات */}
<div className="details_specifications">
  <h3 className="details-lay-info-title">المواصفات</h3>
  {attributesArray.length > 0 ? (
    <div className="details_specifications_box">
      <div className="attributes">
        {attributesArray.map((item, index) => {
          let value = item.value;

          // تحويل created_at و updated_at للتاريخ العربي
          if (item.label.toLowerCase() === "created at" && ad_details.created_at) {
            value = new Date(ad_details.created_at).toLocaleString("ar-EG", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            item.label = "تاريخ النشر";
          } else if (item.label.toLowerCase() === "updated at" && ad_details.updated_at) {
            value = new Date(ad_details.updated_at).toLocaleString("ar-EG", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            item.label = "آخر تحديث";
          }

          return (
            <div className="attribute_item" key={index}>
              <div className="attribute_item_text">
                <span>{item.label}</span>
                <span>{value}</span>
              </div>
            </div>
          );
        })}
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
                    <img
                      src={
                        ad_details?.user?.image_profile ||
                        "https://api.maaashi.com/storage/users/covers/OnlzSpVMpIsd69gUrrBZ6GzWProUDBwnqcEfyTop.webp"
                      }
                      alt="Default Avatar"
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  </div>
                  <div className="user_info">
                    <h5>{ad_details?.user?.name}</h5>
                      <p className="details-left-top-user-member">
                        {(() => {
                          const created = ad_details?.user?.created_at;
                          if (!created) return "";

                          const diffHours =
                            (new Date() - new Date(created)) / 1000 / 60 / 60;

                          // لو أقل من 48 ساعة → يظهر "منذ كذا"
                          if (diffHours < 48) {
                            return `عضو منذ ${timeSince(created)}`;
                          }

                          // لو أكتر من 48 ساعة → يظهر التاريخ الكامل
                          return `تاريخ الانضمام: ${formatFullDate(created)}`;
                        })()}
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
            <img
              src={ad_details?.user?.image_profile || "/images/logo.svg"}
              alt="User"
            />
            <input
              type="text"
              placeholder="اكتب تعليقك هنا..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          <div className="details-lay-comments-actions">
            <button onClick={handleAddComment}>
              <AiOutlineSend /> اضافه تعليق
            </button>
          </div>

<div className="comments_list">
  {comments.length > 0 ? (
    comments.map((cmt) => (
      <div className="comment_item" key={cmt.id}>
        
        <div className="comment_header">
          <img
            src={
              cmt.user?.image_profile ||
              "https://api.maaashi.com/storage/users/covers/OnlzSpVMpIsd69gUrrBZ6GzWProUDBwnqcEfyTop.webp"
            }
            alt={cmt.user?.name}
            className="comment_user_img"
          />

          <div className="comment_user_info">
            <h5 className="comment_user_name">{cmt.user?.name}</h5>
            <span className="comment_date">منذ {timeSince(cmt.created_at)}</span>
          </div>
        </div>

        <p className="comment_text">{cmt.comment}</p>

        <div className="comment_actions">
          <span className="action_item">
            👍 {cmt.likes_count}
          </span>

          <span className="action_item">
            💬 رد {cmt.replies_count}
          </span>

          <span className="action_item report_btn">
            🚫 إبلاغ
          </span>
        </div>

      </div>
    ))
  ) : (
    <p>لا توجد تعليقات بعد</p>
  )}
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
