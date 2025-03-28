import React from 'react';
import { useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PaymentDetailsModal from '../components/PaymentDetailsModal';
import socket from '../utils/socket';

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

interface History {
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

function Payments() {
  let URL: string;
  if (window.location.host === "https://lidrummerbus.web.app/") {
    URL = "https://drummerbus.onrender.com";
  } else {
    URL = "http://localhost:5001/";
  }
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [paymentHistory, setPaymentHistory] = React.useState<History[]>([]);
  const [pendingPayments, setPendingPayments] = React.useState<Payments[]>([]);

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payments' } });
    }
  }, [user, navigate]);

  if (!user) return null;

  const fetch_payments = async () => {
    try {
        const response = await fetch(`${URL}fetch/payments`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payments");
        }
        const data = await response.json(); 
        console.log(data)
        const userPayments = data.filter((payment: { name: string; }) => payment.name === user.name);
        const pending = userPayments.filter((payment: { paymentStatus: string; invoice: string; }) => payment.paymentStatus === "unpaid" && payment.invoice === "true");
        const history = userPayments.filter((payment: { paymentStatus: string; }) => payment.paymentStatus === "paid");
        setPendingPayments(pending);
        setPaymentHistory(history);

    } catch (err) {
        console.error('Error:', err);
    }
  };
  useEffect(() => {
    fetch_payments();
  }, []);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "Recieve Invoice") {
        setPendingPayments((prev) => [...prev, data.payload]);
      }
    };

    socket.addEventListener("message", handleMessage);
    
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">Manage your lesson payments and view history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-2xl font-bold text-gray-900">12 Lessons</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Payment Due</p>
                <p className="text-2xl font-bold text-gray-900">Mar 25</p>
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">$660.00</p>
              </div>
              <CreditCard className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Pending Payments</h2>
            </div>
            <div className="p-6">
              <div className="divide-y">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{payment.package}</p>
                        {/* <p className="text-sm text-gray-600">Due by {payment.dueDate}</p> */}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ${payment.amount}
                        </span>
                        <button
                          onClick={() => navigate('/checkout')}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          </div>
          <div className="p-6">
            <div className="divide-y">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 rounded-full p-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.package}</p>
                        <p className="text-sm text-gray-600">
                          {payment.date} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${payment.amount}
                      </span>
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Details Modal */}
        <PaymentDetailsModal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          payment={selectedPayment || {}}
        />
      </div>
    </div>
  );
}

export default Payments;