import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import StudentDetailsModal from '../components/StudentDetailsModal';

function AdminStudents() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [showAddStudentModal, setShowAddStudentModal] = React.useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Sample students data - in a real app, this would come from your backend
  const students = [
    {
      name: 'John Doe',
      age: 15,
      instruments: ['Piano', 'Guitar'],
      totalLessons: 24,
      nextLesson: {
        date: '2024-03-20',
        time: '15:00',
        instrument: 'Piano'
      },
      address: '123 Music St, Harmony City',
      notes: 'Shows great potential in piano. Consider advanced repertoire.',
      progress: [
        {
          instrument: 'Piano',
          level: 'Intermediate',
          lastAssessment: '2024-02-15'
        },
        {
          instrument: 'Guitar',
          level: 'Beginner',
          lastAssessment: '2024-02-20'
        }
      ]
    },
    {
      name: 'Jane Smith',
      age: 12,
      instruments: ['Violin'],
      totalLessons: 16,
      nextLesson: {
        date: '2024-03-21',
        time: '16:00',
        instrument: 'Violin'
      },
      address: '456 Melody Ave, Harmony City',
      progress: [
        {
          instrument: 'Violin',
          level: 'Beginner',
          lastAssessment: '2024-02-18'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-2 text-gray-600">Manage your students and track their progress</p>
          </div>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Student
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent">
                <option>All Instruments</option>
                <option>Piano</option>
                <option>Guitar</option>
                <option>Violin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y">
            {students.map((student, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span>Age: {student.age}</span>
                      <span>•</span>
                      <span>{student.instruments.join(', ')}</span>
                      <span>•</span>
                      <span>{student.totalLessons} lessons</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View Details
                  </button>
                </div>
                {student.nextLesson && (
                  <div className="mt-4 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md text-sm">
                    Next Lesson: {student.nextLesson.instrument} on {student.nextLesson.date} at {student.nextLesson.time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            isOpen={!!selectedStudent}
            onClose={() => setSelectedStudent(null)}
            student={selectedStudent}
          />
        )}

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter student age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter parent/guardian name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter contact phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instruments
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Piano</option>
                    <option>Guitar</option>
                    <option>Violin</option>
                    <option>Drums</option>
                    <option>Voice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder="Add any notes about the student"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStudents;