import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CaretakerForm from "./pages/CaretakerForm";

// Pages that show the navbar + footer
function SiteLayout() {
  return (<><Navbar /><Outlet /><Footer /></>);
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/caretaker-form" element={<CaretakerForm />} />
          </Route>

          {/* Full-screen auth pages (no navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
