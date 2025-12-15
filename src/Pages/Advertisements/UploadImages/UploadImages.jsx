import React, { useState, useEffect } from 'react';
import "./UploadImages.css";

export default function UploadImages({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [previewUrls, setPreviewUrls] = useState([]);
    const [imageError, setImageError] = useState(""); // أي خطأ في الصور

    // توليد preview لكل الصور باستخدام FileReader
    const generatePreview = (files) => {
        const urls = [];
        files.forEach((file, i) => {
            if (typeof file === "string") {
                urls.push(file);
                setPreviewUrls([...urls]);
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    urls.push(e.target.result);
                    setPreviewUrls([...urls]);
                };
                reader.onerror = () => {
                    setImageError(`حدثت مشكلة في معاينة الصورة رقم ${i + 1}`);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    // كل مرة تتغير الصور في formik
    useEffect(() => {
        if (!values.images || values.images.length === 0) {
            setPreviewUrls([]);
            setImageError("");
            return;
        }
        generatePreview(values.images);
    }, [values.images]);

    // رفع الصور
    const handleImageUpload = (e) => {
        setImageError(""); // مسح أي خطأ قديم
        const files = Array.from(e.target.files);

        if (!files.length) return;

        const validFiles = [];
        files.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                setImageError("الملف يجب أن يكون صورة فقط");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setImageError("حجم الصورة يجب أن يكون أقل من 10MB");
                return;
            }
            validFiles.push(file);
        });

        if (!validFiles.length) return;

        const combinedFiles = [...(values.images || []), ...validFiles];
        if (combinedFiles.length > 10) {
            setImageError("يمكن رفع حتى 10 صور فقط");
        }

        setFieldValue("images", combinedFiles.slice(0, 10));
        generatePreview(combinedFiles.slice(0, 10));
    };

    // إزالة صورة
    const handleRemoveImage = (index) => {
        const updatedFiles = [...values.images];
        updatedFiles.splice(index, 1);
        setFieldValue("images", updatedFiles);
        generatePreview(updatedFiles);
        setImageError(""); // إعادة مسح أي خطأ بعد إزالة الصورة
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

            {/* عرض أي أخطاء للمستخدم مباشرة */}
            {(imageError || errors.images) && (
                <div className="image_error">
                    {imageError || errors.images}
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
