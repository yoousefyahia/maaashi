import React from 'react';
import "./FormHeader.css";

export default function FormHeader({ img, title, desc, prevStep }) {
    return (
        <div className='form_header'>
            <div className="category-content">
                {/* img */}
                <div className="img_container">
                    <span>القسم</span>
                    <div className="img_avatar">
                        <img src={img} alt={title} className='' />
                    </div>
                </div>

                <div className="category-info">
                    <h1>{title}</h1>
                    <p>{desc}</p>
                </div>
            </div>

            {/* <button type='button' className="btn_category" onClick={prevStep}>تغيير</button> */}
        </div>
    )
}
