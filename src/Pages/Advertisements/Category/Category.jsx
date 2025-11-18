import React, { useRef } from 'react'
import "./Category.css";

export const categories = [
    { id: 1, key: "vehicles", name: "السيارات", icon: "./advertisements/car.svg", title: "السيارات وقطع الغيار", desc: "سيارات ومركبات وقطع غيار السيارات للبيع " },
    { id: 2, key: "realestate", name: "العقارات", icon: "./advertisements/buildings.svg", title: "العقارات", desc: "عقارات للبيع" },
    { id: 3, key: "electronics", name: "الإلكترونيات", icon: "./advertisements/electronics.svg", title: "الإلكترونيات", desc: "أجهزة وهواتف ومنتجات إلكترونية" },
    { id: 4, key: "jobs", name: "الوظائف", icon: "./advertisements/jobs.svg", title: "الوظائف", desc: "وظائف وفرص عمل" },
    { id: 5, key: "furniture", name: "الأثاث", icon: "./advertisements/furniture.svg", title: "الأثاث", desc: "أثاث منزلي ومكتبي للبيع" },
    { id: 6, key: "services", name: "الخدمات", icon: "./advertisements/services.svg", title: "الخدمات", desc: "خدمات متنوعة للأفراد والشركات" },
    { id: 7, key: "fashion", name: "الأزياء", icon: "./advertisements/fashion.svg", title: "الأزياء", desc: "ملابس وأحذية وإكسسوارات" },
    { id: 8, key: "food", name: "الأطعمة", icon: "./advertisements/food.svg", title: "الأطعمة", desc: "منتجات غذائية ومشروبات" },
    { id: 9, key: "anecdotes", name: "النوادر", icon: "./advertisements/anecdotes.svg", title: "النوادر", desc: "قطع نادرة وهوايات" },
    { id: 10, key: "gardens", name: "الحدائق", icon: "./advertisements/gardens.svg", title: "الحدائق", desc: "أدوات وزينة الحدائق" },
    { id: 11, key: "trips", name: "الرحلات", icon: "./advertisements/trips.svg", title: "الرحلات", desc: "رحلات سياحية وسفر" },
    { id: 12, key: "pets", name: "الحيوانات", icon: "./advertisements/animals.svg", title: "الحيوانات", desc: "حيوانات أليفة ومنتجاتها" },
];

export default function Category({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const bottomRef = useRef(null);
    return (
        <div className='category_main'>
            <div className="categories-container">
                <h2 className="title">اختر فئة الإعلان</h2>
                <p className="subtitle">حدد الفئة المناسبة لإعلانك</p>

                <div className="grid-container">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => {
                                setFieldValue("category", cat.key);
                                formik.setFieldError("category", "");
                                setTimeout(() => {
                                    bottomRef.current.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    });
                                }, 100);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && setFieldValue("category", cat.key)}
                            className={`categoryads_card ${values.category === cat.key ? "active_category" : ""}`}
                        >
                            <div className="icon"><img src={cat.icon} alt={cat.name} /></div>
                            <p>{cat.name}</p>
                        </div>
                    ))}
                </div>

                {errors.category && (
                    <div className="error">{errors.category}</div>
                )}
            </div>
            <div ref={bottomRef} />
        </div>
    )
};