import React from 'react'

export default function TripsForm({ formik }) {
    const { values, setFieldValue, errors, handleBlur, touched } = formik;
    return (
        <div className="input_container">
            <label htmlFor="moreInfo">معلومات اضافية
            </label>
            <input
                type="text"
                name="moreInfo"
                value={values.information?.trips?.moreInfo}
                onChange={(e) => setFieldValue("information.trips.moreInfo", e.target.value)}
                onBlur={handleBlur}
                id="moreInfo"
                className='moreInfo_input input'
                placeholder='أدخل معلومات اضافية'
            />
        </div>
    )
}
