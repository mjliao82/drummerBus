import React from 'react';
import Modal from './Modal';
import { Calendar, Clock, MapPin, Music2, DollarSign } from 'lucide-react';

interface LessonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    date: string;
    time: string;
    instrument: string;
    duration: string;
    location?: string;
    student: string;
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lesson Details">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date & Time</p>
              <p className="text-gray-900">{lesson.date} at {lesson.time}</p>
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

        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lesson.status === 'Completed'
                ? 'bg-green-100 text-green-800'
                : lesson.status === 'Cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {lesson.status}
            </span>
          </div>
          {lesson.status !== 'Completed' && (
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Reschedule Lesson
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default LessonDetailsModal;