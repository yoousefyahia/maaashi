import React, { useState, useEffect } from 'react';
import "./UploadImages.css";

export default function UploadImages({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [previewUrls, setPreviewUrls] = useState([]);

    // توليد preview باستخدام FileReader
    useEffect(() => {
        if (!values.images || values.images.length === 0) {
            setPreviewUrls([]);
            return;
        }

        const urls = [];

        values.images.forEach((file, i) => {
            if (typeof file === "string") {
                urls.push(file);
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    urls.push(e.target.result);
                    setPreviewUrls([...urls]); // تحديث preview بعد كل load
                };
                reader.onerror = () => {
                    alert(`❌ حدثت مشكلة في معاينة الصورة رقم ${i + 1}`);
                };
                reader.readAsDataURL(file);
            }
        });
    }, [values.images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const validFiles = [];
        for (let file of files) {
            if (!file.type.startsWith("image/")) {
                alert("❌ الملف يجب أن يكون صورة فقط");
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert("❌ حجم الصورة يجب أن يكون أقل من 10MB");
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        const combinedFiles = [...(values.images || []), ...validFiles];
        if (combinedFiles.length > 10) {
            alert("❌ يمكن رفع حتى 10 صور فقط");
        }

        setFieldValue("images", combinedFiles.slice(0, 10));
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...values.images];
        updatedFiles.splice(index, 1);
        setFieldValue("images", updatedFiles);
    };

    return (
        <div className="upload_container">
            <div className="upload_header">
                <h3>إضافة الصور</h3>
                <p>أضف صورًا واضحة لزيادة فرص البيع (حتى 10 صور)</p>
            </div>

            <label className="upload-box">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    hidden
                />
                <div className="upload-content">
                    <div className="upload_icon">
                        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                            <circle cx={12} cy={13} r={3} />
                        </svg>
                    </div>
                    <p>إضافة الصور</p>
                    <span>PNG, JPG, JPEG, GIF, HEIC حتى 10MB لكل صورة</span>
                </div>
            </label>

            {/* عرض أي error validation عند الضغط على التالي */}
            {errors.images && <div className="image_error">{errors.images}</div>}

            <div className="preview">
                {previewUrls.map((src, index) => (
                    <div key={index} className="preview-image">
                        <img src={src} alt={`preview-${index}`} />
                        <button type="button" className="remove_btn" onClick={() => handleRemoveImage(index)}>
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
