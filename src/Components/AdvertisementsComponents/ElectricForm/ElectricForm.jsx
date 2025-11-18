import React, { useState } from 'react';
import "./ElectricForm.css"
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { electronics } from '../../../data';

export default function ElectricForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="electronics_inputs">
            <div className="deviceType_container">
                <label htmlFor="information.electronics.deviceType">نوع الجهاز*
                    {errors.information?.electronics?.deviceType && touched.information?.electronics?.deviceType && (
                        <div className="info_error">{errors.information?.electronics?.deviceType}</div>
                    )}
                </label>
                <div className="input_container">
                    <input
                        type="text"
                        name="information.electronics.deviceType"
                        value={values.information?.electronics?.deviceType}
                        onChange={(e) => setFieldValue("information.electronics.deviceType", e.target.value)}
                        onClick={()=> setIsOpen(!isOpen)}
                        onBlur={handleBlur}
                        id="deviceType"
                        className='deviceType_input input'
                        placeholder='أدخل نوع الجهاز'
                    /><span className={`chevron_up ${isOpen ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </div>
                <CustomDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={electronics} formik={formik} name="information.electronics.deviceType" />
            </div>

            <div className="input_container">
                <label htmlFor="moreInfo">معلومات اضافية*
                    {errors.information?.electronics?.moreInfo && touched.information?.electronics?.moreInfo && (
                        <div className="info_error">{errors.information?.electronics?.moreInfo}</div>
                    )}
                </label>
                <input
                    type="text"
                    name="moreInfo"
                    value={values.information?.electronics?.moreInfo}
                    onChange={(e) => setFieldValue("information.electronics.moreInfo", e.target.value)}
                    onBlur={handleBlur}
                    id="moreInfo"
                    className='moreInfo_input input'
                    placeholder='أدخل معلومات اضافية'
                />
            </div>
        </div>
    )
};