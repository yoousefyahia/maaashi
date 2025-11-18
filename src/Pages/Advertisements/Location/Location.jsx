import React, { useEffect, useRef, useState } from 'react';
// import "./Location.css";

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

export default function Location({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;

    const [isOpenRegion, setIsOpenRegion] = useState(false);
    const [isOpenCity, setIsOpenCity] = useState(false);

    const RegionDropdownRef = useRef(null);
    const cityDropdownRef = useRef(null);

    const handleSelectRegion = () => {
        setFieldValue("location.city", "");
        setIsOpenRegion(false);
    };

    const handleSelectCity = (city) => {
        setFieldValue("location.city", city);
        setIsOpenCity(false);
    };

    const filteredRegions = saudiRegions.filter((region) => region.region.includes(values.location.area));

    const selectedRegion = saudiRegions.find((region) => region.region === values.location.area);

    const filteredCities = selectedRegion?.cities.filter(city => city.includes(values.location.city)) || [];

    useEffect(() => {
        const handleClickOutsideRegion = (event) => {
            if (RegionDropdownRef.current && !RegionDropdownRef.current.contains(event.target)) {
                setIsOpenRegion(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideRegion);

        const handleClickOutsideCity = (event) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setIsOpenCity(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideCity);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideRegion);
            document.removeEventListener("mousedown", handleClickOutsideCity);
        };
    }, []);
    
    return (
        <div className="location_container">
            <div className="location_header">
                <h3>الموقع</h3>
                <p>حدد موقع الإعلان</p>
            </div>

            <div className="input_container">
                <label htmlFor="detailedAddress">العنوان بالتفصيل*
                    {errors.location?.detailedAddress && touched.location?.detailedAddress && (
                        <div className="info_error">{errors.location?.detailedAddress}</div>
                    )}
                </label>
                <input
                    type="text"
                    name="location.detailedAddress"
                    value={values.location.detailedAddress}
                    onChange={(e) => setFieldValue("location.detailedAddress", e.target.value)}
                    onBlur={handleBlur}
                    id="detailedAddress"
                    className='detailedAddress_input input'
                    placeholder='الرياض - الخرج - اليمامة - حي النسيم'
                />
            </div>

            <div className="input_container" ref={RegionDropdownRef}>
                <label htmlFor="area">المنطقة*
                    {errors?.location?.area && touched?.location?.area && (
                        <div className="info_error">{errors?.location?.area}</div>
                    )}
                </label>
                <div className="area_input">
                    <input
                        type="text"
                        name="location.area"
                        value={values.location.area}
                        onClick={() => setIsOpenRegion(true)}
                        onChange={(e) => setFieldValue("location.area", e.target.value)}
                        // onBlur={handleBlur}
                        id="area"
                        className='input'
                        placeholder='ادخل منطقتك'
                    />
                    <img src="./advertisements/CaretDown.svg" alt="CaretDown" />

                    {isOpenRegion && filteredRegions.length > 0 && (
                        <ul className='region_option'>
                            {filteredRegions.map(region => (
                                <li key={region.id} onClick={() => { handleSelectRegion(); setFieldValue("location.area", region.region); }}>{region.region}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="input_container" ref={cityDropdownRef}>
                <label htmlFor="city">المدينة*
                    {errors.location?.city && touched?.location?.city && (
                        <div className="info_error">{errors.location?.city}</div>
                    )}
                </label>
                <div className="city_input">
                    <input
                        type="text"
                        name="location.city"
                        value={values.location.city}
                        onClick={() => setIsOpenCity(true)}
                        onChange={(e) => setFieldValue("location.city", e.target.value)}
                        // onBlur={handleBlur}
                        id="city"
                        className='input'
                        placeholder='ادخل االمدينة'
                    />
                    <img src="./advertisements/CaretDown.svg" alt="CaretDown" />

                    {isOpenCity && filteredCities?.length > 0 && (
                        <ul className='city_option'>
                            {filteredCities.map((city, id) => (
                                <li key={id} onClick={() => { handleSelectCity(city); setFieldValue("location.city", city) }}>{city}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
