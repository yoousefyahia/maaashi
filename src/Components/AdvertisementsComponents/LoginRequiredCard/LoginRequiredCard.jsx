import React from 'react';
import "./LoginRequiredCard.css"
import { Link } from 'react-router-dom';

export default function LoginRequiredCard() {
    return (
        <div className='loginRequiredCard'>
            <div className="top_line"/>
            <div className="card">
                <div className="img_wrapper">
                    <img src="./images/unauthenticated.webp" alt="LoginRequiredCard" />
                </div>

                <div className="">
                    {/* text */}
                    <h2 className="title">تسجيل الدخول مطلوب</h2>
                    <p className="subtitle">
                        "لإضافة عرض جديد، سجل دخولك أولاً أو أنشئ حساب جديد"
                    </p>

                    {/* button */}
                    <Link to="/login" className="btn_login">تسجيل دخول</Link>
                    <Link to="/register" className="btn_register">إنشاء حساب</Link>
                </div>
            </div>
        </div>
    )
}
