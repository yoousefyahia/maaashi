import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "./utils/auth";

// Layouts بدون lazy
import LayoutDashboard from "./LayoutDashboard/LayoutProfile";
import MainLayout from "./Layouts/MainLayout";

// Pages بدون lazy
import Home from "./Pages/Home/Home";
import SpecificCategory from "./Pages/SpecificCategory/SpecificCategory";
import Advertisements from "./Pages/Advertisements/Advertisements";
import DetailsLayout from "./Pages/DetailsLayout/DetailsLayout";
import SettingsUser from "./Pages/DashboardUser/SettingsUser/SettingsUser";
import AccountUser from "./Pages/DashboardUser/AccountUser/AccountUser";

// Lazy load الباقي
const AboutUs = lazy(() => import("./Pages/AboutUs/AboutUs"));
const Blog = lazy(() => import("./Pages/Blog/Blog"));
const ContactUs = lazy(() => import("./Pages/ContactUs/ContactUs"));
const Login = lazy(() => import("./Pages/Auth/Login"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const ForgotPassword = lazy(() => import("./Pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/Auth/ResetPassword"));
const ShowAnyUser = lazy(() => import("./Pages/ShowAnyUser/ShowAnyUser"));
const OffersUser = lazy(() => import("./Pages/DashboardUser/OffersUser/OffersUser"));
const NotifactionsUser = lazy(() => import("./Pages/DashboardUser/NotifactionsUser/NotifactionsUser"));
const FavoritesUser = lazy(() => import("./Pages/DashboardUser/FavoritesUser/FavoritesUser"));
const BlogUser = lazy(() => import("./Pages/DashboardUser/BlogUser/BlogUser"));
const HelpUser = lazy(() => import("./Pages/DashboardUser/HelpUser/HelpUser"));

const App = () => {
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);

  return (
    <Suspense fallback={<div className="lazy_loader" />}>
      <Routes>
        {/* صفحات عامة داخل MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/aboutUs" element={<MainLayout><AboutUs /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
        <Route path="/contactUs" element={<MainLayout><ContactUs /></MainLayout>} />
        <Route path="/:details/:id" element={<MainLayout><DetailsLayout /></MainLayout>} />
        <Route path="/:category" element={<MainLayout><SpecificCategory /></MainLayout>} />

        {/* show any user data */}
        <Route path="/user/:name/:userID" element={<MainLayout><ShowAnyUser /></MainLayout>} />

        {/* صفحات Dashboard */}
        <Route path="/accountUser" element={<LayoutDashboard><AccountUser /></LayoutDashboard>} />
        <Route path="/offersUser" element={<LayoutDashboard><OffersUser /></LayoutDashboard>} />
        <Route path="/notifactionsUser" element={<LayoutDashboard><NotifactionsUser /></LayoutDashboard>} />
        <Route path="/favoritesUser" element={<LayoutDashboard><FavoritesUser /></LayoutDashboard>} />
        <Route path="/settingsUser" element={<LayoutDashboard><SettingsUser /></LayoutDashboard>} />
        <Route path="/blogUser" element={<LayoutDashboard><BlogUser /></LayoutDashboard>} />
        <Route path="/helpUser" element={<LayoutDashboard><HelpUser /></LayoutDashboard>} />

        {/* صفحات الإعلانات */}
        <Route path="/Advertisements" element={<Advertisements />} />

        {/* صفحات تسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
};

export default App;
