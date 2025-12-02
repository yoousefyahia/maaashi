import React, { useEffect, useRef, useState } from 'react';
import { CiLocationOn, CiStopwatch } from 'react-icons/ci';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { attributesMap } from '../../data';
import SaudiRegionsDropdown from '../../Components/AdvertisementsComponents/SaudiRegionsDropdown/SaudiRegionsDropdown';
import SkeletonCard from '../../Components/SkeletonCard/SkeletonCard';
import "./specificCategoryStyle.css";
import DatePicker from '../../Components/DatePicker/DatePicker';
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../utils/auth';

export default function SpecificCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryName, setCategoryName] = useState("اسم الفئة");
    
    // التوكن
    const [cookies] = useCookies(["token"]);
    const authData = parseAuthCookie(cookies?.token);
    const token = authData?.token;
    
    // جلب اسم الفئة
    useEffect(() => {
        if (id) {
            const fetchCategoryName = async () => {
                try {
                    const response = await fetch('https://api.maaashi.com/api/categories');
                    const data = await response.json();
                    if (data?.data && Array.isArray(data.data)) {
                        const foundCategory = data.data.find(cat => cat.id == id);
                        if (foundCategory) {
                            setCategoryName(foundCategory.name);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching category name:', error);
                }
            };
            fetchCategoryName();
        }
    }, [id]);

    const [date, setDate] = useState("");
    const [filteredAttributes, setFilteredAttributes] = useState(null);
    const [attributeValue, setAttributeValue] = useState("");
    const [region, setRegion] = useState("");
    const [city, setCity] = useState("");
    const searchInputRef = useRef(null);
    const [searchInput, setSearchInput] = useState("");

    const [showToast, setShowToast] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    // البحث الفوري عند الكتابة
    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchButton();
        }
    };

    const handleSearchButton = () => {
        const value = searchInputRef.current.value.trim();
        setSearchInput(value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!id) return;

        const fetchCategoryData = async () => {
            try {
                setIsLoading(true);
                setServerError(false);
                setErrorMessage(false);
                
                const response = await fetch(`https://api.maaashi.com/api/ads/category?category_id=${id}`);
                
                if (!response.ok) {
                    throw new Error(`خطأ في السيرفر: ${response.status}`);
                }
                
                const data = await response.json();
                
                let adsData = [];
                
                if (Array.isArray(data)) {
                    adsData = data;
                } else if (data?.data && Array.isArray(data.data)) {
                    adsData = data.data;
                }
                
                if (adsData.length > 0) {
                    const initialFavorites = {};
                    adsData.forEach(ad => {
                        initialFavorites[ad.id] = ad.is_liked || false;
                    });
                    setFavorites(initialFavorites);
                    setCategoryData(adsData);
                } else {
                    setCategoryData([]);
                }
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
                setServerError(true);
                setErrorMessage(true);
                setCategoryData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryData();
    }, [id]);

    const toggleFavorite = (adId) => {
        setFavorites((prev) => ({
            ...prev,
            [adId]: !prev[adId],
        }));
    };

    const addToFavorites = async (adId) => {
        if (!token) {
            setShowToast(true);
            return;
        }
        
        try {
            setIsFavoriteLoading(true);
            
            const response = await fetch(`https://api.maaashi.com/api/favorites`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ad_id: adId
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                toggleFavorite(adId);
                console.error('Error adding to favorites:', data);
            }
        } catch (error) {
            console.error("Error adding to favorites:", error);
            toggleFavorite(adId);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const removeFromFavorites = async (adId) => {
        if (!token) {
            setShowToast(true);
            return;
        }
        
        try {
            setIsFavoriteLoading(true);
            
            const response = await fetch(`https://api.maaashi.com/api/favorites/${adId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                console.error('Error removing from favorites:', data);
            }
        } catch (error) {
            console.error("Error removing from favorites:", error);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleFavoriteClick = (e, adID) => {
        e.stopPropagation();
        
        if (!token) {
            setShowToast(true);
            return;
        }
        
        const isCurrentlyFavorite = favorites[adID];
        
        toggleFavorite(adID);
        
        if (isCurrentlyFavorite) {
            removeFromFavorites(adID);
        } else {
            addToFavorites(adID);
        }
    };

    // دالة لمسح جميع الفلاتر
    const clearAllFilters = () => {
        setSearchInput("");
        setRegion("");
        setCity("");
        setDate("");
        setFilteredAttributes(null);
        setAttributeValue("");
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    };

    // فلترة البيانات
    const filteredData = React.useMemo(() => {
        let result = [...categoryData];
        
        if (date) {
            result = result.filter(item => item.created_at && item.created_at.split("T")[0] === date);
        }
        
        if (filteredAttributes && attributeValue) {
            result = result.filter(item => item.attributes && item.attributes[filteredAttributes] === attributeValue);
        }
        
        if (region && region !== "كل المناطق") {
            result = result.filter(item => item?.user?.area === region);
        }
        
        if (city && city !== "كل المدن") {
            result = result.filter(item => item?.user?.city === city);
        }
        
        if (searchInput.trim()) {
            result = result.filter(item => 
                item?.title?.toLowerCase().includes(searchInput.toLowerCase().trim())
            );
        }
        
        return result;
    }, [categoryData, date, filteredAttributes, attributeValue, region, city, searchInput]);

    const handleRetry = () => {
        setServerError(false);
        window.location.reload();
    };

    // تحقق إذا كانت جميع الفلاتر مفعلة
    const isAllFiltersActive = !filteredAttributes && !region && !city && !date && !searchInput;

    return (
        <div className='categoryData_container'>
            {isLoading && (
                <div className='isLoading'>
                    <p>جاري تحميل الإعلانات...</p>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}
            
            {!isLoading && serverError && (
                <div className="server-error-message">
                    <div className="error-content">
                        <h3>لا يمكن الاتصال بالخادم</h3>
                        <p>يبدو أن هناك مشكلة في الاتصال بالخادم الآن.<br />
                        يجب التحقق من اتصالك بالإنترنت أو المحاولة لاحقاً.</p>
                        <button className="retry-button" onClick={handleRetry}>
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            )}
            
            {!isLoading && !serverError && (
                <>
                    <section className='top_section'>
                        <div className="top_section_container">
                            <div className="categoryData_links">
                                <Link to="/" className="main_link">الرئيسيه </Link>
                                <IoIosArrowBack className='arr_icon' />
                                <span className="category_link">{categoryName}</span>
                            </div>

                            <div className="categoryData_header">
                                <div className="search_input">
                                    <input
                                        type="search"
                                        name="searchByTitle"
                                        ref={searchInputRef}
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleSearchKeyDown}
                                        id="searchByTitle"
                                        placeholder={`ابحث في ${categoryName}...`}
                                    />
                                    <button type='button' onClick={handleSearchButton}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx={11} cy={11} r={8} /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="attributes_map">
                                <button
                                    className={isAllFiltersActive ? "attri_btn_active" : ""}
                                    onClick={clearAllFilters}
                                >
                                    عرض الكل
                                </button>
                                {attributesMap[id]?.data?.map((item, index) => (
                                    <button
                                        key={index}
                                        className={filteredAttributes === attributesMap[id]?.key && attributeValue === item ? "attri_btn_active" : ""}
                                        onClick={() => { 
                                            if (attributesMap[id]?.key) {
                                                setFilteredAttributes(attributesMap[id].key); 
                                                setAttributeValue(item); 
                                            }
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <div className="data_Region">
                                <SaudiRegionsDropdown setRegion={setRegion} setCity={setCity} />
                                <div className="date-picker">
                                    <DatePicker onChange={(value) => setDate(value)} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='bottom_section_categoryData'>
                        <div className="bottom_section_categoryData_header">
                            <div>وجدنا لك <strong style={{color: 'var(--main-color)'}}>{filteredData.length}</strong> خيارًا</div>
                            {!isAllFiltersActive && (
                                <button 
                                    className="clear-filters-btn"
                                    onClick={clearAllFilters}
                                    style={{marginRight: '10px', fontSize: '14px', padding: '5px 10px'}}
                                >
                                    ✕ مسح الفلاتر
                                </button>
                            )}
                        </div>
                        <div className="categories_items">
                            {filteredData.length === 0 ? (
                                <div className="no-results">
                                    {categoryData.length === 0 ? (
                                        <div className="empty-state">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                            </svg>
                                            <h3>لا توجد إعلانات حالياً</h3>
                                            <p>لم يتم إضافة إعلانات في قسم {categoryName} بعد.</p>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                            <h3>لا توجد نتائج</h3>
                                            <p>لا توجد إعلانات تطابق معايير البحث المحددة.</p>
                                            <button 
                                                className="clear-filters-btn"
                                                onClick={clearAllFilters}
                                            >
                                                مسح جميع الفلاتر
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                filteredData.map((cat) => (
                                    <div key={cat.id} className="category_card" onClick={() => navigate(`/ad/${cat.id}`)}>
                                        <div className="card_image">
                                            <img 
                                                src={cat.images?.[0] || "/placeholder.png"} 
                                                alt={cat?.title || 'إعلان'} 
                                                onError={(e) => {
                                                    e.target.src = "/placeholder.png";
                                                }}
                                            />
                                        </div>

                                        <div className="card_user" onClick={(e) => { e.stopPropagation(); navigate(`/user/${cat?.seller_name}/${cat?.user?.id}`) }}>
                                            {cat.user?.image_profile ? (
                                                <img src={cat.user.image_profile} alt="user" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round">
                                                    <path d="M18 20a6 6 0 0 0-12 0" />
                                                    <circle cx={12} cy={10} r={4} />
                                                    <circle cx={12} cy={12} r={10} />
                                                </svg>
                                            )}
                                            <span>{cat.seller_name?.split(" ").slice(0, 2).join(" ") || "مستخدم"}</span>
                                        </div>

                                        <div className="card_body">
                                            <h3>{cat?.title?.substring(0, 18) || "بدون عنوان"}...</h3>
                                            <div className="card_meta">
                                                <div className="ciLocationOn">
                                                    <CiLocationOn style={{ color: "var(--main-color)", fontSize: "12px", fontWeight: "bold" }} />
                                                    <span>{cat?.user?.area || "غير محدد"}</span>
                                                </div>
                                                <div className="ciStopwatch">
                                                    <CiStopwatch style={{ color: "var(--main-color)", fontSize: "12px", fontWeight: "bold" }} />
                                                    <span>{cat.created_at ? timeSince(cat.created_at) : "غير محدد"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card_footer">
                                            <div className="card_footer_price">
                                                <span>{cat?.price || "0"} ر.س</span>
                                            </div>
                                            <div className="hart_icon" onClick={(e) => handleFavoriteClick(e, cat.id)}>
                                                {isFavoriteLoading ? (
                                                    <span style={{fontSize: '12px'}}>...</span>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill={favorites[cat.id] ? "red" : "none"} stroke={favorites[cat.id] ? "red" : "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart">
                                                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </>
            )}
            
            {/* رسالة التسجيل */}
            {showToast && (
                <div className="toast-warning-overlay">
                    <div className="toast-warning">
                        <div className="toast-content">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <div className="toast-text">
                                <strong>يجب تسجيل الدخول</strong>
                                <p>قم بتسجيل الدخول أولاً لإضافة الإعلانات إلى المفضلة</p>
                            </div>
                            <button 
                                className="toast-close"
                                onClick={() => setShowToast(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="toast-actions">
                            <button 
                                className="toast-login-btn"
                                onClick={() => {
                                    setShowToast(false);
                                    navigate('/login');
                                }}
                            >
                                تسجيل الدخول
                            </button>
                            <button 
                                className="toast-cancel-btn"
                                onClick={() => setShowToast(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// تحويل الأرقام للعربي
function toArabicNumbers(number) {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number.toString().split("").map(d => arabicNumbers[d] || d).join("");
}

// تحويل الوقت منذ تاريخ
export function timeSince(dateString) {
    if (!dateString) return "غير محدد";
    
    const now = new Date();
    const past = new Date(dateString.replace(" ", "T"));
    const dateOnly = dateString.split("T")[0];
    const diff = now - past;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 3) return dateOnly;
    if (days > 0) return `${toArabicNumbers(days)} يوم`;
    if (hours > 0) return `${toArabicNumbers(hours)} ساعة`;
    if (minutes > 0) return `${toArabicNumbers(minutes)} دقيقة`;
    return `${toArabicNumbers(seconds)} ثانية`;
}