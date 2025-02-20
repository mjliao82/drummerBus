import React from 'react';
import Modal from './Modal';
import { User, Music, Calendar, Clock, MapPin } from 'lucide-react';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    age?: number;
    instruments: string[];
    totalLessons: number;
    nextLesson?: {
      date: string;
      time: string;
      instrument: string;
    };
    address?: string;
    notes?: string;
    progress?: {
      instrument: string;
      level: string;
      lastAssessment: string;
    }[];
  };
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
              {student.age && <p className="text-gray-500">Age: {student.age}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Instruments</h4>
              <div className="flex flex-wrap gap-2">
                {student.instruments.map((instrument) => (
                  <span
                    key={instrument}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    <Music className="h-4 w-4 mr-1" />
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Lessons</h4>
              <p className="text-gray-900">{student.totalLessons} lessons completed</p>
            </div>
          </div>

          {student.nextLesson && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Next Lesson</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-600">{student.nextLesson.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-600">{student.nextLesson.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-600">{student.nextLesson.instrument}</span>
                </div>
              </div>
            </div>
          )}

          {student.address && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-900">{student.address}</p>
              </div>
            </div>
          )}

          {student.progress && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Progress Tracking</h4>
              <div className="space-y-4">
                {student.progress.map((item) => (
                  <div key={item.instrument} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900">{item.instrument}</h5>
                      <span className="text-sm text-gray-500">Last assessed: {item.lastAssessment}</span>
                    </div>
                    <p className="text-gray-600">Current Level: {item.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {student.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{student.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button className="text-gray-600 hover:text-gray-700 font-medium">
              View Lesson History
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default StudentDetailsModal;