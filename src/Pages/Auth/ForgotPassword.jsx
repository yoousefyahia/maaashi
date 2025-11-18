// src/Components/ForgotPassword/ForgotPassword.jsx
import "./forgotPassword.css";
import { CgMail } from "react-icons/cg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* العنوان */}
        <h2 className="login-title">تحقق من الكود</h2>
        {/* صندوق التحقق */}
        <div className="verify-box">
          <CgMail className="verify-icon" />
          <p className="verify-text">
            أدخل رمز التحقق المرسل إلى: <b>a*****@gmail.com</b>
          </p>
        </div>
        {/* الفورم */}
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">بريدك الإلكتروني</label>
            <input
              id="email"
              type="email"
              placeholder="ادخل بريدك الإلكتروني"
              required
            />
          </div>
          <button type="submit" className="for-button">
            تأكيد الرمز
          </button>
        </form>
        {/* الفوتر */}
        <div className="login-footer">
          <Link to="/resetPassword" className="footer-link">
            إرسال الرمز
          </Link>
          <br />
          <Link to="/contact" className="footer-link">
            تواجه مشكلة؟ تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
