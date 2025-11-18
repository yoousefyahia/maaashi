import React, { useEffect, useRef, useState } from 'react';
import "./PetsForm.css"
import DropdownField from '../DropdownField/DropdownField';
const ALL_TAGS = [
    "أبل", "خيل", "ماعز",
    "غنم", "بِغاء", "حمام", "قطط", "دجاج",
    "كلاب", "بقر", "أسماك وسلاحف", "أرانب",
    "بط", "سناجب", "هامستر"
];

export default function PetsForm({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutsidetagesDrop = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutsidetagesDrop);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsidetagesDrop);
        };
    }, []);

    return (
        <div className="input_container">
            <label htmlFor="moreInfo">معلومات اضافية
                {errors.information?.pets?.animalType && (
                    <div className="info_error">{errors.information?.pets?.animalType}</div>
                )}
            </label>
            <div className="moreInfo_container" ref={tagsDropdownRef}>
                <input
                    type="text"
                    name="information.pets.animalType"
                    value={values.information?.pets?.animalType}
                    onChange={(e) => setFieldValue("information.pets.animalType", e.target.value)}
                    onClick={() => setIsTagsOpen(true)}
                    id="moreInfo"
                    className='moreInfo_input input'
                    placeholder='أدخل معلومات اضافية'
                />
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
            </div>

            {/* Dropdown options */}
            {isTagsOpen && (
                <ul className="input_option">
                    {ALL_TAGS.map((option, id) => (
                        <li
                            key={id}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setFieldValue("information.pets.animalType", option);
                                setIsTagsOpen(false);
                            }}
                        >
                            {option}
                        </li>
                    )
                    )}
                </ul>
            )}
        </div>
    )
}
