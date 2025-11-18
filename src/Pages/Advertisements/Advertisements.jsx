import React, { useState } from 'react'
import AddHeader from '../../Components/AdvertisementsComponents/AddHeader/AddHeader';
import Category from './Category/Category';
import './style.css'
import Information from './Information/Information';
import UploadImages from './UploadImages/UploadImages';
import Location from './Location/Location';
import SellerData from './SellerData/SellerData';
import ConfirmAd from './ConfirmAd/ConfirmAd';
import { validationSchemas } from "./validationSchemas";
import { useFormik } from 'formik';
import axios from "axios";
import { useCookies } from "react-cookie";
import LoginRequiredCard from '../../Components/AdvertisementsComponents/LoginRequiredCard/LoginRequiredCard';
import { Link, useNavigate } from 'react-router-dom';
import { ToastWarning } from '../../Components/Header/Header';
import { parseAuthCookie } from '../../utils/auth';

export default function Advertisements() {
    // Step management: 1=category, 2=details, 3=review
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const navigate = useNavigate();
    const { token, user } = parseAuthCookie(cookies?.token);
    const userData = user;
    const [showToast, setShowToast] = useState(true);
    // console.log(userData);
    const [ads_id, setAds_id] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    const formik = useFormik({
        initialValues: {
            category: "",
            information: {
                adTitle: "",
                adDescription: "",
                adPrice: "",
                isNegotiable: true,

                vehicle: {
                    brand: "",
                    model: "",
                    year: "",
                },

                realestate: {
                    realestateType: "",
                    streetType: "",
                    realestateInterface: "",
                },

                electronics: {
                    deviceType: "",
                    moreInfo: "",
                },

                jobs: {
                    jobType: "",
                },

                furniture: {
                    furnitureType: "",
                },

                services: {
                    servicesType: "",
                },

                fashion: {
                    fashionType: "",
                    moreInfo: "",
                },

                food: {
                    foodType: "",
                },

                pets: {
                    animalType: "",
                },

                anecdotes: {
                    moreInfo: "",
                },

                gardens: {
                    moreInfo: "",
                },

                trips: {
                    moreInfo: "",
                },
            },
            images: [],
            location: {
                detailedAddress: "",
                city: "",
                area: "",
            },
            seller: {
                name: userData?.name || "",
                phone: userData?.phone || "",
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
            try {
                const formData = new FormData();
                // الفئة
                formData.append("category", formik.values.category);

                // معلومات الإعلان
                formData.append("information[adTitle]", formik.values.information.adTitle);
                formData.append("information[adDescription]", formik.values.information.adDescription);
                formData.append("information[adPrice]", formik.values.information.adPrice);
                formData.append("information[isNegotiable]", formik.values.information.isNegotiable ? 1 : 0);

                // العنوان
                formData.append("location[detailedAddress]", formik.values.location.detailedAddress);
                formData.append("location[city]", formik.values.location.city);
                formData.append("location[area]", formik.values.location.area);

                // البائع
                formData.append("seller[name]", formik.values.seller.name);
                formData.append("seller[phone]", formik.values.seller.phone);
                formData.append("seller[whatsAppMessage]", formik.values.seller.whatsAppMessage ? 1 : 0);
                formData.append("seller[phoneMessage]", formik.values.seller.phoneMessage ? 1 : 0);
                formData.append("seller[fee_agree]", formik.values.feeAgreement ? 1 : 0);
                formData.append("seller[featured]", formik.values.featured ? 1 : 0);

                // الصور
                formik.values.images.forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                });

                // category إضافية بيانات حسب
                if (formik.values.category === "vehicles") {
                    formData.append("information[vehicle][brand]", formik.values.information.vehicle.brand);
                    formData.append("information[vehicle][model]", formik.values.information.vehicle.model);
                    formData.append("information[vehicle][year]", formik.values.information.vehicle.year);
                }

                if (formik.values.category === "realestate") {
                    formData.append("information[realestate][realestateType]", formik.values.information.realestate.realestateType);
                    formData.append("information[realestate][streetType]", formik.values.information.realestate.streetType);
                    formData.append("information[realestate][realestateFace]", formik.values.information.realestate.realestateInterface);
                }

                if (formik.values.category === "electronics") {
                    formData.append("information[electronics][electronicType]", formik.values.information.electronics.deviceType);
                    formData.append("information[electronics][moreInfo]", formik.values.information.electronics.moreInfo);
                }

                if (formik.values.category === "jobs") {
                    formData.append("information[jobs][jobType]", formik.values.information.jobs.jobType);
                }

                if (formik.values.category === "furniture") {
                    formData.append("information[furniture][furnitureType]", formik.values.information.furniture.furnitureType);
                }

                if (formik.values.category === "services") {
                    formData.append("information[service][serviceType]", formik.values.information.services.servicesType);
                }

                if (formik.values.category === "fashion") {
                    formData.append("information[fashion][fashionType]", formik.values.information.fashion.fashionType);
                    formData.append("information[fashion][moreInfo]", formik.values.information.fashion.moreInfo);
                }

                if (formik.values.category === "food") {
                    formData.append("information[food][foodType]", formik.values.information.food.foodType);
                }

                if (formik.values.category === "pets") {
                    formData.append("information[pets][animalType]", formik.values.information.pets.animalType);
                }

                if (formik.values.category === "gardens") {
                    formData.append("information[gardens][gardenType]", formik.values.information.gardens.moreInfo);
                }

                if (formik.values.category === "trips") {
                    formData.append("information[trips][tripType]", formik.values.information.trips.moreInfo);
                }

                if (formik.values.category === "anecdotes") {
                    formData.append("information[anecdotes][anecdoteType]", formik.values.information.anecdotes.moreInfo);
                }

                const response = await axios.post(
                    "https://api.maaashi.com/api/ealans",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                if (response?.data?.success) {
                    setAds_id(response?.data?.data?.data?.id)
                    setCategoryName(response?.data?.data?.data?.category);
                    setSuccessMessage(true);
                    formik.resetForm();
                }
            } catch (error) {
                setErrorMessage(error.response?.message || error.message)
                console.error("Error submitting ad:", error.response?.data || error.message);
            } finally {
                setIsLoading(false);
            };

        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const nextStep = async () => {
        try {
            let schema = validationSchemas[step];
            if (typeof schema === "function") {
                schema = schema(formik.values.category);
            }
            await schema.validate(formik.values, { abortEarly: false });

            if (step < 5) setStep(step + 1);
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((e) => {
                    formik.setFieldError(e.path, e.message);
                    formik.setFieldTouched(e.path, true, false);
                });
            }
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <>
            {token && token !== "undefined" ?
                <>
                    <form onSubmit={formik.handleSubmit} className='Advertisements'>
                        {/* header */}
                        <AddHeader currentStep={step} successMessage={successMessage} />

                        {/* الخطوة الأولى */}
                        {step === 1 && (
                            <Category formik={formik} />
                        )}

                        {/* المعلومات  */}
                        {step === 2 && (
                            <Information formik={formik} prevStep={prevStep} />
                        )}

                        {/* رفع الصور */}
                        {step === 3 && (
                            <UploadImages formik={formik} />
                        )}

                        {/* رفع الموقع */}
                        {/* {step === 4 && (
                            <Location formik={formik} />
                        )} */}

                        {/* بيانات البائع */}
                        {step === 4 && (
                            <SellerData formik={formik} />
                        )}

                        {/* التاكيد */}
                        {step === 5 && (
                            <ConfirmAd formik={formik} isLoading={isLoading} errorMessage={errorMessage} />
                        )}

                        <div className="buttons">
                            <button type='button' className="btn prev" style={{ display: step === 1 ? "none" : "flex" }} onClick={prevStep}>
                                <img src="./advertisements/ArrowRight.svg" alt="ArrowRight" className='arrowPrev' />
                                <span>السابق</span>
                            </button>
                            <Link to='/' className="link_prev" style={{ display: step === 1 ? "block" : "none" }}>
                                <span>العودة للموقع</span>
                            </Link>
                            <button
                                type='button'
                                className="btn next"
                                onClick={nextStep}
                                style={{ opacity: step < 5 ? 1 : 0 }}
                            >
                                <span>التالي</span>
                                <img src="./advertisements/ArrowLeft.svg" alt="ArrowLeft" className='arrowNext' />
                            </button>
                        </div>
                    </form>

                    {/* Modal */}
                    <div className="modal_fade" style={{ display: successMessage ? "flex" : "none" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="img_avatar">
                                        <img src="./advertisements/CheckCircleGreen.svg" alt="CheckCircleGreen" />
                                    </div>
                                    <h1 className="modal-title">تم نشر إعلانك بنجاح!</h1>
                                    <p>إعلانك الآن مرئي لآلاف المشترين المهتمين</p>
                                </div>
                                <div className="modal-body">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setSuccessMessage(false); navigate(`/${categoryName}/${ads_id}`) }}>
                                        <img src="./advertisements/eye.svg" alt="eye" />
                                        <span>شاهد إعلانك</span>
                                    </button>

                                    <div className="special-adver">
                                        <h4>
                                            <img src="./advertisements/StarGold.svg" alt="StarGold" />
                                            <span>ميز إعلانك ليظهر في النتائج الأولى</span>
                                        </h4>
                                        <p>زد من فرص مشاهدة إعلانك بـ 5 أضعاف مع خدمة التمي</p>
                                        <button type="button" className="btn btn-primary">
                                            <img src="./advertisements/StarWhite.svg" alt="StarWhite" />
                                            <span>شاهد إعلانك</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <p>سيتم مراجعة إعلانك خلال 24 ساعة للتأكد من مطابقته لشروط الخدمة</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="toastLocationWarning">
                        {Boolean(token) && showToast && userData?.area === null && (<ToastWarning message="الرجاء إضافة الموقع قبل المتابعة." onClose={() => setShowToast(false)} />)}
                    </div>
                </>
                :
                <LoginRequiredCard />
            }
        </>
    )
}
