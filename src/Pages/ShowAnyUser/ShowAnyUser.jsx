import React, { useEffect, useState } from 'react';
import "./showAnyUserStyle.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CiLocationOn, CiStopwatch } from 'react-icons/ci';
import { timeSince } from '../SpecificCategory/SpecificCategory';
import SkeletonCard from '../../Components/SkeletonCard/SkeletonCard';
import NotFound from '../../Components/NotFound/NotFound';
import { useCookies } from 'react-cookie';
import { ToastWarning } from '../../Components/Header/Header';
import { parseAuthCookie } from '../../utils/auth';

export default function ShowAnyUser() {
    const { userID } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://api.maaashi.com/api/user/${userID}`, {
                    method: "GET",
                });

                const data = await response.json();
                // --- تعديل هنا ---
                if (data.status) {
                    setUserData(data.data);
                    setErrorMessage("");
                } else {
                    setErrorMessage("فشل في تحميل بيانات المستخدم.");
                }
            } catch {
                setErrorMessage("حدث خطأ أثناء تحميل البيانات.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userID]);

    // ***** Favorite Handling (زي ما هو) *****
    const [cookies] = useCookies(["token"]);
    const { token } = parseAuthCookie(cookies?.token);
    const [showToast, setShowToast] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const addToFavorites = async (category, adId) => {
        try {
            setIsFavoriteLoading(true);

            const response = await fetch(
                `https://api.maaashi.com/api/favorites/${category}/${adId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data?.message || "حدث خطأ أثناء الإضافة للمفضلة.");
            }
        } catch {
            setErrorMessage("فشل الاتصال بالسيرفر أثناء الإضافة.");
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleFavoriteClick = (e, category, adID) => {
        e.stopPropagation();
        if (!token) {
            setShowToast(true);
            return;
        }
        toggleFavorite(e, adID);
        addToFavorites(category, adID);
    };

    return (
        <section className="showAnyUserData">

            {/* ****** LOADING SKELETON ****** */}
            {isLoading && (
                <div className="loading_data">
                    <div className="isLoading">
                        {Array.from({ length: 4 }, (_, i) => (<SkeletonCard key={i} />))}
                    </div>
                </div>
            )}

            {/* ****** ERROR ****** */}
            {errorMessage && <NotFound />}

            {/* ****** MAIN CONTENT ****** */}
            {!isLoading && !errorMessage && (
                <div className="showAnyUserData_container">

                    {/* **************** USER DATA **************** */}
                    <div className="user_data">
                        <div className="user_images">
                            <div className="cover_user_image">
                                <img
                                    src={userData?.cover_image}
                                    alt="صورة الكوفر"
                                    loading="lazy"
                                />
                            </div>

                            <div className="profile_user_image">
                                <div className="user_img_container">
                                    <img
                                        src={userData?.image_profile || "/placeholder-profile.png"}
                                        alt="img"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
<div className="user_info">
  <p><strong>الاسم:</strong> {userData?.name || "غير محدد"}</p>

<p><strong>المنطقة:</strong> {userData?.area || "غير محدد"}</p>
<p><strong>المدينة:</strong> {userData?.city || "غير محدد"}</p>
<p><strong>العنوان:</strong> {userData?.location || "غير محدد"}</p>


  <p><strong>رقم الهاتف:</strong> {userData?.phone || "غير محدد"}</p>
</div>



                        {errorMessage && <p className="error_message">{errorMessage}</p>}
                    </div>

                    {/* **************** ADS LIST (بدون أي تعديل) **************** */}
                    <div className="categories_items">
                        {userData?.data?.map((cat) => (
                            <div
                                key={cat?.ad?.id_ads}
                                className="category_card"
                                onClick={() => navigate(`/${cat?.category}/${cat?.ad?.id_ads}`)}
                            >
                                <div className="card_image">
                                    <img
                                        src={
                                            cat?.ad?.images?.[0]
                                                ? `https://api.maaashi.com/storage/${cat?.ad?.images[0]}`
                                                : "/placeholder.png"
                                        }
                                        alt={cat?.ad?.information?.title}
                                    />
                                </div>

                                <div className="card_user">
                                    {cat?.ad?.user?.profile_image ? (
                                        <img src={cat?.ad?.user?.profile_image} alt="user" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx={12} cy={10} r={4} /><circle cx={12} cy={12} r={10} /></svg>
                                    )}
                                    <span>{cat?.ad?.seller?.name?.split(" ").slice(0, 2).join(" ")}</span>
                                </div>

                                <div className="card_body">
                                    <h3>{cat?.ad?.information?.title.substring(0, 18)}...</h3>
                                    <div className="card_meta">
                                        <div className="ciLocationOn">
                                            <CiLocationOn style={{ color: "var(--main-color)", fontSize: "12px" }} />
                                            <span>{cat?.ad?.user?.area || "غير محدد"}</span>
                                        </div>
                                        <div className="ciStopwatch">
                                            <CiStopwatch style={{ color: "var(--main-color)", fontSize: "12px" }} />
                                            <span>{timeSince(cat?.ad?.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card_footer">
                                    <div className="card_footer_price">
                                        <span>{cat?.ad?.information?.price} ر.س</span>
                                    </div>

                                    <div
                                        className="hart_icon"
                                        onClick={(e) => handleFavoriteClick(e, cat?.category, cat?.ad?.id_ads)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={22}
                                            height={22}
                                            viewBox="0 0 24 24"
                                            fill={favorites[cat?.ad?.id_ads] ? "red" : "none"}
                                            stroke={favorites[cat?.ad?.id_ads] ? "red" : "currentColor"}
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-heart"
                                        >
                                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showToast && (
                <ToastWarning
                    message="قم بتسجيل الدخول أولاً"
                    onClose={() => setShowToast(false)}
                />
            )}
        </section>
    );
}
