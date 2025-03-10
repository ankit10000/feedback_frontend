import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import ShowFeedBackData from "./components/ShowFeedBackData";
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import AdminDashBoard from "./pages/AdminDashBoard";  // NavBar should be a separate component
import RegisterEmployee from "./pages/RegisterEmployee";
import ShowEmployees from "./pages/ShowEmployees";
import NavBar from "./pages/NavBar";
import { useEffect } from "react";
import AssignedApps from "./pages/AssignedApps";
import Profile from "./pages/Profile";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function AppLayout() {
    const location = useLocation();
    const hideNavbarRoutes = ["/"];  // Pages where the navbar should be hidden

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token && location.pathname !== "/") {
            window.location.href = "/";
        }
    }, [location.pathname]);

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <NavBar />} 
            <Routes>
                <Route path="/feedbackform" element={<FeedbackForm />} />
                <Route path="/show_data" element={<ShowFeedBackData />} />
                <Route path="/" element={<Login />} />
                <Route path="/register_admin" element={<RegisterAdmin />} />
                <Route path="/register_employee" element={<RegisterEmployee />} />
                <Route path="/admin_dashboard" element={<AdminDashBoard />} />
                <Route path="/show_employees" element={<ShowEmployees />} />
                <Route path="/assigned_apps" element={<AssignedApps />} />
                <Route path="/employee_dashboard" element={<EmployeeDashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;
