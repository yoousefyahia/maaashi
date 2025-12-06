import React, { useEffect, useState } from "react";
import "./detailsLayout.css";

// Icons
import { IoIosArrowBack, IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { RiStarSLine } from "react-icons/ri";
import { MdOutlineShield } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { LoginForm } from "../Auth/Login";
import { parseAuthCookie } from "../../utils/auth";
import { timeSince } from "../SpecificCategory/SpecificCategory";
import { BiCategory } from "react-icons/bi";
import { MdOutlineDriveFileRenameOutline, MdDescription } from "react-icons/md";
import { AiOutlineDollar, AiOutlineInfoCircle, AiOutlineCalendar, AiOutlinePhone } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { RiFileTextLine } from "react-icons/ri";
import { toast } from 'react-toastify';

const iconsMap = {
  "الفئة": <BiCategory />,
  "نوع الإعلان": <MdOutlineDriveFileRenameOutline />,
  "السعر": <AiOutlineDollar />,
  "معلومات إضافية": <AiOutlineInfoCircle />,
  "العنوان": <RiFileTextLine />,
  "الوصف": <MdDescription />,
  "اسم البائع": <FaUser />,
  "رقم البائع": <AiOutlinePhone />,
  "تاريخ الإنشاء": <AiOutlineCalendar />,
  "تاريخ التعديل": <AiOutlineCalendar />,
};

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

export function attributeMapForDetails(ad) {
  if (!ad) return {};

  const map = {};

  // ترجمة ثابتة للحقول الرئيسية
  if (ad.category?.name) map.category = { label: "الفئة", value: ad.category.name };
  if (ad.type) map.type = { label: "نوع الإعلان", value: ad.type };
  if (ad.price) map.price = { label: "السعر", value: `${ad.price} ريال` };
  if (ad.additional_info) map.additional_info = { label: "معلومات إضافية", value: ad.additional_info };
  if (ad.title) map.title = { label: "العنوان", value: ad.title };
  if (ad.description) map.description = { label: "الوصف", value: ad.description };
  if (ad.seller_name) map.seller_name = { label: "اسم البائع", value: ad.seller_name };
  if (ad.seller_phone) map.seller_phone = { label: "رقم البائع", value: ad.seller_phone };

  // صيغة التاريخ العربي
  if (ad.created_at) map.created_at = { label: "تاريخ الإنشاء", value: formatFullDate(ad.created_at) };
  if (ad.updated_at) map.updated_at = { label: "تاريخ التعديل", value: formatFullDate(ad.updated_at) };

  return map;
}

export function handleWhatsApp(seller, title) {
  if (!seller || !seller.phone) return;
  let phone = seller.phone.trim().replace(/\s+/g, "").replace(/^\+/, "");
  phone = phone.startsWith("966") ? phone : phone.startsWith("0") ? `966${phone.slice(1)}` : `966${phone}`;
  if (!/^9665\d{8}$/.test(phone)) return;
  const message = `مرحبًا ${seller.name}! أريد التواصل معك بشأن إعلانك "${title}" على موقع ماشي.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

// دالة مساعدة للتحقق من التوكن
const checkAuth = (userToken, setLoginModel) => {
  if (!userToken) {
    toast.error('يجب تسجيل الدخول أولاً');
    setLoginModel(true);
    return false;
  }
  return true;
};

const DetailsLayout = () => {
  const [cookies] = useCookies(["token"]);
  const { token: userToken } = parseAuthCookie(cookies?.token);
  const [loginModel, setLoginModel] = useState(false);
  const navigate = useNavigate();

  const { details, id } = useParams();
  const [categories, setCategories] = useState([]);
  const [ad_details, setAd_details] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedComments, setLikedComments] = useState({});

  const images = ad_details?.images || [];

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

  // جلب كل التعليقات مع حالة اللايك من السيرفر
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://api.maaashi.com/api/ads/comments?ad_id=${id}`,
          { headers: userToken ? { Authorization: `Bearer ${userToken}` } : {} }
        );

        const commentsData = response.data.data || [];

        const likedState = {};
        commentsData.forEach(c => {
          likedState[c.id] = c.is_liked || false;
        });

        setLikedComments(likedState);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [id, userToken]);

  useEffect(() => {
    document.body.style.overflow = loginModel ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [loginModel]);

  // دالة التعامل مع زر الرسالة
  const handleMessageClick = () => {
    if (!checkAuth(userToken, setLoginModel)) return;

    if (!ad_details?.user?.id) {
      toast.error('لا يمكن العثور على معلومات البائع');
      return;
    }

    navigate(`/ChatApp/${ad_details.user.id}`);
  };

  const handleAddComment = async () => {
    // تحقق من التوكن أولاً
    if (!checkAuth(userToken, setLoginModel)) return;
    
    if (!newComment.trim()) {
      toast.warning('يرجى كتابة تعليق');
      return;
    }
    
    try {
      const response = await axios.post(
        `https://api.maaashi.com/api/ads/comment`,
        { ad_id: id, comment: newComment },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setComments([response.data.data, ...comments]);
      setNewComment("");
      toast.success('تم إضافة التعليق بنجاح');
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error('فشل في إضافة التعليق');
    }
  };

  const handleLikeComment = async (commentId) => {
    // تحقق من التوكن أولاً
    if (!checkAuth(userToken, setLoginModel)) return;

    const isLiked = likedComments[commentId] || false;

    // تحديث UI فورًا
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !isLiked,
    }));
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, likes_count: c.likes_count + (isLiked ? -1 : 1) }
          : c
      )
    );

    try {
      if (!isLiked) {
        await axios.post(
          `https://api.maaashi.com/api/comments/like`,
          { comment_id: commentId, ad_id: id },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        toast.success('تم الإعجاب بالتعليق');
      } else {
        await axios.post(
          `https://api.maaashi.com/api/comments/unlike`,
          { comment_id: commentId, ad_id: id },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        toast.success('تم إلغاء الإعجاب بالتعليق');
      }
    } catch (err) {
      console.error("Error updating like:", err);
      setLikedComments(prev => ({
        ...prev,
        [commentId]: isLiked,
      }));
      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? { ...c, likes_count: c.likes_count + (isLiked ? 1 : -1) }
            : c
        )
      );
      toast.error('فشل في تحديث الإعجاب');
    }
  };

  // دالة للاتصال بالبائع
  const handleCallClick = () => {
    if (!checkAuth(userToken, setLoginModel)) return;
    
    if (!ad_details?.user?.phone) {
      toast.error('لا يوجد رقم هاتف للبائع');
      return;
    }
    
    window.open(`tel:${ad_details.user.phone}`);
  };

  // إخفاء أو تغيير واجهة التعليقات إذا لم يكن المستخدم مسجلًا
  const renderCommentsSection = () => {
    if (!userToken) {
      return (
        <div className="details_footer_comments">
          <h3>التعليقات</h3>
          <div className="login_required_comments">
            <p>يجب <button className="login_link" onClick={() => setLoginModel(true)}>تسجيل الدخول</button> لإضافة تعليق أو الإعجاب بالتعليقات</p>
          </div>
          
          <div className="comments_list">
            {comments.length > 0 ? (
              comments.map((cmt) => (
                <div className="comment_item" key={cmt.id}>
                  <div className="comment_header">
                    <img src={cmt.user?.image_profile || "https://api.maaashi.com/storage/users/covers/OnlzSpVMpIsd69gUrrBZ6GzWProUDBwnqcEfyTop.webp"} alt={cmt.user?.name} className="comment_user_img" />
                    <div className="comment_user_info">
                      <h5 className="comment_user_name">{cmt.user?.name}</h5>
                      <span className="comment_date"> منذ:{" "}{timeSince(cmt.created_at)}</span>
                    </div>
                  </div>

                  <p className="comment_text">{cmt.comment}</p>

                  <div className="comment_actions">
                    <span className="action_item">
                      <IoIosHeartEmpty /> {cmt.likes_count}
                    </span>
                    <span className="action_item" onClick={() => setLoginModel(true)}>
                      تسجيل الدخول للإعجاب
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>لا توجد تعليقات بعد</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="details_footer_comments">
        <h3>التعليقات</h3>
        <p className="comment_subtitle">شارك رأيك أو استفسارك حول هذا الإعلان</p>

        <div className="details-lay-comments-user">
          <img src={ad_details?.user?.image_profile || "/images/logo.svg"} alt="User" />
          <input 
            type="text" 
            placeholder="اكتب تعليقك هنا..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
        </div>

        <div className="details-lay-comments-actions">
          <button onClick={handleAddComment}>
            <AiOutlineSend className="send-icon" /> إضافة تعليق
          </button>
        </div>

        <div className="comments_list">
          {comments.length > 0 ? (
            comments.map((cmt) => (
              <div className="comment_item" key={cmt.id}>
                <div className="comment_header">
                  <img src={cmt.user?.image_profile || "https://api.maaashi.com/storage/users/covers/OnlzSpVMpIsd69gUrrBZ6GzWProUDBwnqcEfyTop.webp"} alt={cmt.user?.name} className="comment_user_img" />
                  <div className="comment_user_info">
                    <h5 className="comment_user_name">{cmt.user?.name}</h5>
                    <span className="comment_date"> منذ:{" "}{timeSince(cmt.created_at)}</span>
                  </div>
                </div>

                <p className="comment_text">{cmt.comment}</p>

                <div className="comment_actions">
                  <span className="action_item" onClick={() => handleLikeComment(cmt.id)}>
                    {likedComments[cmt.id] ? <IoIosHeart color="red" /> : <IoIosHeartEmpty />}
                    {cmt.likes_count}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>لا توجد تعليقات بعد</p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading || !ad_details) return <p>جاري تحميل الإعلان...</p>;

  const attributesArray = Object.values(attributeMapForDetails(ad_details) || {});

  return (
    <div className="details-layout">
      {/* الهيدر */}
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
        {/* يمين الصفحة */}
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
          <div className="details_specifications">
            <h3 className="details-lay-info-title">المواصفات</h3>
            {attributesArray.length > 0 ? (
              <div className="details_specifications_box">
                <div className="attributes">
                  {attributesArray.map((item, index) => (
                    <div className="attribute_item" key={index}>
                      <div className="attribute_item_icon">{iconsMap[item.label]}</div>
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

        {/* يسار الصفحة */}
        <div className="details-left">
          <div className="details_left_container">
            {/* بيانات البائع */}
            <div className="details-left-top">
              <div className="details-left-top-user">
                <Link
                  to={`/user/${ad_details?.user?.name}/${ad_details?.user?.id}`}
                  className="card_user"
                >
                  <div className="card_user_image">
                    <img
                      src={ad_details?.user?.image_profile || "https://api.maaashi.com/storage/users/covers/OnlzSpVMpIsd69gUrrBZ6GzWProUDBwnqcEfyTop.webp"}
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
                        const diffHours = (new Date() - new Date(created)) / 1000 / 60 / 60;
                        if (diffHours < 48) return `عضو منذ ${timeSince(created)}`;
                        return `تاريخ الانضمام: ${formatFullDate(created)}`;
                      })()}
                    </p>
                  </div>
                </Link>

                <div className="details-left-top-user-actions">
                  <span><MdOutlineShield /> موثوق</span>
                  <span><RiStarSLine />4.8</span>
                  <span>{ad_details?.user?.ads_count || 0} اعلان</span>
                  <span>معدل الرد 95%</span>
                </div>

                <div className="details-left-top-user-buttons">
                  <button 
                    className="details-left-top-user-btn1" 
                    onClick={handleCallClick}
                  >
                    <IoCallOutline /> تواصل
                  </button>
                  <button
                    className="details-left-top-user-btn2"
                    onClick={handleMessageClick}
                  >
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
        {renderCommentsSection()}
      </section>

      {/* مودال تسجيل الدخول */}
      {loginModel && (
        <section className="login_modal_fade">
          <div className="modal_dialog">
            <div className="modal_header">
              <button type="button" onClick={() => setLoginModel(false)}>X</button>
            </div>
            {userToken ? (
              <div className="model_content">
                <p>التواصل مع العارض</p>
                <a href={`tel:${ad_details?.user?.phone}`} className="sellerPhone">{ad_details?.user?.phone}</a>
                <button
                  className="message-button"
                  onClick={() => {
                    setLoginModel(false);
                    navigate(`/ChatApp/${ad_details?.user?.id}`);
                  }}
                >
                  <LuMessageCircleMore /> إرسال رسالة
                </button>
              </div>
            ) : (
              <div className="login-modal-content">
                <h1>تسجيل الدخول</h1>
                <p>يجب تسجيل الدخول لإرسال رسالة</p>
                <LoginForm
                  onLoginSuccess={() => {
                    setLoginModel(false);
                    if (ad_details?.user?.id) {
                      navigate(`/ChatApp/${ad_details.user.id}`);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default DetailsLayout;