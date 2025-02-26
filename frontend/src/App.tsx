import {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookLessons from './pages/BookLessons';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientCalendar from './pages/ClientCalendar';
import AdminCalendar from './pages/AdminCalendar';
import AdminStudents from './pages/AdminStudents';
import AdminPayments from './pages/AdminPayments';
import Payments from './pages/Payments';

function App() {
  const { user, checkAuth } = useAuthStore();
  const showFooter = !user || user.role === 'client';
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookLessons />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/calendar" element={<ClientCalendar />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;