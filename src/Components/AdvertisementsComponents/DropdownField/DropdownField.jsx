import React, { useEffect, useRef, useState } from 'react';
import "./DropdownField.css"
export default function DropdownField({ formik, name, options = [], placeholder }) {
    const { values, setFieldValue, error } = formik;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectOption = (option) => {
        setFieldValue(name, option);
        setIsOpen(false);
    };

    return (
        <div className="input_container" ref={dropdownRef}>
            <label htmlFor={name}>اختر من القائمة</label>
            <div className="dropdown_input_wrapper">
                <input
                    type="text"
                    name={name}
                    value={values.information}
                    readOnly
                    onClick={() => setIsOpen(!isOpen)}
                    onChange={(e)=> setFieldValue(`${name}`, e.target.value)}
                    id={name}
                    className="dropdown_input input"
                    placeholder={placeholder}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {isOpen && (
                <ul className="input_option">
                    {options.map((option, id) => (
                        <li
                            key={id}
                            onClick={() => selectOption(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};