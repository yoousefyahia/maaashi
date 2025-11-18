import React, { useState } from 'react';
import "./RealestateForm.css"
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { realestate } from '../../../data';

export default function RealestateForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='realestate_form'>
            <div className="realestateType">
                <label htmlFor="realestateType">نوع العقار*
                    {errors.information?.realestate?.realestateType && touched.information?.realestate?.realestateType && (
                        <div className="info_error">{errors.information?.realestate?.realestateType}</div>
                    )}
                </label>
                
                <div className="input_container">
                    <input
                        type="text"
                        name="information.realestate.realestateType"
                        value={values.information?.realestate?.realestateType}
                        onChange={(e) => setFieldValue("information.realestate.realestateType", e.target.value)}
                        onClick={()=> setIsOpen(!isOpen)}
                        onBlur={handleBlur}
                        id="realestateType"
                        className='realestateType_input input'
                        placeholder='العقار'
                    />
                    <span className={`chevron_up ${isOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={realestate} formik={formik} name="information.realestate.realestateType" />
            </div>

            <div className="input_container">
                <label htmlFor="streetType">نوع الشارع*
                    {errors.information?.realestate?.streetType && touched.information?.realestate?.streetType && (
                        <div className="info_error">{errors.information?.realestate?.streetType}</div>
                    )}
                </label>
                <input
                    type="text"
                    name="streetType"
                    value={values.information?.realestate?.streetType}
                    onChange={(e) => setFieldValue("information.realestate.streetType", e.target.value)}
                    onBlur={handleBlur}
                    id="streetType"
                    className='streetType_input input'
                    placeholder='سكني'
                />
            </div>

            <div className="input_container">
                <label htmlFor="realestateInterface">الواجهة*
                    {errors.information?.realestate?.realestateInterface && touched.information?.realestate?.realestateInterface && (
                        <div className="info_error">{errors.information?.realestate?.realestateInterface}</div>
                    )}
                </label>
                <input
                    type="text"
                    name="realestateInterface"
                    value={values.information?.realestate?.realestateInterface}
                    onChange={(e) => setFieldValue("information.realestate.realestateInterface", e.target.value)}
                    onBlur={handleBlur}
                    id="realestateInterface"
                    className='realestateInterface_input input'
                    placeholder='أدخل الموديل'
                />
            </div>
        </div>
    )
}
