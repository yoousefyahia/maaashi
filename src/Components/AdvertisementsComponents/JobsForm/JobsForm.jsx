import React, { useState } from 'react';
import "./JobsForm.css"
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { jobs } from '../../../data';

export default function JobsForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='jobs_inputs'>
            <label htmlFor="jobType">نوع الوظيفة*
                {errors.information?.jobs?.jobType && touched.information?.jobs?.jobType && (
                    <div className="info_error">{errors.information?.jobs?.jobType}</div>
                )}
            </label>
            
            <div className="input_container">
                <input
                    type="text"
                    name="information.jobs.jobType"
                    value={values.information?.jobs?.jobType}
                    onChange={(e) => setFieldValue("information.jobs.jobType", e.target.value)}
                    onClick={()=> setIsOpen(!isOpen)}
                    onBlur={handleBlur}
                    id="jobType"
                    className='jobType_input input'
                    placeholder='أدخل نوع الوظيفة'
                />
                <span className={`chevron_up ${isOpen ? "open" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                </span>
                <CustomDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={jobs} formik={formik} name="information.jobs.jobType" />
            </div>
        </div>
    )
}
