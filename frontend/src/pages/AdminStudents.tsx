import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import StudentDetailsModal from '../components/StudentDetailsModal';
import PendingAccountModal from '../components/PendingAccountModal';

function AdminStudents() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null);
  const [showAddStudentModal, setShowAddStudentModal] = React.useState(false);
  const [selectedPendingAccount, setSelectedPendingAccount] = React.useState<any>(null);
  const [confirmDenyId, setConfirmDenyId] = React.useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Sample students data - in a real app, this would come from your backend
  const students = [
    {
      name: 'John Doe',
      age: 15,
      instruments: ['Rock Drums', 'Jazz Drums'],
      totalLessons: 24,
      nextLesson: {
        date: '2024-03-20',
        time: '15:00',
        instrument: 'Rock Drums'
      },
      address: '123 Music St, Harmony City',
      notes: 'Shows great potential in drum fills. Consider advanced rudiments.',
      progress: [
        {
          instrument: 'Rock Drums',
          level: 'Intermediate',
          lastAssessment: '2024-02-15'
        },
        {
          instrument: 'Jazz Drums',
          level: 'Beginner',
          lastAssessment: '2024-02-20'
        }
      ]
    },
    {
      name: 'Jane Smith',
      age: 12,
      instruments: ['Beginner Drums'],
      totalLessons: 16,
      nextLesson: {
        date: '2024-03-21',
        time: '16:00',
        instrument: 'Beginner Drums'
      },
      address: '456 Melody Ave, Harmony City',
      progress: [
        {
          instrument: 'Beginner Drums',
          level: 'Beginner',
          lastAssessment: '2024-02-18'
        }
      ]
    }
  ];

  // Sample pending accounts data
  const pendingAccounts = [
    {
      id: '1',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 123-4567',
      requestDate: '2024-03-18',
      preferredStyle: 'Rock Drums',
      experience: 'Beginner',
      notes: 'Interested in learning rock drumming basics. Available weekday evenings.'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 987-6543',
      requestDate: '2024-03-17',
      preferredStyle: 'Jazz Drums',
      experience: 'Intermediate',
      notes: 'Has been playing for 2 years. Looking to improve jazz techniques.'
    },
    {
      id: '3',
      name: 'David Wilson',
      email: 'david.w@example.com',
      phone: '(555) 456-7890',
      requestDate: '2024-03-15',
      preferredStyle: 'Metal Drums',
      experience: 'Beginner',
      notes: 'Complete beginner interested in metal drumming. Has own electronic kit.'
    }
  ];

  const handleApproveAccount = (accountId: string) => {
    // In a real app, this would call your backend API to approve the account
    console.log(`Approving account ${accountId}`);
    // Then remove from pending list and add to students
    setSelectedPendingAccount(null);
  };

  const handleDenyAccount = (accountId: string) => {
    // In a real app, this would call your backend API to deny the account
    console.log(`Denying account ${accountId}`);
    setSelectedPendingAccount(null);
    setConfirmDenyId(null);
  };

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
                <option>All Styles</option>
                <option>Rock Drums</option>
                <option>Jazz Drums</option>
                <option>Beginner Drums</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
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

        {/* Pending Accounts Section */}
        {pendingAccounts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Pending Account Requests</h2>
              </div>
              <span className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {pendingAccounts.length} Pending
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {pendingAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-amber-100/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{account.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{account.requestDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{account.preferredStyle}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {confirmDenyId === account.id ? (
                            <div className="flex items-center space-x-2 bg-red-50 px-2 py-1 rounded">
                              <span className="text-red-600 text-xs">Confirm?</span>
                              <button 
                                onClick={() => handleDenyAccount(account.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Confirm deny"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => setConfirmDenyId(null)}
                                className="text-gray-500 hover:text-gray-700"
                                title="Cancel"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => setSelectedPendingAccount(account)}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {selectedStudent && (
          <StudentDetailsModal
            isOpen={!!selectedStudent}
            onClose={() => setSelectedStudent(null)}
            student={selectedStudent}
          />
        )}

        {/* Pending Account Details Modal */}
        {selectedPendingAccount && (
          <PendingAccountModal
            isOpen={!!selectedPendingAccount}
            onClose={() => setSelectedPendingAccount(null)}
            account={selectedPendingAccount}
            onApprove={handleApproveAccount}
            onDeny={handleDenyAccount}
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
                    Drum Style Focus
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Beginner Drums</option>
                    <option>Rock Drums</option>
                    <option>Jazz Drums</option>
                    <option>Metal Drums</option>
                    <option>Latin Percussion</option>
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