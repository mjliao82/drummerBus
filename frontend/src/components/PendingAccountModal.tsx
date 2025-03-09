import React from 'react';
import Modal from './Modal';
import { User, Mail, Phone, Calendar, Music, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PendingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    name: string;
    email: string;
    phone: string;
    requestDate: string;
    preferredStyle: string;
    experience: string;
    notes?: string;
  };
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const PendingAccountModal: React.FC<PendingAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onApprove,
  onDeny
}) => {
  const [showConfirmDeny, setShowConfirmDeny] = React.useState(false);

  const handleApprove = () => {
    onApprove(account.id);
  };

  const handleDeny = () => {
    onDeny(account.id);
    setShowConfirmDeny(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pending Account Request">
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-100 rounded-full p-3">
            <User className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{account.name}</h3>
            <p className="text-amber-600 font-medium">Pending Approval</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{account.email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{account.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Request Date</p>
              <p className="text-gray-900">{account.requestDate}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Music className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Preferred Style</p>
              <p className="text-gray-900">{account.preferredStyle}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
          <p className="text-gray-700">{account.experience}</p>
        </div>

        {account.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h4>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{account.notes}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          {showConfirmDeny ? (
            <div className="flex items-center space-x-4 bg-red-50 p-3 rounded-md">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">Are you sure you want to deny this request?</p>
              <button
                onClick={() => setShowConfirmDeny(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeny}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
              >
                Confirm Deny
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowConfirmDeny(true)}
                className="flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <XCircle className="h-5 w-5 mr-1" />
                Deny
              </button>
              <button
                onClick={handleApprove}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                <CheckCircle className="h-5 w-5 mr-1" />
                Approve Account
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PendingAccountModal;