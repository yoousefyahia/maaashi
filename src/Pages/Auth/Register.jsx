import React, { useState } from "react";
import "./registerStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModdel, setShowModdel] = useState(false);

  const navigate = useNavigate();
  const closeModel = () => {
    setShowModdel(false);
    navigate("/settingsUser");
  };
  const [setCookie] = useCookies(["token"]);

  // Yup for validation
  const validationSchema = Yup.object({
    name: Yup.string().trim().required("الرجاء إدخال الاسم الكامل"),
    email: Yup.string()
      .email("بريد إلكتروني غير صالح")
      .required("الرجاء إدخال البريد الإلكتروني"),
    phone: Yup.string()
      .required("رقم الجوال مطلوب")
      .matches(
        /^(05\d{8}|\+?9665\d{8})$/,
        "يرجى إدخال رقم جوال سعودي صالح يبدأ بـ 05 أو 9665"
      ),
    password: Yup.string().required("الرجاء إدخال كلمة المرور"),
    password_confirmation: Yup.string()
      .required("الرجاء تأكيد كلمة المرور")
      .oneOf([Yup.ref("password"), null], "كلمات المرور غير متطابقة"),
  });

  // formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        // url from vite.config
        const response = await fetch(
          "https://api.maaashi.com/api/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok && data.success) {
          setIsLoading(false)
          setShowModdel(true);
          setCookie("token", data, {
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        } else if (data.errors) {
          const hasEmailError = data.errors.email;
          const hasPhoneError = data.errors.phone;

          if (hasEmailError && hasPhoneError) {
            setErrorMessage("هذا البريد الإلكتروني ورقم الجوال مستخدمان بالفعل");
          } else if (hasEmailError) {
            setErrorMessage("هذا البريد الإلكتروني مستخدم بالفعل");
          } else if (hasPhoneError) {
            setErrorMessage("رقم الجوال مستخدم بالفعل");
          } else {
            setErrorMessage("حدث خطأ أثناء التحقق من البيانات");
          }
        } else {
          setErrorMessage("حدث خطأ أثناء التسجيل، حاول مرة أخرى.");
        }
      } catch {
        setErrorMessage("حدث خطأ في الاتصال بالخادم، حاول مرة أخرى لاحقًا.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="register-container">
      <div className="register-box">
        {/* image */}
        <div className="register-image">
          <img src="/images/login.webp" alt="Register" />
        </div>

        {/* المحتوى */}
        <div className="register-content">
          <h2>إنشاء حساب جديد</h2>
          <p>
            سجّل حسابك الآن على ماشي لتتصفح الإعلانات بسهولة وتعرض منتجاتك أو
            خدماتك في المكان المناسب، بسرعة وأمان.
          </p>

          <form className="register_form" onSubmit={formik.handleSubmit}>
            <div className="name_input">
              <label htmlFor="name">
                <span>الاسم الكامل</span>
                {formik.touched.name && formik.errors.name && (
                  <p className="error_message">{formik.errors.name}</p>
                )}
              </label>
              <div className="input_container">
                <input
                  type="text"
                  name="name"
                  placeholder="الاسم الكامل"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <img src="/Icons/Auth/user.svg" alt="user" />
              </div>
            </div>

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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <img src="/Icons/Auth/email.svg" alt="email" />
              </div>
            </div>

            <div className="phone_input">
              <label htmlFor="phone">
                <span>رقم الجوال</span>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="error_message">{formik.errors.phone}</p>
                )}
              </label>
              <div className="input_container">
                <input
                  type="tel"
                  name="phone"
                  placeholder="05xxxxxxxx أو +9665xxxxxxxx"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <img src="/Icons/Auth/phone.svg" alt="phone" />
              </div>
            </div>

            <div className="two_password">
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
                  <div className="eye_password_icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx={12} cy={12} r={3} /></svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                    }
                  </div>
                </div>
              </div>

              <div className="confirmPassword_input">
                <label htmlFor="password_confirmation">
                  <span>تأكيد كلمة المرور</span>
                  {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                    <p className="error_message">{formik.errors.password_confirmation} </p>
                  )}
                </label>
                <div className="password_input_container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    placeholder="تأكيد كلمة المرور"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="eye_icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx={12} cy={12} r={3} /></svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                    }
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="regis_button"
              disabled={isLoading}
            >
              {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
            </button>
            {errorMessage && <p className="error_general">{errorMessage}</p>}
          </form>
          <p className="register-footer">
            هل لديك حساب بالفعل؟ <Link to="/login">تسجيل دخول</Link>
          </p>
        </div>
      </div>

      {/* موديل النجاح */}
      {showModdel && (
        <div className="success_model">
          <div className="success_content">
            <h3>تم إنشاء الحساب بنجاح!</h3>
            <p>يمكنك الآن تسجيل الدخول إلى حسابك.</p>
            <button onClick={closeModel}>متابعة</button>
          </div>
        </div>
      )}
    </div>
  );
};