import React, { useState } from 'react';
import "./CarForm.css";
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { CarFormOption, yearOptions } from '../../../data';

export default function CarForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isCarOptionOpen, setIsCarOptionOpen] = useState(false);
    const brandOption = CarFormOption.map((item)=> item.brand);

    const [isModelOptionOpen, setIsModelOptionOpen] = useState(false);
    const selectedBrand = CarFormOption.find(item => item.brand === values.information?.vehicle?.brand);
    const modelOptions = selectedBrand ? selectedBrand.models : [];

    const [isYearOptionOpen, setIsYearOptionOpen] = useState(false);

    return (
        <div className="carForm_inputs">
            <div className="brand_container">
                <label htmlFor="brand">الماركة*
                    {errors.information?.vehicle?.brand && touched.information?.vehicle?.brand && (
                        <div className="info_error">{errors.information?.vehicle?.brand}</div>
                    )}
                </label>
                <div className="input_container">
                    <input
                        type="text"
                        name="brand"
                        value={values.information?.vehicle?.brand}
                        onChange={(e) => setFieldValue("information.vehicle.brand", e.target.value)}
                        onClick={() => setIsCarOptionOpen(!isCarOptionOpen)}
                        onBlur={handleBlur}
                        id="brand"
                        className='brand_input input'
                        placeholder='اختر الماركة'
                    />
                    <span className={`chevron_up ${isCarOptionOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={isCarOptionOpen} setIsOpen={setIsCarOptionOpen} data={brandOption} formik={formik} name="information.vehicle.brand" />
            </div>

            <div className="model_input">
                <header>
                    <span>الموديل *</span>
                    {errors.information?.vehicle?.model && touched.information?.vehicle?.model && (
                        <div className="info_error">{errors.information?.vehicle?.model}</div>
                    )}
                </header>
                <div className="model_input_container">
                    <input
                        type="text"
                        name="information.vehicle.model"
                        value={values.information?.vehicle?.model}
                        onClick={() => setIsModelOptionOpen(!isModelOptionOpen)}
                        onChange={(e) => setFieldValue("information.vehicle.model", e.target.value)}
                        onBlur={handleBlur}
                        id="model"
                        className='input'
                        placeholder='أدخل الموديل'
                    />
                    <span className={`chevron_up ${values.information?.vehicle?.brand && isModelOptionOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={values.information?.vehicle?.brand && isModelOptionOpen} setIsOpen={setIsModelOptionOpen} data={modelOptions} formik={formik} name="information.vehicle.model" />
            </div>

            <div className="year_input">
                <header>
                    <span>سنة الصنع *</span>
                    {errors.information?.vehicle?.year && touched.information?.vehicle?.year && (
                        <div className="info_error">{errors.information?.vehicle?.year}</div>
                    )}
                </header>

                <div className="year_input_container">
                    <input
                        type="text"
                        name="information.vehicle.year"
                        value={values.information?.vehicle?.year}
                        onChange={(e) => setFieldValue("information.vehicle.year", e.target.value)}
                        onClick={() => setIsYearOptionOpen(!isYearOptionOpen)}
                        onBlur={handleBlur}
                        id="year"
                        className='input'
                        placeholder='أدخل سنة الصنع'
                    />
                    <span className={`chevron_up ${isYearOptionOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={isYearOptionOpen} setIsOpen={setIsYearOptionOpen} data={yearOptions} formik={formik} name="information.vehicle.year" />
            </div>
        </div>
    )
};