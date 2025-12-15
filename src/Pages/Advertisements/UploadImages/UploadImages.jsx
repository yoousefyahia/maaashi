import React, { useState, useEffect } from "react";
import "./UploadImages.css";

export default function UploadImages({ formik }) {
  const { values, setFieldValue, errors } = formik;
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadError, setUploadError] = useState(""); // أي خطأ مباشر

  // توليد preview لكل الصور (جديدة أو روابط)
  useEffect(() => {
    const urls = values.images.map((img) => {
      if (typeof img === "string") return img;
      return URL.createObjectURL(img);
    });
    setPreviewUrls(urls);

    return () => {
      values.images.forEach((img) => {
        if (img instanceof File) URL.revokeObjectURL(img);
      });
    };
  }, [values.images]);

  // رفع الصور
  const handleImageUpload = (e) => {
    setUploadError("");
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];
    for (let file of files) {
      if (!file.type.startsWith("image/")) {
        setUploadError("الملف يجب أن يكون صورة فقط");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("حجم الصورة يجب أن يكون أقل من 10MB");
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) return;

    const combined = [...(values.images || []), ...validFiles];
    if (combined.length > 10) {
      setUploadError("يمكن رفع حتى 10 صور فقط");
    }

    setFieldValue("images", combined.slice(0, 10));
  };

  // إزالة صورة
  const handleRemoveImage = (index) => {
    const updated = [...values.images];
    updated.splice(index, 1);
    setFieldValue("images", updated);
    setUploadError("");
  };

  return (
    <div className="upload_container">
      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          hidden
        />
        <div className="upload-content">
          <div className="upload_icon">📷</div>
          <p>إضافة الصور</p>
          <span>حتى 10MB لكل صورة</span>
        </div>
      </label>

      {/* أي خطأ مباشر يظهر هنا */}
      {(uploadError || errors.images) && (
        <div className="image_error">{uploadError || errors.images}</div>
      )}

      <div className="preview">
        {previewUrls.map((src, i) => (
          <div key={i} className="preview-image">
            <img src={src} alt={`preview-${i}`} />
            <button
              type="button"
              className="remove_btn"
              onClick={() => handleRemoveImage(i)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
