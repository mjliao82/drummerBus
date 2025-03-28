import React from 'react';
import Modal from './Modal';
import socket from '../utils/socket';
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
    status?: string;
  };
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const PendingAccountModal: React.FC<PendingAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onApprove,
}) => {

  const handleProceed = () => {
    onApprove(account.id);
    onClose();
  };

  const [status, setStatus] = React.useState(account.status);
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus); // Update UI immediately for better UX
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



        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-2.5 py-1 border rounded-md text-xs font-medium focus:ring focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          {account.status !== 'Completed' && (
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              onClick={handleProceed}
              >
              Proceed
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PendingAccountModal;