import React from "react";
import "./notFoundStyle.css";

export default function NotFound() {
    return (
        <div className="dead-container">
            <div className="dead-card">
                <div className="dead-icon">☁️</div>
                <h1 className="dead-title">لا يمكن الاتصال بالخادم</h1>
                <p className="dead-text">
                    يبدو أن هناك مشكلة في الاتصال بالخادم الآن.<br />
                    يرجى التحقق من اتصالك بالإنترنت أو المحاولة لاحقًا.
                </p>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                    🔄 إعادة المحاولة
                </button>
            </div>
            <p className="dead-footer">
                © {new Date().getFullYear()} ماشي — جميع الحقوق محفوظة
            </p>
        </div>
    );
};