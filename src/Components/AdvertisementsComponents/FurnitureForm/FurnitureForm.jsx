import React, { useState } from 'react';
import "./FurnitureForm.css"
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { furniture } from '../../../data';

export default function FurnitureForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='furniture_inputs'>
            <label htmlFor="information.furniture.furnitureType">نوع الأثاث*
                {errors.information?.furniture?.furnitureType && touched.information?.furniture?.furnitureType && (
                    <div className="info_error">{errors.information?.furniture?.furnitureType}</div>
                )}
            </label>

            <div className="input_container">
                <input
                    type="text"
                    name="information.furniture.furnitureType"
                    value={values.information?.furniture?.furnitureType}
                    onChange={(e) => setFieldValue("information.furniture.furnitureType", e.target.value)}
                    onClick={() => setIsOpen(!isOpen)}
                    onBlur={handleBlur}
                    id="furnitureType"
                    className='furnitureType_input input'
                    placeholder='أدخل نوع الأثاث'
                />
                <span className={`chevron_up ${isOpen ? "open" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                </span>
            </div>
            
            <CustomDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={furniture} formik={formik} name="information.furniture.furnitureType" />
        </div>
    )
};