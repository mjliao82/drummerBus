import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import React from 'react';

const InvoicePage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const location = useLocation();
  const payment = location.state?.payment || {};
  const [amount, setAmount] = React.useState(payment.amount || "");
  const [date, setDate] = React.useState(payment.date || "");
  const [packages, setPackage] = React.useState(payment.date || "");

  const sendInvoice = () => {


    const invoiceData = {
        type: "Send Invoice",
        id: payment.id,
        name: payment.name,
        amount,
        date,
        packages,
    };
    console.log("📡 Sending booking data via WebSocket:", invoiceData);
    socket.send(JSON.stringify(invoiceData));
    alert("Incoice sent!");
    navigate("/admin/payments");
  }
  


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-lg mt-18">
        {/* Fix: Added mt-20 to detach it from the navbar */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Invoice</h1>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <p className="text-gray-600 font-medium">Invoice for:</p>
            <p className="text-lg font-semibold text-gray-900">{payment.name || "N/A"}</p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-gray-600 font-medium">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}

              className="w-full p-3 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Package Input */}
          <div>
            <p className="text-gray-600 font-medium">Package:</p>
            <input
              type="text"
              value={packages}
              onChange={(e)=> setPackage(e.target.value)}
              className="w-full p-3 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />          
          </div>

          {/* Date Input */}
          <div>
            <label className="text-gray-600 font-medium">Invoice Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            onClick={sendInvoice}
            >
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
