# Mashie

**Mashie** is a comprehensive classified ads platform designed to facilitate selling, buying, and searching for various services. The platform allows users to post advertisements in diverse categories such as Real Estate, Pets, and General Services, featuring a modern, seamless user interface and a multi-step ad posting experience to ensure data accuracy.

## 🌟 Key Features

*   **Multi-step Ad Posting:** A structured and easy-to-use flow for posting ads, moving through stages: Category Selection, Location Setting, Details Entry, Image Upload, Seller Info, and Final Confirmation.
*   **Diverse Categories:** Comprehensive support for various categories (Real Estate, Pets, Services, etc.) with custom input forms tailored for each specific category.
*   **User Dashboard:** A private area for users to manage their ads, edit their profile, and track their activities.
*   **Advanced Browsing & Search:** Capabilities to browse and filter ads by category, location, or specific attributes.
*   **Responsive Design:** Fully responsive layout ensuring a consistent experience across all devices (Mobile, Tablet, Desktop) using modern CSS techniques.
*   **Image Management:** Seamless image uploading and viewing experience with integrated sliders.

## 🛠️ Tech Stack

The project is built using the latest web technologies to ensure high performance and speed:

### Frontend
*   **[React](https://react.dev/) (v19):** The core library for building the user interface.
*   **[Vite](https://vitejs.dev/):** Fast build tool and development environment.
*   **[React Router DOM](https://reactrouter.com/) (v7):** For managing navigation and routing within the app.
*   **[TanStack Query (React Query)](https://tanstack.com/query):** For efficient server state management and data fetching.
*   **[Axios](https://axios-http.com/):** For making HTTP requests.
*   **[Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup):** For building forms and handling data validation.
*   **[React Icons](https://react-icons.github.io/react-icons/):** Comprehensive icon library.
*   **[React Slick](https://react-slick.neostack.com/):** For image carousels and sliders.
*   **[React Hot Toast](https://react-hot-toast.com/) / Toastify:** For displaying notifications and user alerts.

## 📂 Project Structure

The project is organized to be scalable and easily maintainable:

  src/ ├── api/ # API configuration and endpoints ├── assets/ # Static assets and images ├── Components/ # Reusable components (Forms, Headers, Cards) │ ├── AdvertisementsComponents/ # Specific components for different ad forms │ └── ... ├── Constants/ # Application constants and static values ├── Layouts/ # General page layouts (Header, Footer layouts) ├── LayoutDashboard/ # User dashboard layout ├── Pages/ # Main application pages │ ├── Advertisements/ # Ad creation flow pages (Location, Category, Upload, etc.) │ ├── Auth/ # Login and Sign-up pages │ ├── Home/ # Homepage │ ├── DashboardUser/ # User dashboard pages │ └── ... ├── services/ # Helper functions for external services or business logic ├── Styles/ # Global styling files ├── utils/ # General helper (utility) functions ├── App.jsx # Main App component └── main.jsx # Application entry point
