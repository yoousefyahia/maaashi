import React, { useEffect, useRef, useState } from 'react';
import { saudiRegions } from '../../../data';
import "./SaudiRegionsDropdown.css"


export default function SaudiRegionsDropdown({ setRegion, setCity }) {

    const [isOpenRegion, setIsOpenRegion] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const RegionDropdownRef = useRef(null);
    const handleSelectRegion = (region) => {
        if (!region || region === "كل المناطق") {
            setSelectedRegion(null);
            setRegion(null);
            setCity(null); 
            setSelectedCity("كل المدن");
            setIsOpenRegion(false);
        } else {
            setSelectedRegion(region.region);
            setRegion(region.region);
            setSelectedCity("كل المدن");
            setCity(null);
            setIsOpenRegion(false);
        }
    };

    const cityDropdownRef = useRef(null);
    const [isOpenCity, setIsOpenCity] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const handleSelectCity = (city) => {
        setSelectedCity(city);
        if (!city || city === "كل المدن") {
            setCity(null);
            setIsOpenCity(false);
        } else {
            setCity(city);
            setIsOpenCity(false);
        }
    };

    const filteredCities = saudiRegions.find((item) => item.region === selectedRegion);

    // const filteredCities = selectedRegion?.cities.filter(city => city.includes(values.location.city)) || [];

    useEffect(() => {
        const handleClickOutsideRegion = (event) => {
            if (RegionDropdownRef.current && !RegionDropdownRef.current.contains(event.target)) {
                setIsOpenRegion(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideRegion);

        const handleClickOutsideCity = (event) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setIsOpenCity(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideCity);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideRegion);
            document.removeEventListener("mousedown", handleClickOutsideCity);
        };
    }, []);

    return (
        <div className='filterDropdown'>
            <div className="regionDropdown" ref={RegionDropdownRef}>
                <button type='button' onClick={() => setIsOpenRegion(!isOpenRegion)}>
                    {selectedRegion ? selectedRegion : <span>كل المناطق</span>}

                    <span className={`chevron_up ${isOpenRegion ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </button>
                {isOpenRegion && (
                    <ul className="dropdown_menu" style={{ height: isOpenRegion ? "200px" : "0px" }}>
                        <li className='dropdown_item' onClick={() => { handleSelectRegion(null) }}>
                            <span>كل المناطق</span>
                        </li>
                        {saudiRegions.map((item, index) => (
                            <li
                                key={index}
                                className="dropdown_item"
                                onClick={() => handleSelectRegion(item)}
                            >
                                {item.region}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="citiesDropdown" ref={cityDropdownRef}>
                <button type='button' onClick={() => setIsOpenCity(!isOpenCity)} style={{ opacity: selectedRegion ? 1 : .5 }}>
                    {selectedCity ? selectedCity : <span>كل المدن</span>}

                    <span className={`chevron_up ${isOpenCity && selectedRegion ? "open" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
                    </span>
                </button>
                {isOpenCity && selectedRegion && (
                    <ul className="dropdown_menu" style={{ height: isOpenCity && selectedRegion ? "200px" : "0px" }}>
                        <li className='dropdown_item' onClick={() => { handleSelectCity(null) }}>
                            <span>كل المدن</span>
                        </li>
                        {filteredCities?.cities?.map((item, index) => (
                            <li
                                key={index}
                                className="dropdown_item"
                                onClick={() => handleSelectCity(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
};