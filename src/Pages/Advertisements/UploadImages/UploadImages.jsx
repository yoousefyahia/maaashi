import React, { useState, useEffect } from 'react';
import "./UploadImages.css";

export default function UploadImages({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        if (values.images && values.images.length > 0) {
            const urls = values.images.map(file =>
                typeof file === "string" ? file : URL.createObjectURL(file)
            );
            setPreviewUrls(urls);

            return () => urls.forEach((url, i) => {
                if (typeof values.images[i] !== "string") URL.revokeObjectURL(url);
            });
        } else {
            setPreviewUrls([]);
        }
    }, [values.images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) {
            alert("لم يتم اختيار أي ملفات");
            return;
        }

        const validFiles = [];
        const errors = [];

        files.forEach((file) => {
            if (file.size === 0) {
                errors.push(`${file.name} حجمها 0`);
            } else if (!file.type.startsWith("image/")) {
                errors.push(`${file.name} ليس صورة`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length) {
            alert("⚠️ بعض الملفات لم يتم قبولها:\n" + errors.join("\n"));
        }

        if (!validFiles.length) return;

        const combinedFiles = [...(values.images || []), ...validFiles];
        setFieldValue("images", combinedFiles.slice(0, 10));

        // نعرض أسماء الصور المرفوعة
        alert("تم رفع الصور:\n" + combinedFiles.map(f => f.name).join("\n"));
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...values.images];
        const removed = updatedFiles.splice(index, 1);
        setFieldValue("images", updatedFiles);
        alert(`تم حذف الصورة: ${removed[0].name}`);
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
                    <span>أي نوع صورة، حتى 10MB لكل صورة</span>
                </div>
                {errors.images && <div className="image_error">{errors.images}</div>}
            </label>

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
