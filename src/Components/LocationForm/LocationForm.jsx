import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import "./locationFormStyle.css";
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../utils/auth';

export const saudiRegions = [
    {
        id: 1,
        region: "الرياض",
        cities: ["الخرج", "الدرعية", "الدوادمي", "المجمعة", "القويعية", "وادي الدواسر", "الزلفي", "شقراء", "الأفلاج", "الغاط", "عفيف", "حوطة بني تميم", "الحريق", "السليل", "ضرماء", "المزاحمية", "ثادق", "رماح", "حريملاء", "مرات", "الدلم"]
    },
    {
        id: 2,
        region: "مكة المكرمة",
        cities: ["جدة", "الطائف", "القنفذة", "رابغ", "الليث", "الجموم", "خليص", "الكامل", "الخرمة", "رنية", "تربة", "المويه", "أضم", "ميسان", "بحرة"]
    },
    {
        id: 3,
        region: "المدينة المنورة",
        cities: ["المدينة المنورة", "ينبع", "العلا", "خيبر", "بدر", "الحناكية", "المهد", "العيص", "وادي الفرع", "الرايس"]
    },
    {
        id: 4,
        region: "القصيم",
        cities: ["بريدة", "عنيزة", "الرس", "المذنب", "البدائع", "البكيرية", "الأسياح", "رياض الخبراء", "عيون الجواء", "الشماسية"]
    },
    {
        id: 5,
        region: "المنطقة الشرقية",
        cities: ["الدمام", "الخبر", "الأحساء", "القطيف", "الجبيل", "رأس تنورة", "الخفجي", "النعيرية", "بقيق", "حفر الباطن"]
    },
    {
        id: 6,
        region: "عسير",
        cities: ["أبها", "خميس مشيط", "محايل عسير", "النماص", "تنومة", "رجال ألمع", "بيشة", "تثليث", "ظهران الجنوب", "سراة عبيدة"]
    },
    {
        id: 7,
        region: "تبوك",
        cities: ["تبوك", "الوجه", "أملج", "ضباء", "حقل", "تيماء", "البدع", "شرما", "المويلح", "المغاربة"]
    },
    {
        id: 8,
        region: "حائل",
        cities: ["حائل", "بقعاء", "الغزالة", "الشنان", "الحائط", "الشملي", "موقق", "السليمي", "سميراء", "تربه"]
    },
    {
        id: 9,
        region: "الحدود الشمالية",
        cities: ["عرعر", "رفحاء", "طريف", "العويقيلة", "شعبة نصاب", "الهباس", "جديدة عرعر", "الدويد", "أم خنصر", "الحيانية"]
    },
    {
        id: 10,
        region: "جازان",
        cities: ["جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "الدرب", "فرسان", "العارضة", "الريث", "فيفاء"]
    },
    {
        id: 11,
        region: "نجران",
        cities: ["نجران", "شرورة", "حبونا", "بدر الجنوب", "يدمة", "ثار", "الخرخير", "خباش", "المشعلية", "رجلا"]
    },
    {
        id: 12,
        region: "الباحة",
        cities: ["الباحة", "بلجرشي", "المندق", "المخواة", "قلوة", "العقيق", "القرى", "بني حسن", "غامد الزناد", "الحجرة"]
    },
    {
        id: 13,
        region: "الجوف",
        cities: ["سكاكا", "القريات", "دومة الجندل", "طبرجل", "الفياض", "ميقوع", "الرديفة", "عين الحواس", "الطوير", "الشويحطية"]
    }
];

export default function LocationForm() {
    const [cookies] = useCookies(["token"]);
    const { token, user } = parseAuthCookie(cookies?.token);
    const userID = user?.id;
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!userID || !token) return;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://api.maaashi.com/api/user/${userID}`, {
                    method: "get",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserData(data.data);
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchUserData();
    }, [userID, token]);

    const [isLoading, setIsLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const areaInputRef = useRef(null);
    const RegionDropdownRef = useRef(null);
    const cityDropdownRef = useRef(null);

    const [isOpenRegion, setIsOpenRegion] = useState(false);
    const [isOpenCity, setIsOpenCity] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            location: userData?.location || "",
            area: userData?.area || "",
            city: userData?.city || "",
        },
        validationSchema: Yup.object({
            location: Yup.string().required("العنوان بالتفصيل مطلوب").min(5, "العنوان قصير جدًا"),
            area: Yup.string().required("المنطقة مطلوبة"),
            city: Yup.string().required("المدينة مطلوبة"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!isEditMode) return;
            setIsLoading(true);
            setServerMessage(null);

            try {
                const res = await axios.post(
                    "https://api.maaashi.com/api/complete-location",
                    values,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServerMessage("تم حفظ الموقع بنجاح!");
                setIsEditMode(false);
            } catch (err) {
                setServerMessage(err.response?.data?.message || "حدث خطأ أثناء حفظ الموقع");
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

    const selectedRegion = saudiRegions.find((r) => r.region === values.area);
    const filteredRegions = saudiRegions.filter((r) => r.region.includes(values.area));
    const filteredCities = selectedRegion?.cities.filter((c) => c.includes(values.city)) || [];

    // الزرار يشتغل بس لو البيانات اتغيرت
    const isModified =
        !userData?.area ||
        values.area !== userData?.area ||
        values.city !== userData?.city ||
        values.location !== userData?.location;

    useEffect(() => {
        const closeDropdowns = (e) => {
            if (RegionDropdownRef.current && !RegionDropdownRef.current.contains(e.target))
                setIsOpenRegion(false);
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target))
                setIsOpenCity(false);
        };
        document.addEventListener("mousedown", closeDropdowns);
        return () => document.removeEventListener("mousedown", closeDropdowns);
    }, []);

    const handleSelectRegion = (region) => {
        setFieldValue("area", region);
        setFieldValue("city", "");
        setIsOpenRegion(false);
    };
    const handleSelectCity = (city) => {
        setFieldValue("city", city);
        setIsOpenCity(false);
    };

    return (
        <form className="location_container" onSubmit={(e) => e.preventDefault()}>
            <div className="location_header">
                <h3>الموقع</h3>
            </div>

            {/* area */}
            <div className="area_input">
                <header>
                    <span>المنطقة*</span>
                    {errors.area && touched.area && isEditMode && <div className="info_error">{errors.area}</div>}
                </header>
                <div className="input_container" ref={RegionDropdownRef}>
                    <input
                        ref={areaInputRef}
                        type="text"
                        name="area"
                        id="area"
                        value={values.area}
                        onClick={() => isEditMode && setIsOpenRegion(true)}
                        onChange={(e) => setFieldValue("area", e.target.value)}
                        placeholder={userData?.area ? "" : "اختر المنطقة"}
                        disabled={!isEditMode}
                        className={`input ${!isEditMode ? "readonly" : ""}`}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} opacity={isEditMode ? 1 : .5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                    {isOpenRegion && (
                        <ul className="region_option">
                            {filteredRegions.map((region) => (
                                <li key={region.id} onClick={() => handleSelectRegion(region.region)}>
                                    {region.region}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* city */}
            <div className="city_input">
                <header>
                    <span>المدينة*</span>
                    {errors.city && touched.city && isEditMode && <div className="info_error">{errors.city}</div>}
                </header>
                <div className="input_container" ref={cityDropdownRef}>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={values.city}
                        onClick={() => isEditMode && setIsOpenCity(true)}
                        onChange={(e) => setFieldValue("city", e.target.value)}
                        placeholder={userData?.city ? "" : "اختر المدينة"}
                        disabled={!isEditMode}
                        className={`input ${!isEditMode ? "readonly" : ""}`}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} opacity={isEditMode ? 1 : .5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                    {isOpenCity && values.area && (
                        <ul className="city_option">
                            {filteredCities.map((city, i) => (
                                <li key={i} onClick={() => handleSelectCity(city)}>
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* location */}
            <div className="location_input">
                <header>
                    <span>العنوان بالتفصيل*</span>
                    {errors.location && touched.location && isEditMode && (
                        <div className="info_error">{errors.location}</div>
                    )}
                </header>
                <div className="input_container">
                    <input
                        type="text"
                        name="location"
                        id="location"
                        value={values.location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={userData?.location ? "" : "المنطقة - المدينة - الحي - الشارع"}
                        disabled={!isEditMode}
                        className={`input ${!isEditMode ? "readonly" : ""}`}
                    />
                </div>
            </div>

            {/* two buttons */}
            <div className="two_buttons">
                {isEditMode && (
                    <button
                        type="button"
                        className="cancel_button"
                        onClick={() => {
                            setFieldValue("area", userData?.area || "");
                            setFieldValue("city", userData?.city || "");
                            setFieldValue("location", userData?.location || "");

                            setIsEditMode(false);

                            // close any Dropdown 
                            setIsOpenRegion(false);
                            setIsOpenCity(false);
                        }}
                    >
                        الغاء
                    </button>
                )}

                <button
                    type="button"
                    className="submit_btn"
                    disabled={isLoading || (isEditMode && !isModified)}
                    onClick={() => {
                        if (!isEditMode) {
                            setIsEditMode(true);
                            setTimeout(() => areaInputRef.current?.focus(), 0);
                        } else {
                            handleSubmit();
                        }
                    }}
                >
                    {isLoading ? <div className="spinnerLoader"/> : isEditMode ? "حفظ" : (!userData?.area ? "أضف عنوان" : "تعديل")}
                </button>
            </div>

            {serverMessage && <p className="server_message">{serverMessage}</p>}
        </form>
    );
};