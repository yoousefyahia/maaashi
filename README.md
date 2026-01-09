# Mashie

**Mashie** is a next-generation classified advertisements platform designed to connect buyers and sellers seamlessly. It features a robust, multi-step listing process that ensures high-quality data entry for updated various categories ranging from Real Estate to Jobs.

## 🚀 Key Features
### 1. 🔐 Advanced Authentication System
A secure and complete authentication flow to manage user access.
*   **Sign Up & Login:** Secure registration and login forms with validation.
*   **Password Recovery:** Complete flow for "Forgot Password" and "Reset Password" via email.
*   **Route Protection:** automatic redirection and specific components (`LoginRequiredCard`) to prompt unauthenticated users when trying to access restricted areas like posting ads or viewing the dashboard.
### 2. 📢 Intelligent Ad Posting Wizard
The core of Mashie is its granular, step-by-step ad creation process ensuring data quality.
*   **Step-by-Step Navigation:** Users are guided through Location → Category → Details → Photos → Contact Info → Confirmation.
*   **Dynamic Progress Tracking:** Visual progress bar (`AddHeader`) showing current status.
*   **Location Services:** Specific selection for regions (includes specialized Saudi Regions support).
*   **Seller Data Management:** Ability to review and edit seller contact details before publishing.
*   **Image Management:** Drag-and-drop capability, image preview, and sliders for multiple photos.
### 3. 📝 Specialized Category Forms
Mashie goes beyond generic text boxes. Each category has a dedicated form component with specific fields tailored to that industry:
*   **🚗 Vehicles (CarForm):** Inputs for specific car brands, models, transmission type, year, kilometers, and condition.
*   **🏠 Real Estate (RealestateForm):** Fields for property type, area (sqm), number of rooms, bathrooms, floor level, and finishing status.
*   **💼 Jobs (JobsForm):** Structured data for job titles, salary ranges, experience levels, and job types (full-time/part-time).
*   **🐕 Pets (PetsForm):** Specifics for pet type, breed, age, and vaccination history.
*   **📱 Electronics (ElectricForm):** Details for devices, brands, and usage status.
*   **👗 Fashion (FashionForm):** Attributes for clothing types, sizes, and conditions.
*   **🛋️ Furniture (FurnitureForm):** Categories for home and office furniture.
*   **🍔 Food (FoodForm):** Listings for homemade food or catering services.
*   **✈️ Trips & Tourism (TripsForm):** Details for travel packages and destinations.
*   **🌻 Gardens (GardensForm):** Landscaping and outdoor specific items.
*   **🛠️ General Services (ServicesForm):** For freelancers and service providers.
*   **📜 Anecdotes (AnecdotesForm):** Specialized section for collectibles or specific items.
### 4. 👤 Comprehensive User Dashboard
A powerful dashboard for users to manage their entire presence on the platform.
*   **My Account (`AccountUser`):** Manage profile details, avatar, and personal information.
*   **My Ads & Offers (`OffersUser`):** View, edit, or delete active listings.
*   **Favorites (`FavoritesUser`):** Quick access to saved ads for future reference.
*   **💬 Real-Time Chat (`Chat`):** Integrated messaging system allowing direct communication between buyers and sellers.
*   **🔔 Notifications (`NotificationsUser`):** Alert center for updates, messages, or ad statuses.
*   **⚙️ Settings (`SettingsUser`):** Application preferences and additional account configurations.
*   **Help Center (`HelpUser`):** Access to support and FAQs.
### 5. 🔍 Browsing & Discovery
*   **Category-Specific Pages:** dedicated pages for browsing ads within specific niches.
*   **Advanced Filtering:** (Implied) Filtering capability based on the structured data collected (e.g., filter cars by year).
*   **Public Profiles:** Ability to view public seller profiles (`ShowAnyUser`).
### 6. 🌐 Content & Community
*   **Blog System:** Integrated blog section (`Blog`, `BlogUser`) for news, tips, and platform updates.
*   **Static Pages:** Fully designed "About Us" and "Contact Us" pages.

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


