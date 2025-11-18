import React, { useState } from "react";
import "./loginStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";

export default function Login() {

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src="/images/login.webp" alt="login" />
      </div>
      <div className="login-container">
        <h2>مرحبًا بك مجددًا</h2>
        <p>
          مرحبًا بك من جديد! قم بتسجيل الدخول إلى حسابك على ماشي لتتابع إعلاناتك
          المنشورة، وتدير منتجاتك أو خدماتك بسهولة.
        </p>

        <LoginForm />
        <p className="login_footer">
          ليس لديك حساب بعد؟ <Link to="/register">إنشاء حساب</Link>
        </p>
      </div>
    </div>
  );
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("بريد إلكتروني غير صالح")
        .required("البريد الإلكتروني مطلوب"),
      password: Yup.string()
        .required("كلمة المرور مطلوبة"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch(
          "https://api.maaashi.com/api/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        const apiSucceeded =
          response.ok &&
          (data.success === true ||
            data.status === true ||
            Boolean(data.token || data.data?.token));

        if (apiSucceeded) {
          setCookie("token", data, {
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
          navigate("/");
        } else if (data.errors) {
          const hasEmailError = data.errors.email;

          if (hasEmailError) {
            setErrorMessage("هذا البريد الإلكتروني غير مسجل ");
          } else {
            setErrorMessage("حدث خطأ أثناء التحقق من البيانات");
          }
        } else if (data.message) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("بيانات تسجيل الدخول غير صحيحة، حاول مرة أخرى.");
        }
      } catch (err) {
        setErrorMessage("حدث خطأ، حاول مرة أخرى");
      } finally {
        setIsLoading(false);
      }
    }
  });
  return (
    <form className="login_form" onSubmit={formik.handleSubmit}>
      <div className="email_input">
        <label htmlFor="email">
          <span>بريدك الإلكتروني</span>
          {formik.touched.email && formik.errors.email && (
            <p className="error_message">{formik.errors.email}</p>
          )}
        </label>
        <div className="input_container">
          <input
            type="email"
            name="email"
            placeholder="بريدك الإلكتروني"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <img src="/Icons/Auth/email.svg" alt="email" />
        </div>
      </div>

      <div className="password_input">
        <label htmlFor="password">
          <span>كلمة المرور</span>
          {formik.touched.password && formik.errors.password && (
            <p className="error_message">{formik.errors.password}</p>
          )}
        </label>
        <div className="password_input_container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="كلمة المرور"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="eye_icon" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}>
            {showPassword ?
              <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx={12} cy={12} r={3} /></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
            }
          </div>
        </div>
      </div>

      <div className="forgetPassword">
        <div className="rememberMe">
          <div className="rememberMe_section">
            <label className="rememberMe_label">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rememberMe_checkbox"
              />
            </label>
          </div>
          <p>تذكرني</p>
        </div>
        <div role="button">
          <Link to="/forgotPassword">نسيت كلمة المرور؟</Link>
        </div>
      </div>
      <button type="submit" className="login_button" disabled={isLoading}>
        {isLoading ? "جاري التحميل..." : "تسجيل دخول"}
      </button>

      {errorMessage && <p className="error_general">{errorMessage}</p>}
    </form>
  )
};