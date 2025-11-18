import React, { useState } from 'react'
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { fashion } from '../../../data';
import "./FashionFormStyle.css"

export default function FashionForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="fashion_inputs">
            <div className="fashionType_container">
                <label htmlFor="information.fashion.fashionType">نوع الزي*
                    {errors.information?.fashion?.fashionType && touched.information?.fashion?.fashionType && (
                        <div className="info_error">{errors.information?.fashion?.fashionType}</div>
                    )}
                </label>
                
                <div className="input_container">
                    <input
                        type="text"
                        name="information.fashion.fashionType"
                        value={values.information?.fashion?.fashionType}
                        onChange={(e) => setFieldValue("information.fashion.fashionType", e.target.value)}
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={handleBlur}
                        id="fashionType"
                        className='fashionType_input input'
                        placeholder='أختر نوع الزي'
                    />
                    <span className={`chevron_up ${isOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={fashion} formik={formik} name="information.fashion.fashionType" />
            </div>

            <div className="input_container">
                <label htmlFor="moreInfo">معلومات اضافية*
                    {errors.information?.fashion?.moreInfo && touched.information?.fashion?.moreInfo && (
                        <div className="info_error">{errors.information?.fashion?.moreInfo}</div>
                    )}
                </label>
                <input
                    type="text"
                    name="moreInfo"
                    value={values.information?.fashion?.moreInfo}
                    onChange={(e) => setFieldValue("information.fashion.moreInfo", e.target.value)}
                    onBlur={handleBlur}
                    id="moreInfo"
                    className='moreInfo_input input'
                    placeholder='أدخل معلومات اضافية'
                />
            </div>
        </div>
    )
};