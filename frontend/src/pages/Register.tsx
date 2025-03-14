import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, Phone, Home } from 'lucide-react';

function Register() {
    let URL: string;
    if (window.location.host === "ppub-iqventory.web.app") {
      URL = "future urls";
    } else {
      URL = "http://localhost:5001/";
    }
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');


    const [subRole, setSubRole] = React.useState<'Student' | 'Parent' | ''>('');
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });

    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, ''); // Remove non-numeric characters
        if (cleaned.length === 10) {
          return `+1${cleaned}`;
        }
        return phone.startsWith('+') ? phone : `+${cleaned}`;
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subRole) {
            alert('Please select Student or Parent');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const user = {
            id: Math.random().toString(),
            name: formData.name,
            email: formData.email,
            phone: formatPhoneNumber(formData.phone),
            address: formData.address,
            role: 'client' as 'client',
            subRole: subRole,
            createdAt: new Date(),
        };
        try {
            const account = {
                name: formData.name,
                email: formData.email,
                phone: formatPhoneNumber(formData.phone),
                address: formData.address,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                role: 'client',
                subRole: subRole,
            };
            
            const response = await fetch(`${URL}auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            setUser(user);
            setSuccess('Registration successful. Redirecting...');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }

        setUser(user);
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome! </h1>
                        <p className="mt-2 text-gray-600">Please enter your details to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSubRole('Student')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                    subRole === 'Student'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setSubRole('Parent')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                    subRole === 'Parent'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                Parent
                            </button>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <Home className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Enter your address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <p>Click on link to visit mobile number consent form: </p>
                            <a href="https://forms.gle/vG8QzNqBrcHiGP55A" target="_blank" rel="noopener noreferrer"    style={{ 
                                color: "#007bff", 
                                textDecoration: "underline", 
                                fontWeight: "bold", 
                                cursor: "pointer"
                            }}>
                                Consent Form
                            </a>
                        </div>

                        <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition">
                            Register New Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
