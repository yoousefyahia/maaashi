import React, { useState, useEffect } from 'react';
import "./UploadImages.css";

export default function UploadImages({ formik }) {
    const { values, setFieldValue, errors } = formik;
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isConverting, setIsConverting] = useState(false);

    // تحديث الـ previews كل ما الصور في Formik تتغير
    useEffect(() => {
        if (values.images && values.images.length > 0) {
            const urls = values.images.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);

            // تنظيف الـ Object URLs بعد الاستخدام
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        } else {
            setPreviewUrls([]);
        }
    }, [values.images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setIsConverting(true);

        Promise.all(
            files.map(file => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        canvas.toBlob((blob) => {
                            const webpFile = new File(
                                [blob],
                                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                                { type: "image/webp" }
                            );
                            resolve(webpFile);
                        }, "image/webp", 0.8);
                    };
                });
            })
        ).then((webpFiles) => {
            setFieldValue("images", [...values.images, ...webpFiles].slice(0, 10));
            setIsConverting(false);
        });
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
                    accept="image/png, image/jpeg"
                    multiple
                    onChange={handleImageUpload}
                    hidden
                />
                <div className="upload-content">
                    <div className="upload_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx={12} cy={13} r={3} /></svg>
                    </div>
                    <p>إضافة الصور</p>
                    <span>PNG, JPG, JPEG حتى 10MB لكل صورة</span>
                </div>
                {errors.images && <div className="image_error">{errors.images}</div>}
            </label>

            {/* Loading indicator */}
            {isConverting && <div className="UploadImages_loader" />}

            <div className="preview">
                {previewUrls.map((src, index) => (
                    <div key={index} className="preview-image">
                        <img src={src} alt={`preview-${index}`} />
                        <button
                            type="button"
                            className="remove_btn"
                            onClick={() => handleRemoveImage(index)}
                        >
                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.5 5.5L18.88 15.525C18.722 18.086 18.643 19.367 18 20.288C17.6826 20.7432 17.2739 21.1273 16.8 21.416C15.843 22 14.56 22 11.994 22C9.424 22 8.139 22 7.18 21.415C6.70589 21.1257 6.29721 20.7409 5.98 20.285C5.338 19.363 5.26 18.08 5.106 15.515L4.5 5.5M3 5.5H21M16.056 5.5L15.373 4.092C14.92 3.156 14.693 2.689 14.302 2.397C14.2151 2.33232 14.1232 2.27479 14.027 2.225C13.594 2 13.074 2 12.035 2C10.969 2 10.436 2 9.995 2.234C9.89752 2.28621 9.80453 2.34642 9.717 2.414C9.322 2.717 9.101 3.202 8.659 4.171L8.053 5.5M9.5 16.5V10.5M14.5 16.5V10.5" stroke="#DB161B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
