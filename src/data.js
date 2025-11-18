export const vehicles = ["تويوتا", "هيونداي", "نيسان", "شيفروليه", "كيا", "فورد", "مرسيدس", "بي إم دبليو", "لكزس", "جيب", "جي ام سي", "ميتسوبيشي", "مازدا", "جيلي", "MG", "كاديلاك", "بورش", "فولكس واجن", "إنفينيتي", "تسلا"];

export const furniture = ["أثاث خارجي", "أثاث مكتبي", "أدوات منزلية", "أسرة ومراتب", "تحف وديكور", "خزائن ودواليب", "طاولات وكراسي", "مجالس ومفروشات",]

export const jobs = ["وظائف ادارية", "وظائف ازياء وتجميل", "امن وسلامة", "تعليمية", "تقنية وتصميم", "زراعة ورعي", "صناعية", "طب وتمريض", "عمالة منزلية", "مطاعم",]

export const services = ["مقاولات", "تعقيب", "توصيل", "نقل عفش", "خدمات نظافة", "قانونية", "محاسبية ومالية", "خدمات اخرى", ]

export const fashion = ["ساعات", "عطور وبخور", "مستلزمات رياضية", "نظارات", "أزياء رجالية", "أزياء نسائية", "أزياء ولوازم أطفال", "هدايا", "أمتعة سفر", "الصحة والجنال",]

export const electronics = ["جوالات", "تابلت", "كمبيوتر", "ألعاب إلكترونية", "تلفزيونات وصوتيات", "كاميرات تصوير", "حسابات واشتراكات", "أجهزة منزلية ومطبخ", "مواطير ومولدات",]

export const pets = ["جمال", "خيول", "أغنام", "ماعز", "أبقار", "دواجن", "بط", "حمام", "ببغاء", "كلاب", "قطط", "هامستر", "سناجب", "أسماك وسلاحف",]

export const realestate = ["اراضي للبيع", "اراضي لليجار", "شقق للايجار", "شقق للبيع", "بيوت للبيع", "عمارة للبيع", "استراحات للايجار", "استراحات للبيع", "محلات للايجار", "محلات للبيع", "فلل للايجار", "فلل للبيع", "مزارع للبيع", "مزارع للايجار", "مستودع للبيع", "مستودع للايجار", "مكاتب للبيع", "مكاتب للايجار",]

export const attributesMap = {
    vehicles: { key: "brand", data: vehicles },
    realestate: { key: "realestateType", data: realestate },
    electronics: { key: "electronicType", data: electronics },
    jobs: { key: "jobType", data: jobs },
    pets: { key: "animalType", data: pets },
    services: { key: "serviceType", data: services },
    furniture: { key: "furnitureType", data: furniture },
    fashion: { key: "fashionType", data: fashion },
};
export const specificCategoriesData = [
    { id: 1, key: "vehicles", name: "السيارات", title: "السيارات والمركبات", desc: "تصفح كل أنواع السيارات والمركبات", search: "ابحث عن السيارة التي تريدها..." },
    { id: 2, key: "realestate", name: "العقارات", title: "العقارات والشقق", desc: "تصفح كل أنواع العقارات والشقق", search: "ابحث عن العقار الذي تريده..." },
    { id: 3, key: "electronics", name: "الإلكترونيات", title: "الأجهزة والالكترونيات", desc: "تصفح جميع الأجهزة والالكترونيات", search: "ابحث عن الجهاز الذي تريده..." },
    { id: 4, key: "jobs", name: "الوظائف", title: "الوظائف بأنواعها", desc: "تصفح جميع أنواع الوظائف", search: "ابحث عن الوظيفة التي تريدها / تريديها..." },
    { id: 5, key: "furniture", name: "الأثاث", title: "الأثاث", desc: "تصفح جميع أنواع الأثاث", search: "ابحث عن الأثاث الذي تريده..." },
    { id: 6, key: "services", name: "الخدمات", title: "الخدمات بأنواعها", desc: "تصفح جميع أنواع الخدمات", search: "ابحث عن الخدمة التي  تريدها..." },
    { id: 7, key: "fashion", name: "الأزياء", title: "الأزياء بأنواعها", desc: "تصفح جميع أنواع الأزياء", search: "ابحث عن الزي الذي تريده/ تريديه..." },
    { id: 8, key: "food", name: "الأطعمة", title: "الأطعمة بأنواعها", desc: "تصفح جميع أنواع الأطعمة", search: "ابحث عن الطعام أو المشروب الذي تريده/ تريديه..." },
    { id: 9, key: "anecdotes", name: "النوادر", title: "النوادر بأنواعها", desc: "تصفح جميع أنواع النوادر", search: "ابحث عن النوادر  التي  تريدها..." },
    { id: 10, key: "gardens", name: "الحدائق", title: "الحدائق بأنواعها", desc: "تصفح جميع أنواع مستلزمات وزينة الحدائق بسهولة", search: "ابحث عن مستلزمات أو نباتات الحدائق..." },
    { id: 11, key: "trips", name: "الرحلات", title: "الرحلات بأنواعها", desc: "اكتشف جميع مستلزمات وأنشطة الرحلات بسهولة", search: "ابحث عن أدوات أو عروض الرحلات..." },
    { id: 12, key: "pets", name: "الحيوانات", title: "الحيوانات والمواشي", desc: "تصفح جميع الحيوانات والمواشي", search: "ابحث عن اسم اليحوان الذي تريده..." },
];
export const saudiRegions = [
    {
        id: 1,
        region: "الرياض",
        cities: ["الخرج", "الدرعية", "الدوادمي", "المجمعة", "القويعية", "وادي الدواسر", "الزلفي", "شقراء", "الأفلاج", "الغاط", "عفيف", "حوطة بني تميم", "الحريق", "السليل", "ضرماء", "المزاحمية", "ثادق", "رماح", "حريملاء", "مرات", "الدلم"]
    },
    {
        id: 2,
        region: "مكة المكرمة",
        cities: ["جدة", "الطائف", "القنفذة", "رابغ", "الليث", "الجموم", "خليص", "الكامل", "الخرمة", "رنية", "تربة", "المويه", "أضم", "ميسان", "بحرة"]
    },
    {
        id: 3,
        region: "المدينة المنورة",
        cities: ["المدينة المنورة", "ينبع", "العلا", "خيبر", "بدر", "الحناكية", "المهد", "العيص", "وادي الفرع", "الرايس"]
    },
    {
        id: 4,
        region: "القصيم",
        cities: ["بريدة", "عنيزة", "الرس", "المذنب", "البدائع", "البكيرية", "الأسياح", "رياض الخبراء", "عيون الجواء", "الشماسية"]
    },
    {
        id: 5,
        region: "المنطقة الشرقية",
        cities: ["الدمام", "الخبر", "الأحساء", "القطيف", "الجبيل", "رأس تنورة", "الخفجي", "النعيرية", "بقيق", "حفر الباطن"]
    },
    {
        id: 6,
        region: "عسير",
        cities: ["أبها", "خميس مشيط", "محايل عسير", "النماص", "تنومة", "رجال ألمع", "بيشة", "تثليث", "ظهران الجنوب", "سراة عبيدة"]
    },
    {
        id: 7,
        region: "تبوك",
        cities: ["تبوك", "الوجه", "أملج", "ضباء", "حقل", "تيماء", "البدع", "شرما", "المويلح", "المغاربة"]
    },
    {
        id: 8,
        region: "حائل",
        cities: ["حائل", "بقعاء", "الغزالة", "الشنان", "الحائط", "الشملي", "موقق", "السليمي", "سميراء", "تربه"]
    },
    {
        id: 9,
        region: "الحدود الشمالية",
        cities: ["عرعر", "رفحاء", "طريف", "العويقيلة", "شعبة نصاب", "الهباس", "جديدة عرعر", "الدويد", "أم خنصر", "الحيانية"]
    },
    {
        id: 10,
        region: "جازان",
        cities: ["جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "الدرب", "فرسان", "العارضة", "الريث", "فيفاء"]
    },
    {
        id: 11,
        region: "نجران",
        cities: ["نجران", "شرورة", "حبونا", "بدر الجنوب", "يدمة", "ثار", "الخرخير", "خباش", "المشعلية", "رجلا"]
    },
    {
        id: 12,
        region: "الباحة",
        cities: ["الباحة", "بلجرشي", "المندق", "المخواة", "قلوة", "العقيق", "القرى", "بني حسن", "غامد الزناد", "الحجرة"]
    },
    {
        id: 13,
        region: "الجوف",
        cities: ["سكاكا", "القريات", "دومة الجندل", "طبرجل", "الفياض", "ميقوع", "الرديفة", "عين الحواس", "الطوير", "الشويحطية"]
    }
];

export const attributeMapForDetails = (ad_details) => ({
    vehicles: [
        { icon: "/advertisements/car.svg", label: "الماركة", value: ad_details?.attributes?.brand },
        { icon: "/advertisements/car.svg", label: "الموديل", value: ad_details?.attributes?.model },
        { icon: "/advertisements/calendar.svg", label: "سنة الصنع", value: ad_details?.attributes?.year },
    ],
    realestate: [
        { icon: "/advertisements/buildings.svg", label: "نوع العقار", value: ad_details?.attributes?.realestateType },
        { icon: "/Icons/adDetails/PersonArmsSpread.svg", label: "نوع الشارع", value: ad_details?.attributes?.streetType },
        { icon: "/Icons/adDetails/ArrowsOutCardinal.svg", label: "الواجهة", value: ad_details?.attributes?.realestateFace },
    ],
    electronics: [
        { icon: "/advertisements/electronics.svg", label: "نوع الجهاز", value: ad_details?.attributes?.electronicType },
    ],
    pets: [
        { icon: "/advertisements/animals.svg", label: "نوع الحيوان", value: ad_details?.attributes?.animalType },
    ],
    jobs: [
        { icon: "/advertisements/jobs.svg", label: "نوع الوظيفة", value: ad_details?.attributes?.jobType },
    ],
    furniture: [
        { icon: "/advertisements/furniture.svg", label: "نوع الأثاث", value: ad_details?.attributes?.furnitureType },
    ],
    services: [
        { icon: "/advertisements/services.svg", label: "نوع الخدمات", value: ad_details?.attributes?.serviceType },
    ],
    food: [
        { icon: "/advertisements/food.svg", label: "نوع الطعام", value: ad_details?.attributes?.foodType },
    ],
    gardens: [
        { icon: "/advertisements/gardens.svg", label: "نوع الحدائق", value: ad_details?.attributes?.gardenType },
    ],
    anecdotes: [
        { icon: "/advertisements/anecdotes.svg", label: "نوع النوادر", value: ad_details?.attributes?.anecdoteType },
    ],
    trips: [
        { icon: "/advertisements/trips.svg", label: "نوع الرحلات", value: ad_details?.attributes?.tripType },
    ],
    fashion: [
        { icon: "/advertisements/fashion.svg", label: "نوع الزي", value: ad_details?.attributes?.fashionType },
    ],
});

export const CarFormOption = [
    { id: 1, brand: "تويوتا", models: ["كامري", "كورولا", "لاند كروزر", "هايلكس", "راف فور", "فورتشنر", "أفالون", "يارس", "إنوفا", "برادو"] },
    { id: 2, brand: "هيونداي", models: ["سوناتا", "النترا", "توسان", "كريتا", "سانتافي", "أكسنت", "باليسايد", "ستاريا", "فينيو", "أزيرا"] },
    { id: 3, brand: "نيسان", models: ["باترول", "صني", "التيما", "كيكس", "نافارا", "تيتان", "إكس تريل", "Z", "باثفايندر", "ماكسيما"] },
    { id: 4, brand: "شيفروليه", models: ["تاهو", "سلفرادو", "سوبربان", "كابتيفا", "ماليبو", "إكوينوكس", "ترافيرس", "إمبالا", "أفيو", "بليزر"] },
    { id: 5, brand: "كيا", models: ["سيراتو", "سبورتاج", "سونيت", "تيلورايد", "كارينز", "K5", "سيلتوس", "نيرو", "أوبتيما", "بيكانتو"] },
    { id: 6, brand: "فورد", models: ["إكسبلورر", "إكسبيديشن", "موستانج", "F-150", "رينجر", "توروس", "إيدج", "برونكو", "إسكايب", "فوكس"] },
    { id: 7, brand: "مرسيدس", models: ["C200", "E300", "S500", "GLE", "GLC", "A200", "CLA", "G63 AMG", "Maybach", "GLA"] },
    { id: 8, brand: "بي إم دبليو", models: ["320i", "520i", "X3", "X5", "X6", "730Li", "M4", "X1", "X7", "Z4"] },
    { id: 9, brand: "لكزس", models: ["ES350", "LX600", "RX350", "IS300", "GX460", "NX350", "LS500", "UX200", "RC350", "RX500h"] },
    { id: 10, brand: "جيب", models: ["رانجلر", "جراند شيروكي", "شيروكي", "كومباس", "جلاديتور", "باتريوت", "ليبرتي", "رينجيد", "كوماندر", "تريلبلايزر"] },
    { id: 11, brand: "جي ام سي", models: ["يوكن", "سييرا", "تيرين", "أكاديا", "دينالي", "كانين", "هامرز", "سافانا", "إينفيرا", "إيفويجن"] },
    { id: 12, brand: "ميتسوبيشي", models: ["باجيرو", "لانسر", "أوتلاندر", "إكليبس كروس", "ASX", "إكسباندر", "ميراج", "مونتيرو سبورت", "ديليكا", "جالانت"] },
    { id: 13, brand: "مازدا", models: ["CX-5", "CX-9", "مازدا 6", "مازدا 3", "CX-30", "MX-5", "2", "CX-50", "CX-90", "6 Turbo"] },
    { id: 14, brand: "جيلي", models: ["توجيلا", "كول راي", "أزكارا", "أوكافانغو", "إمجراند", "بينراي", "مونجارو", "ستوريا", "بينيو", "إمجراند X7"] },
    { id: 15, brand: "MG", models: ["ZS", "HS", "5", "RX8", "GT", "6", "RX5", "Marvel R", "One", "MG4 Electric"] },
    { id: 16, brand: "كاديلاك", models: ["إسكاليد", "CT5", "XT4", "XT5", "XT6", "CT4", "CT6", "LYRIQ", "V-Series", "SRX"] },
    { id: 17, brand: "بورش", models: ["كاين", "ماكان", "باناميرا", "911", "718 بوكستر", "718 كايمان", "تايكان", "كايين كوبيه", "GT3", "تيربو S"] },
    { id: 18, brand: "فولكس واجن", models: ["باسات", "تيغوان", "جيتا", "أرتيون", "طوارق", "بولو", "غولف GTI", "ID.4", "تيرامونت", "أماروك"] },
    { id: 19, brand: "إنفينيتي", models: ["Q50", "Q60", "QX50", "QX55", "QX60", "QX70", "QX80", "FX35", "G37", "EX35"] },
    { id: 20, brand: "تسلا", models: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster", "Plaid", "Semi", "P100D", "Long Range"] },
];

export const yearOptions = Array.from({ length: 36 }, (_, i) => 1990 + i);