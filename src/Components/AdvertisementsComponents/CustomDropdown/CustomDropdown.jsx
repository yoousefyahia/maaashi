import React, { useEffect, useRef } from 'react';
import "./CustomDropdown.css";

export default function CustomDropdown({ isOpen, setIsOpen, data, formik, name }) {
    const { setFieldValue } = formik;
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        setFieldValue(name, option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="dropdown" ref={dropdownRef}>
            {isOpen && (
                <ul className="dropdown_menu" style={{ height: isOpen ? "200px" : "0px" }}>
                    {data.map((item, index) => (
                        <li
                            key={index}
                            className="dropdown_item"
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};