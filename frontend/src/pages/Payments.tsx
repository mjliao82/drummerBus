import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PaymentDetailsModal from '../components/PaymentDetailsModal';

function Payments() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/payments' } });
    }
  }, [user, navigate]);

  if (!user) return null;

  const paymentHistory = [
    {
      id: '1',
      amount: 260,
      date: '2024-03-15',
      method: 'Credit Card',
      status: 'completed',
      packageName: '8 Lesson Package',
      lessonCount: 8,
      transactionId: 'txn_1234567890'
    },
    {
      id: '2',
      amount: 140,
      date: '2024-02-28',
      method: 'Credit Card',
      status: 'completed',
      packageName: '4 Lesson Package',
      lessonCount: 4,
      transactionId: 'txn_0987654321'
    }
  ];

  const pendingPayments = [
    {
      id: '3',
      amount: 260,
      date: '2024-03-20',
      packageName: '8 Lesson Package',
      lessonCount: 8,
      dueDate: '2024-03-25'
    }
  ];

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
                        <p className="font-semibold text-gray-900">{payment.packageName}</p>
                        <p className="text-sm text-gray-600">Due by {payment.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ${payment.amount.toFixed(2)}
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
                        <p className="font-semibold text-gray-900">{payment.packageName}</p>
                        <p className="text-sm text-gray-600">
                          {payment.date} • {payment.method}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${payment.amount.toFixed(2)}
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