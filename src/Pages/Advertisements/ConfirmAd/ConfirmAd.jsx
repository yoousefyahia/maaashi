import React, { useEffect, useState } from 'react';
import "./ConfirmAd.css";

export default function ConfirmAd({ formik, isLoading, errorMessage }) {
    const { values, handleSubmit, setFieldValue } = formik;
    const [userData, setUserData] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://api.maaashi.com/api/categories");
                const data = await res.json();
                setCategories(data?.data || []);
            } catch (err) {
                console.log("Error loading categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (values.category && categories.length > 0) {
            const selectedCat = categories.find((cat) => cat.id == values.category);
            setCategoryName(selectedCat ? selectedCat.name : "اسم الفئة");
        }
    }, [values.category, categories]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await fetch(`https://api.maaashi.com/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setUserData(data?.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="confirmAd_container">
            <header className='confirmAd_header'>
                <h3>مراجعة الإعلان</h3>
                <p>راجع إعلانك قبل نشره</p>
            </header>

            <div className="information_ad">
                <ul className='info_list'>
                    <li><h4>القسم/الفئة:</h4><p>{categoryName || "اسم الفئة"}</p></li>
                    <li><h4>عنوان الإعلان:</h4><p>{values?.information?.adTitle}</p></li>
                    <li><h4>السعر:</h4><p>{values?.information?.adPrice} ريال سعودي</p></li>
                    <li><h4>عدد الصور:</h4><p>{values?.images.length}</p></li>
                    <li><h4>الموقع:</h4><p>{userData?.area || userData?.location || "غير محدد"}</p></li>
                    <li><h4>البائع:</h4><p>{userData?.name}</p></li>
                    <li><h4>رقم الهاتف:</h4><p>{userData?.phone}</p></li>
                </ul>
            </div>

            <div className="fee_agreement">
                <label className="terms_label">
                    <input
                        type="checkbox"
                        name="feeAgreement"
                        checked={values.feeAgreement || false}
                        onChange={(e) => setFieldValue("feeAgreement", e.target.checked)}
                    />
                </label>
                <div className="text">
                    <p>اتعهد واقسم بالله أنا المعلن أن أدفع رسوم الموقع وهي 1% من قيمة البيع.</p>
                </div>
            </div>

            <div className="featured">
                <label className="featured_label">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={values.featured || false}
                        onChange={(e) => setFieldValue("featured", e.target.checked)}
                    />
                </label>
                <div className="text">
                    <p>أريد تمييز الإعلان</p>
                </div>
            </div>

            {values.feeAgreement &&
                <div className="btn_confirmAd">
                    <button
                        type='button'
                        className='btn'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        <span>انشر إعلانك الآن</span>
                        <img src="./advertisements/Plus.svg" alt="Plus" />
                    </button>
                </div>
            }

            {errorMessage && <div className="error_message">{errorMessage}</div>}

            <div className="modal_fade" style={{ display: isLoading ? "flex" : "none" }}>
                <div className="loader" />
            </div>
        </div>
    );
}
