import React, { useEffect, useRef } from 'react';
import "./Information.css";
import FormHeader from '../../../Components/AdvertisementsComponents/FormHeader/FormHeader';

// استدعاء النماذج حسب الفئة
import CarForm from '../../../Components/AdvertisementsComponents/CarForm/CarForm';
import RealestateForm from '../../../Components/AdvertisementsComponents/RealestateForm/RealestateForm';
import ElectricForm from '../../../Components/AdvertisementsComponents/ElectricForm/ElectricForm'; 
import JobsForm from '../../../Components/AdvertisementsComponents/JobsForm/JobsForm';
import FurnitureForm from '../../../Components/AdvertisementsComponents/FurnitureForm/FurnitureForm';
import ServicesForm from '../../../Components/AdvertisementsComponents/ServicesForm/ServicesForm';
import FashionForm from '../../../Components/AdvertisementsComponents/FashionForm/FashionForm';
import FoodForm from '../../../Components/AdvertisementsComponents/FoodForm/FoodForm';
import AnecdotesForm from '../../../Components/AdvertisementsComponents/AnecdotesForm/AnecdotesForm';
import PetsForm from '../../../Components/AdvertisementsComponents/PetsForm/PetsForm';
import GardensForm from '../../../Components/AdvertisementsComponents/GardensForm/GardensForm';
import TripsForm from '../../../Components/AdvertisementsComponents/TripsForm/TripsForm';

export default function Information({ formik, prevStep, categories }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;

    const category = categories.find(cat => cat.id === values.category);
    if (!category) return <p>اختر فئة أولاً</p>;

    const titleInputRef = useRef(null);

    useEffect(() => {
        if (titleInputRef.current) titleInputRef.current.focus();
    }, []);

    return (
        <div className="information_container">
            <div className="basicData">
                <header className='information_header'>
                    <div className="circle">1</div>
                    <div className="text">
                        <h1>البيانات الأساسية</h1>
                        <p>ادخل عنوان و وصف واضح للإعلان</p>
                    </div>
                </header>

                {/* عنوان الإعلان */}
                <div className="input_container">
                    <label htmlFor="adTitle">
                        عنوان الإعلان*
                        {errors.information?.adTitle && touched.information?.adTitle && (
                            <div className="info_error">{errors.information.adTitle}</div>
                        )}
                    </label>
                    <input
                        ref={titleInputRef}
                        type="text"
                        name="information.adTitle"
                        value={values.information?.adTitle}
                        onChange={(e) => setFieldValue("information.adTitle", e.target.value)}
                        onBlur={handleBlur}
                        id="adTitle"
                        className='adTitle_input input'
                        placeholder='أدخل عنوان واضح'
                    />
                </div>

                {/* الوصف */}
                <div className="textarea_container">
                    <label htmlFor="adDescription">
                        الوصف*
                        {errors.information?.adDescription && touched.information?.adDescription && (
                            <div className="info_error">{errors.information.adDescription}</div>
                        )}
                    </label>
                    <textarea
                        name="information.adDescription"
                        value={values.information?.adDescription}
                        onChange={(e) => setFieldValue("information.adDescription", e.target.value)}
                        onBlur={handleBlur}
                        id="adDescription"
                        rows={3}
                        className='adDescription_input input'
                        placeholder='أدخل وصفك هنا...'
                    />
                </div>

                {/* المعلومات الإضافية */}
                <div className="textarea_container">
                    <label htmlFor="adAdditionalInfo">
                        معلومات إضافية
                        {errors.information?.additional_info && touched.information?.additional_info && (
                            <div className="info_error">{errors.information.additional_info}</div>
                        )}
                    </label>
                    <textarea
                        name="information.additional_info"
                        value={values.information?.additional_info || ""}
                        onChange={(e) => setFieldValue("information.additional_info", e.target.value)}
                        onBlur={handleBlur}
                        id="adAdditionalInfo"
                        rows={3}
                        className='adAdditionalInfo_input input'
                        placeholder='أدخل أي معلومات إضافية هنا...'
                    />
                </div>

                {/* السعر */}
                <div className="inputPrice_container">
                    <div className="inputPrice">
                        <label htmlFor="adPrice"><span>السعر (ريال سعودي)</span> <span className='main_text'> (اختياري)</span></label>
                        <input
                            type="text"
                            name="information.adPrice"
                            value={values.information.adPrice}
                            onChange={(e) => setFieldValue("information.adPrice", e.target.value)}
                            onBlur={handleBlur}
                            id="adPrice"
                            className='adPrice_input input'
                            placeholder='أدخل سعرك هنا' />
                        <span>ر.س</span>
                        {errors.information?.adPrice && touched.information?.adPrice && (
                            <div className="info_error">{errors.information.adPrice}</div>
                        )}
                    </div>

                    {values?.information?.adPrice && !errors.information?.adPrice && (
                        <div className="switch-item">
                            <p>التفاوض علي السعر</p>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="information.isNegotiable"
                                    checked={values.information.isNegotiable}
                                    onChange={(e) => setFieldValue("information.isNegotiable", e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>)
                    }
                </div>
            </div>

            {/* قسم الفئة والنماذج الخاصة بها */}
            <div className="basic_category_data">
                <FormHeader
                    img={category.image}
                    title={category.name}
                    desc={category.description}
                    prevStep={prevStep}
                />

                {category.name === "السيارات" && <CarForm formik={formik} />}
                {category.name === "العقارات" && <RealestateForm formik={formik} />}
                {category.name === "الالكترونيات" && <ElectricForm formik={formik} />}
                {category.name === "الوظائف" && <JobsForm formik={formik} />}
                {category.name === "أثاث" && <FurnitureForm formik={formik} />}
                {category.name === "خدمات" && <ServicesForm formik={formik} />}
                {category.name === "وأزياء" && <FashionForm formik={formik} />}
                {category.name === "طعام" && <FoodForm formik={formik} />}
                {category.name === "حكايات" && <AnecdotesForm formik={formik} />}
                {category.name === "حدائق" && <GardensForm formik={formik} />}
                {category.name === "رحلات" && <TripsForm formik={formik} />}
                {category.name === "حيوانات" && <PetsForm formik={formik} />}
            </div>
        </div>
    );
}
