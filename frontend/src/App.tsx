import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import BookLessons from './pages/BookLessons';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentCalendar from './pages/StudentCalendar';
import AdminCalendar from './pages/AdminCalendar';
import AdminStudents from './pages/AdminStudents';
import AdminPayments from './pages/AdminPayments';
import Register from './pages/Register';
import Payments from './pages/Payments';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./pages/Checkout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);
function App() {
  const user = useAuthStore((state) => state.user);
  const showFooter = !user || user.role === 'client';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<BookLessons />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/calendar" element={<StudentCalendar />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/payments" element={<AdminPayments />} />

        <Route 
            path='/checkout'
            element={
              <Elements stripe={stripePromise}>
                <Checkout/>
              </Elements>
            }
        />

        <Route path="/register" element={<Register />} />

      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;