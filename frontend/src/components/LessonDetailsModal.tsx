import React, { useState } from 'react';
import Modal from './Modal';
import { Calendar, Clock, MapPin, Music2, DollarSign } from 'lucide-react';
import socket from '../utils/socket';

interface LessonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    day: string;
    time: string;
    instrument: string;
    duration: string;
    location?: string;
    name: string;
    status: string;
    price?: number;
    notes?: string;
  };
}

const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({
  isOpen,
  onClose,
  lesson
}) => {

  const [status, setStatus] = useState(lesson.status);
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus); // Update UI immediately for better UX
  };

  const handleProceed = () => {
    const respondToClient = {
      type: "Booking confirmation",
      name: lesson.name,
      day: lesson.day,
      time: lesson.time,
      duration: lesson.duration,
      status: status
    };
    console.log("Sending booking confirmation via websocket", respondToClient);
    socket.send(JSON.stringify(respondToClient));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Lesson Details - ${lesson.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Day & Time</p>
              <p className="text-gray-900">{lesson.day} at {lesson.time}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-gray-900">{lesson.duration}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Music2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Instrument</p>
              <p className="text-gray-900">{lesson.instrument}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="text-gray-900">${lesson.price?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-900">{lesson.location || 'To be determined'}</p>
          </div>
        </div>

        {lesson.notes && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{lesson.notes}</p>
          </div>
        )}
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
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lesson.status === 'Confirmed'
                ? 'bg-green-100 text-green-800'
                : lesson.status === 'Declined'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {lesson.status}
            </span>
          </div>
          {lesson.status !== 'Completed' && (
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
}

export default LessonDetailsModal;