import React, { useState } from 'react';
import AddHeader from '../../Components/AdvertisementsComponents/AddHeader/AddHeader';
import Category from './Category/Category';
import './style.css';
import Information from './Information/Information';
import UploadImages from './UploadImages/UploadImages';
import SellerData from './SellerData/SellerData';
import ConfirmAd from './ConfirmAd/ConfirmAd';
import { validationSchemas } from "./validationSchemas";
import { useFormik } from 'formik';
import axios from "axios";
import { useCookies } from "react-cookie";
import LoginRequiredCard from '../../Components/AdvertisementsComponents/LoginRequiredCard/LoginRequiredCard';
import { Link, useNavigate } from 'react-router-dom';
import { parseAuthCookie } from '../../utils/auth';
import { toast } from 'react-hot-toast'; 

export default function Advertisements() {
    const [cookies] = useCookies(["token"]);
    const navigate = useNavigate();
    const { token, user } = parseAuthCookie(cookies?.token);

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [stepError, setStepError] = useState(""); // هنا هنعرض أي خطأ للمستخدم
    const [successMessage, setSuccessMessage] = useState(false);
    const [dynamicCategories, setDynamicCategories] = useState([]);

    const formik = useFormik({
        initialValues: {
            category: "",
            dynamicCategories: [],
            information: {
                adTitle: "",
                adDescription: "",
                adPrice: "",
                type: "",
                additionalInfo: "",
            },
            images: [],
            seller: {
                name: user?.name || "",
                phone: user?.phone || "",
                whatsAppMessage: true,
                phoneMessage: true,
            },
            featured: false,
            feeAgreement: false,
        },
        validationSchema: validationSchemas[step],
        onSubmit: async () => {
            setIsLoading(true);
            setErrorMessage("");
            setStepError("");

            if (!formik.values.images || formik.values.images.length === 0) {
                setStepError("⚠️ يجب رفع صورة واحدة على الأقل قبل الإرسال");
                setIsLoading(false);
                return;
            }

            try {
                const formData = new FormData();
                const values = formik.values;

                formData.append("category_id", values.category || "غير محدد");
                formData.append("title", values.information.adTitle || "غير محدد");
                formData.append("description", values.information.adDescription || "غير محدد");
                formData.append("price", values.information.adPrice || 100.0);
                formData.append("type", values.information.type || "غير محدد");
                formData.append("additional_info", values.information.additionalInfo || "غير محدد");
                formData.append("seller_name", values.seller.name || "غير محدد");
                formData.append("seller_phone", values.seller.phone || "غير محدد");
                formData.append("allow_whatsapp_messages", values.seller.whatsAppMessage ? 1 : 0);
                formData.append("allow_mobile_messages", values.seller.phoneMessage ? 1 : 0);
                formData.append("fee_agree", values.feeAgreement ? 1 : 0);
                formData.append("is_featured", values.featured ? 1 : 0);
                formData.append("user_id", values.seller.id || "");

                values.images.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("images[]", file);
                    }
                });

                const response = await axios.post(
                    "https://api.maaashi.com/api/ads",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                if (response.status === 201) {
                    setSuccessMessage(true);
                    toast.success("تم إضافة الإعلان بنجاح!");
                    formik.resetForm();
                    setTimeout(() => navigate("/"), 2000);
                } else {
                    setStepError("❌ حدث خطأ أثناء رفع الإعلان، حاول مرة أخرى");
                }

            } catch (error) {
                setStepError(error.response?.data?.message || error.message);
                console.error("⚠️ Error submitting ad:", error.response?.data || error.message);
            } finally {
                setIsLoading(false);
            }
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const nextStep = async () => {
        try {
            let schema = validationSchemas[step];
            if (typeof schema === "function") schema = schema(formik.values.category);
            await schema.validate(formik.values, { abortEarly: false });

            if (step === 3 && (!formik.values.images || formik.values.images.length === 0)) {
                setStepError("⚠️ يجب رفع صورة واحدة على الأقل قبل الانتقال للخطوة التالية");
                return;
            }

            setStepError("");
            if (step < 5) setStep(step + 1);
        } catch (err) {
            if (err.inner) {
                const messages = err.inner.map(e => `${e.path}: ${e.message}`).join("\n");
                setStepError(messages);
            }
        }
    };

    const prevStep = () => { if (step > 1) setStep(step - 1); };

    return (
        <>
            {token && token !== "undefined" ?
                <div className='Advertisements'>
                    <AddHeader currentStep={step} successMessage={successMessage} />

                    {step === 1 &&
                        <Category
                            formik={formik}
                            setCategories={(cats) => {
                                setDynamicCategories(cats);
                                formik.setFieldValue("dynamicCategories", cats);
                            }}
                        />
                    }

                    {step === 2 &&
                        <Information
                            formik={formik}
                            prevStep={prevStep}
                            categories={formik.values.dynamicCategories}
                        />
                    }

                    {step === 3 && <UploadImages formik={formik} />}
                    {step === 4 && <SellerData formik={formik} />}
                    {step === 5 &&
                        <ConfirmAd
                            formik={formik}
                            isLoading={isLoading}
                            errorMessage={errorMessage}
                        />
                    }

                    {stepError && <div className="step-error">{stepError}</div>}

                    <div className="buttons">
                        <button
                            type='button'
                            className="btn prev"
                            style={{ display: step === 1 ? "none" : "flex" }}
                            onClick={prevStep}
                        >
                            <span>السابق</span>
                        </button>
                        <Link
                            to='/'
                            className="link_prev"
                            style={{ display: step === 1 ? "block" : "none" }}
                        >
                            <span>العودة للموقع</span>
                        </Link>
                        {step < 5 &&
                            <button
                                type='button'
                                className="btn next"
                                onClick={nextStep}
                            >
                                <span>التالي</span>
                            </button>
                        }
                    </div>
                </div>
                :
                <LoginRequiredCard />
            }
        </>
    );
}
