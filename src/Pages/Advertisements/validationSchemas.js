import * as Yup from "yup";

export const validationSchemas = {
    1: Yup.object({
        category: Yup.string().required("اختيار الفئة مطلوب"),
    }),
    2: (category) => {
        const base = Yup.object({
            information: Yup.object({
                adTitle: Yup.string().required("عنوان الإعلان مطلوب"),
                adDescription: Yup.string().required("الوصف مطلوب"),
                adPrice: Yup.string()
                    .notRequired()
                    .matches(/^(?:$|[٠-٩0-9]+(?:\.[٠-٩0-9]+)?)$/, "السعر لازم يكون رقم"),
                isNegotiable: Yup.boolean(),
            }),
        });

        if (category === "vehicles") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    vehicle: Yup.object({
                        brand: Yup.string().required("يجب ادخال الماركة"),
                        model: Yup.string().required("يجب ادخال الموديل"),
                        year: Yup.string().required("يجب ادخال سنة الصنع"),
                    }),
                }),
            });
        }

        if (category === "realestate") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    realestate: Yup.object({
                        realestateType: Yup.string().required("نوع العقار مطلوب"),
                        streetType: Yup.string().required("يجب ادخال نوع الشارع"),
                        realestateInterface: Yup.string().required("يجب ادخال الواجهة"),
                    }),
                }),
            });
        }

        if (category === "electronics") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    electronics: Yup.object({
                        deviceType: Yup.string().required("نوع الجهاز مطلوب"),
                        moreInfo: Yup.string().required("المعلومات الاضافية مطلوبة"),
                    }),
                }),
            });
        }

        if (category === "jobs") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    jobs: Yup.object({
                        jobType: Yup.string().required("نوع الوظيفة مطلوب"),
                    }),
                }),
            });
        }

        if (category === "furniture") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    furniture: Yup.object({
                        furnitureType: Yup.string().required("نوع الأثاث مطلوب"),
                    }),
                }),
            });
        }

        if (category === "services") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    services: Yup.object({
                        servicesType: Yup.string().required("نوع الخدمة مطلوب"),
                    }),
                }),
            });
        }

        if (category === "fashion") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    fashion: Yup.object({
                        fashionType: Yup.string().required("نوع الخدمة مطلوب"),
                        moreInfo: Yup.string().required("المعلومات الاضافية مطلوبة"),
                    }),
                }),
            });
        }

        if (category === "food") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    food: Yup.object({
                        foodType: Yup.string().required("نوع الطعام مطلوب"),
                    }),
                }),
            });
        }

        if (category === "pets") {
            return base.shape({
                information: Yup.object({
                    ...base.fields.information.fields,
                    pets: Yup.object({
                        animalType: Yup.string().required("نوع مطلوب"),
                    }),
                }),
            });
        }

        return base;
    },

    3: Yup.object({
        images: Yup.array()
            .of(Yup.string())
            .min(1, "لازم ترفع صورة واحدة على الأقل"),
    }),

    4: Yup.object({
        seller: Yup.object({
            name: Yup.string().required("الاسم مطلوب"),
            phone: Yup.string().matches(/^(?:(?:\+966|966)5\d{8}|05\d{8})$/, "الصيغة الصحيحة : 05xxxxxxxxx او 9665xxxxxxxxx").required("رقم الجوال مطلوب"),
            whatsAppMessage: Yup.boolean(),
            phoneMessage: Yup.boolean(),
        }),
    }),
    
    5: Yup.object({
        featured: Yup.boolean(),
        feeAgreement: Yup.boolean()
        .oneOf([true], "يجب الموافقة على اتفاقية الرسوم قبل نشر الإعلان"),
    }),

    // 6: Yup.object({
    //     location: Yup.object({
    //         detailedAddress: Yup.string().required("العنوان مطلوب"),
    //         city: Yup.string().required("المدينة مطلوبة"),
    //         area: Yup.string().required("المنطقة مطلوبة"),
    //     }),
    // }),
};