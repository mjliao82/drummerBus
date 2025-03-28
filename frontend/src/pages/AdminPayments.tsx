import React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, DollarSign, CreditCard, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import PaymentDetailsModal from '../components/PaymentDetailsModal';

interface Payments {
  id: number,
  name: string,
  email: string,
  phone: string, 
  package:string,
  amount: string;
  day: string;
  time: string;
  date: string;
  method: string;
  invoice: string;
  paymentStatus: string;
}

function AdminPayments() {
  let URL: string;
  if (window.location.host === "https://lidrummerbus.web.app/") {
    URL = "https://drummerbus.onrender.com";
  } else {
    URL = "http://localhost:5001/";
  }
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [payments, setPayments] = React.useState<Payments[]>([]);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  


  // Sample payments data - in a real app, this would come from your backend
  const fetch_payments = async () => {
    try {
      const response = await fetch(`${URL}fetch/payments`, {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }
      const data = await response.json();
      setPayments(data);      
    } catch(err) {
      console.error('Error: ', err)
    }
  };

  useEffect(() => {
    fetch_payments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">Track and manage all payment transactions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$8,540</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-green-600">+8 this month</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-yellow-600">Follow up required</p>
              </div>
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
              <button className="flex items-center text-indigo-600 hover:text-indigo-700">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.package}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.paymentStatus .charAt(0).toUpperCase() + payment.paymentStatus .slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPayment({ ...payment });
                        console.log("Selected Payment:", payment);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <PaymentDetailsModal
            key={selectedPayment.id} // Force modal to update
            isOpen={!!selectedPayment}
            onClose={() => setSelectedPayment(null)}
            payment={selectedPayment}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPayments;