import React from 'react';
import { Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Pricing() {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: 'Starter Package',
      price: '140',
      duration: '4 Lessons',
      description: 'Perfect for beginners to try out our lessons',
      features: [
        '30-minute lessons',
        'Flexible scheduling',
        'Progress tracking',
        'Basic learning materials'
      ]
    },
    {
      name: 'Standard Package',
      price: '260',
      duration: '8 Lessons',
      description: 'Our most popular package for regular students',
      features: [
        '45-minute lessons',
        'Priority scheduling',
        'Detailed progress reports',
        'Extended learning materials',
        'Practice recommendations'
      ],
      popular: true
    },
    {
      name: 'Premium Package',
      price: '480',
      duration: '16 Lessons',
      description: 'Comprehensive package for dedicated learners',
      features: [
        '60-minute lessons',
        'Premium scheduling priority',
        'Customized learning path',
        'All learning materials included',
        'Regular performance evaluations',
        'Recording session included'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the perfect package for your musical journey</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-lg shadow-sm overflow-hidden ${plan.popular ? 'ring-2 ring-indigo-600' : ''}`}>
              {plan.popular && (
                <div className="bg-indigo-600 text-white text-center py-2">
                  <p className="text-sm font-medium">Most Popular</p>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/book')}
                  className={`w-full py-3 rounded-md text-lg font-semibold transition
                    ${plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start space-x-4">
            <Info className="h-6 w-6 text-indigo-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Notes</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• All packages include travel within our service area</li>
                <li>• Lessons must be used within 6 months of purchase</li>
                <li>• 24-hour cancellation policy applies</li>
                <li>• First-time students can try a single lesson before committing to a package</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;