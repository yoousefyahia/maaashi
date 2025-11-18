import React, { useEffect, useState } from 'react';
import "./ConfirmAd.css";
import { categories } from '../Category/Category';
import { useCookies } from 'react-cookie';

export default function ConfirmAd({ formik, isLoading }) {
    const { values } = formik;
    const category = categories.find((cat) => values?.category === cat.key) || "اسم الفئة";
    const [cookies] = useCookies(["token"]);
    const userID = cookies?.token?.data?.user?.id;
    const token = cookies?.token?.data?.token;
    const [userData, setUserData] = useState({});
    console.log(userData?.area);

    useEffect(() => {
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
                setUserData(data?.data);
            } catch (err) {
                console.log(); (err.message);
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
                    <li>
                        <h4>القسم/الفئة:</h4>
                        <p>{category?.name}</p>
                    </li>
                    <li>
                        <h4>عنوان الإعلان:</h4>
                        <p>{values?.information?.adTitle}</p>
                    </li>
                    <li>
                        <h4>السعر:</h4>
                        <p>{values?.information?.adPrice} ريال سعودي</p>
                    </li>
                    <li>
                        <h4>عدد الصور:</h4>
                        <p>{values?.images.length}</p>
                    </li>
                    <li>
                        <h4>الموقع:</h4>
                        <p>{userData?.area}</p>
                    </li>
                    <li>
                        <h4>البائع:</h4>
                        <p>{values?.seller?.name}</p>
                    </li>
                </ul>
            </div>

            {/* إتفاقية الرسوم*/}
            <div className="fee_agreement">
                <div className="terms_section">
                    <label className="terms_label">
                        <input
                            type="checkbox"
                            name="feeAgreement"
                            id="feeAgreement"
                            checked={values.feeAgreement || false}
                            onChange={(e) => formik.setFieldValue("feeAgreement", e.target.checked)}
                            className="terms_checkbox"
                        />
                    </label>
                </div>

                <div className="text">
                    <p>اتعهد واقسم بالله أنا المعلن أن أدفع رسوم الموقع وهي 1% من قيمة البيع سواء تم البيع عن طريق الموقع أو بسببه.</p>
                    <p>كما أتعهد بدفع الرسوم خلال 10 أيام من استلام كامل مبلغ المبايعة.</p>
                </div>
            </div>
            
            <div className="featured">
                <div className="featured_section">
                    <label className="featured_label">
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={values.featured || false}
                            onChange={(e) => formik.setFieldValue("featured", e.target.checked)}
                            className="featured_checkbox"
                        />
                    </label>
                </div>
                <div className="text">
                    <p>أريد تمييز الإعلان</p>
                    <p>يمكنك تمييز إعلانك لزيادة فرص ظهوره للمستخدمين وتحقيق مبيعات أسرع.</p>
                </div>
            </div>

            {values.feeAgreement && (
                <div className="btn_confirmAd">
                    <button type='submit' className='btn'>
                        <span>انشر إعلانك الأن</span>
                        <img src="./advertisements/Plus.svg" alt="Plus" />
                    </button>
                    <p>بنشر إعلانك، أنت توافق على سياسة الاستخدام وشروط الخدمة</p>
                </div>
            )}

            <div className="modal_fade" style={{ display: isLoading ? "flex" : "none" }}>
                <div className="loader" />
            </div>

        </div>
    )
};