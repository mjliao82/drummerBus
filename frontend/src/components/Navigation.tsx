import React from 'react';
import { Menu, X, Music2, LogIn, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navigation = () => {
  // Determine the backend URL based on your host
  let URL;
  if (window.location.host === "ppub-iqventory.web.app") {
    URL = "future urls";
  } else {
    URL = "http://localhost:5001/";
  }

  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600' : 'text-gray-700';
  };

  // Combined backend and frontend logout logic
  const handleLogout = async () => {
    logout(); // Frontend logout
    try {
      const response = await fetch(`${URL}auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("logout error: ", error);
    }
    navigate('/');
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) {
      return [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/calendar', label: 'Calendar' },
        { path: '/admin/students', label: 'Students' },
        { path: '/admin/payments', label: 'Payments' },
      ];
    }

    return [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/book', label: 'Book Lessons' },
      { path: '/calendar', label: 'My Schedule' },
      { path: '/payments', label: 'Payments' },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center">
            <Music2 className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MusicBus</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive(item.path)} hover:text-indigo-600 transition`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 ${isActive(item.path)} hover:text-indigo-600`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-indigo-700 transition"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-indigo-700 transition"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
