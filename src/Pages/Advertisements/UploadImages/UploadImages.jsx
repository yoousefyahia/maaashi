import React, { useState, useEffect } from 'react';
import "./UploadImages.css";

export default function UploadImages({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [previewUrls, setPreviewUrls] = useState([]);
    const [previewError, setPreviewError] = useState(""); // خطأ المعاينة
    const [uploadError, setUploadError] = useState(""); // خطأ الرفع

    // توليد preview
    useEffect(() => {
        setPreviewError(""); // مسح خطأ المعاينة
        if (values.images && values.images.length > 0) {
            const urls = [];
            let failed = false;

            values.images.forEach((file, i) => {
                if (typeof file === "string") {
                    urls.push(file);
                } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviewUrls(prev => [...prev, e.target.result]);
                    };
                    reader.onerror = () => {
                        setPreviewError("حدثت مشكلة في معاينة صورة رقم " + (i+1));
                        failed = true;
                    };
                    reader.readAsDataURL(file);
                }
            });

            if (!failed) setPreviewError("");
            setPreviewUrls(urls);
        } else {
            setPreviewUrls([]);
        }
    }, [values.images]);

    // رفع الصور
    const handleImageUpload = (e) => {
        setUploadError(""); // مسح الخطأ القديم
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const validImages = [];
        for (let file of files) {
            if (!file.type.startsWith("image/")) {
                setUploadError("الملف يجب أن يكون صورة فقط");
                continue;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                setUploadError("حجم الصورة يجب أن يكون أقل من 10MB");
                continue;
            }
            validImages.push(file);
        }

        if (validImages.length === 0) return;

        const combinedFiles = [...(values.images || []), ...validImages];
        if (combinedFiles.length > 10) {
            setUploadError("يمكن رفع حتى 10 صور فقط");
        }

        setFieldValue("images", combinedFiles.slice(0, 10));
        setPreviewUrls([]); // إعادة توليد preview
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...values.images];
        updatedFiles.splice(index, 1);
        setFieldValue("images", updatedFiles);
        setPreviewUrls([]); // إعادة توليد preview
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

            {/* رسائل الخطأ */}
            {(uploadError || previewError || errors.images) && (
                <div className="image_error">
                    {uploadError || previewError || errors.images}
                </div>
            )}

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
