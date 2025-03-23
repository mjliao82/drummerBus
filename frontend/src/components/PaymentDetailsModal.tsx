import React from 'react';
import Modal from './Modal';
import { CreditCard, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
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
    transactionId?:string;
  };
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const navigate = useNavigate(); // Initialize navigate function

  if (!payment || !payment.paymentStatus) {
    return null;
  }

  

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <p className="text-2xl font-bold text-gray-900">${payment.amount}</p>
            <p className="text-sm text-gray-500">{payment.date}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            payment.paymentStatus === 'paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
 
          }`}>
            {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
          </span>
        </div>

        <div className="flex justify-between gap-6">
          <div className="flex items-start space-x-6">
            <CreditCard className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-gray-900">{payment.method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subscribed Time</p>
              <p className="text-gray-900">{payment.day}</p>
              <p className="text-gray-900">{payment.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Date</p>
              <p className="text-gray-900">{payment.date}</p>
            </div>
          </div>
          {payment.transactionId && (
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="text-gray-900">{payment.transactionId}</p>
              </div>
            </div>
          )}
        </div>

        {payment.package&& (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Package Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Package</p>
                <p className="text-gray-900">{payment.package}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          {payment.paymentStatus === 'unpaid' && payment.invoice==="false" && (
            <button className="bg-green-600 px-4 text-white py-2 rounded-md hover:bg-green-700 font-medium"
            onClick={() => navigate("/invoice", { state: { payment } })}
            >
              Send Invoice
            </button>
          )}
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Download Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentDetailsModal;