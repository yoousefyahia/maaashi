import React from 'react';
import "./AnecdotesForm.css"

export default function AnecdotesForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    return (
        <div className="input_container">
            <label htmlFor="moreInfo">معلومات اضافية
            </label>
            <input
                type="text"
                name="moreInfo"
                value={values.information?.anecdotes?.moreInfo}
                onChange={(e) => setFieldValue("information.anecdotes.moreInfo", e.target.value)}
                onBlur={handleBlur}
                id="moreInfo"
                className='moreInfo_input input'
                placeholder='أدخل معلومات اضافية'
            />
        </div>
    )
}
