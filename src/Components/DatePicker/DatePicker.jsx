import React, { useState } from "react";
import "./datePickerStyle.css";

const monthsAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const daysAr = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export default function DatePicker({ onChange }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateSelect = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        setSelectedDate(date);
        setShowCalendar(false);
        if (onChange) onChange(date.toISOString().split("T")[0]);
    };

    const handleResetDate = () => {
        setSelectedDate(null);
        setShowCalendar(false);
        if (onChange) onChange("");
    };

    // عرض عربي
    const displayDate = selectedDate
        ? selectedDate.toLocaleDateString("ar-SA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }) : "";

    return (
        <div className="datepicker-container" dir="rtl">
            <div className="input-wrapper" onClick={() => setShowCalendar(!showCalendar)}>
                <input
                    type="text"
                    readOnly
                    value={displayDate}
                    placeholder="اختر التاريخ"
                    
                />
                <div className="calendar-icon">
                    {selectedDate ?
                        <div
                            role="button"
                            className="reset-btn"
                            onClick={(e) => { e.stopPropagation(); handleResetDate(); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </div>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days-icon calendar-icon"><path d="M8 2v4" /><path d="M16 2v4" /><rect width={18} height={18} x={3} y={4} rx={2} /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                    }
                </div>
            </div>

            {showCalendar && (
                <div className="calendar-popup">
                    <div className="calendar-header">
                        <button onClick={handleNextMonth}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                        <span>{monthsAr[currentMonth]} {currentYear}</span>
                        <button onClick={handlePrevMonth}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                    </div>

                    <div className="calendar-weekdays">
                        {daysAr.map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    <div className="calendar-days">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, day) => {
                            const d = day + 1;
                            const isSelected =
                                selectedDate &&
                                selectedDate.getDate() === d &&
                                selectedDate.getMonth() === currentMonth &&
                                selectedDate.getFullYear() === currentYear;

                            return (
                                <button
                                    key={d}
                                    onClick={() => handleDateSelect(d)}
                                    className={isSelected ? "selected" : ""}
                                >
                                    {d}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};