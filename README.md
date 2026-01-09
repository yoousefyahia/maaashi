# Mashie | Classifieds Platform

**Mashie** is a next-generation classified advertisements platform designed to connect buyers and sellers seamlessly. It features a robust, multi-step listing process that ensures high-quality data entry for updated various categories ranging from Real Estate to Jobs.

## 🚀 Key Features

### 1. Advanced Ad Creation Flow
Mashie implements a comprehensive, guided wizard for posting advertisements, ensuring users provide necessary details at every step:
*   **Step 1: Location Selection:** Precise targeting by city and region.
*   **Step 2: Category Selection:** Intuitive navigation through main categories and subcategories.
*   **Step 3: Detailed Information:** Dynamic forms that change based on the selected category.
*   **Step 4: Media Upload:** Drag-and-drop support for high-quality images.
*   **Step 5: Seller Data:** Verification and contact preference settings.
*   **Step 6: Confirmation:** Final review before publishing.

### 2. Specialized Category Forms
Unlike generic listing sites, Mashie provides tailored input fields for specific niches to structured data:
*   **🚗 Vehicles (CarForm):** Brand, Model, Year, Transmission, Kilometers, Condition.
*   **🏠 Real Estate (RealestateForm):** Area in sqm, Rooms, Floor, Amenities, Finishing Type.
*   **🐕 Pets (PetsForm):** Species (Dog/Cat/Bird), Breed, Age, Vaccination Status.
*   **💼 Jobs (JobsForm):** Job Role, Industry, Salary Range, Experience Level, Requirements.
*   **🔧 Services (ServicesForm):** Service Type, Availability, Pricing Model.
*   **Other Categories:** Fashion, Furniture, Food, Electronics, Trips, and more.

### 3. User Experience & Dashboard
*   **User Dashboard:** A central hub for users to manage active listings, favorites, and account settings.
*   **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop devices.
*   **Interactive UI:** Smooth transitions, toast notifications for feedback, and image sliders.

## 🛠️ Tech Stack

This project is built with a modern frontend stack focusing on performance and scalability:

*   **Core Framework:** [React v19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **State Management & Caching:** [TanStack Query v5](https://tanstack.com/query)
*   **Routing:** [React Router DOM v7](https://reactrouter.com/)
*   **Forms Management:** [Formik](https://formik.org/)
*   **Validation:** [Yup](https://github.com/jquense/yup)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **UI Components & Icons:**
    *   [React Icons](https://react-icons.github.io/react-icons/)
    *   [React Slick](https://react-slick.neostack.com/) (Carousels)
    *   [React Hot Toast](https://react-hot-toast.com/) (Notifications)

## 📂 Project Structure

The codebase is organized to support modularity and ease of maintenance. Each ad category has its own dedicated component folder.

```plaintext
src/
├── api/                        # API endpoints & centralized configuration
├── assets/                     # Static assets (Images, Global Styles, Fonts)
├── Components/
│   ├── AdvertisementsComponents/ # Specialized form components for each category
│   │   ├── AddHeader/          # Progress bar & header for ad flow
│   │   ├── CarForm/            # Vehicle specific inputs
│   │   ├── RealestateForm/     # Property specific inputs
│   │   ├── PetsForm/           # Pet attributes inputs
│   │   ├── JobsForm/           # Job details inputs
│   │   ├── FoodForm/           # Food services inputs
│   │   ├── TripsForm/          # Tourism & Trips inputs
│   │   └── ... (Fashion, Furniture, Electric, etc.)
│   └── ...
├── Pages/
│   ├── Advertisements/         # Main Ad Posting Flow Pages
│   │   ├── Location/           # Step 1: Select City/Area
│   │   ├── Category/           # Step 2: Choose Main/Sub Category
│   │   ├── Information/        # Step 3: Dynamic Form container
│   │   ├── UploadImages/       # Step 4: Media Upload Page
│   │   ├── SellerData/         # Step 5: Contact Info Page
│   │   └── ConfirmAd/          # Step 6: Success/Review Page
│   ├── Auth/                   # Authentication (Login, Register)
│   ├── DashboardUser/          # User personal area
│   └── Home/                   # Landing Page
├── Constants/                  # Static constants (Category IDs, Validation rules)
└── utils/                      # Helper functions
