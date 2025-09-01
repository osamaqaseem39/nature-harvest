import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { careersAPI } from '../services/api';
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    department: string;
    location: string;
  };
  candidateId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  applicationDate: string;
  coverLetter?: {
    content: string;
  };
  resume: {
    url: string;
    filename: string;
  };
  screening?: {
    isPassed: boolean;
    score: number;
    notes: string;
  };
  interviews: Array<{
    round: number;
    type: string;
    scheduledDate: string;
    status: string;
    feedback?: string;
  }>;
}

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    search: ''
  });

  const { data: applicationStats } = useApi(careersAPI.getApplicationStats);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };
      
      const response = await careersAPI.getAllApplications(params);
      if (response.data?.success) {
        setApplications(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await careersAPI.updateApplicationStatus(applicationId, { status: newStatus });
      fetchApplications();
    } catch (err) {
      setError('Failed to update application status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Applied': { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      'Under Review': { color: 'bg-yellow-100 text-yellow-800', icon: EyeIcon },
      'Shortlisted': { color: 'bg-green-100 text-green-800', icon: CheckIcon },
      'Interview Scheduled': { color: 'bg-purple-100 text-purple-800', icon: CalendarIcon },
      'Interview Completed': { color: 'bg-indigo-100 text-indigo-800', icon: ChatBubbleLeftIcon },
      'Offer Made': { color: 'bg-green-100 text-green-800', icon: CheckIcon },
      'Hired': { color: 'bg-green-100 text-green-800', icon: CheckIcon },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: XMarkIcon },
      'Withdrawn': { color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Applied'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
              <p className="mt-2 text-gray-600">
                Review and manage job applications
              </p>
            </div>
          </div>
        </div>

                {/* Stats Cards - Temporarily disabled due to TypeScript issues */}
        {/* 
        {applicationStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EyeIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Under Review</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Shortlisted</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Interviews</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        */}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Offer Made">Offer Made</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search by candidate name or email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job</label>
                <input
                  type="text"
                  value={filters.jobId}
                  onChange={(e) => setFilters(prev => ({ ...prev, jobId: e.target.value }))}
                  placeholder="Filter by job ID"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Job Applications</h3>
          </div>
          
          {error && (
            <div className="px-4 py-3 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interviews
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.candidateId.firstName} {application.candidateId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{application.candidateId.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.jobId.title}</div>
                        <div className="text-sm text-gray-500">
                          <BuildingOfficeIcon className="w-4 h-4 inline mr-1" />
                          {application.jobId.department}
                        </div>
                        <div className="text-sm text-gray-500">
                          <MapPinIcon className="w-4 h-4 inline mr-1" />
                          {application.jobId.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.applicationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.interviews.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.interviews.length} interview{application.interviews.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last: {formatDate(application.interviews[application.interviews.length - 1].scheduledDate)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No interviews</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {application.status === 'Applied' && (
                          <button
                            onClick={() => handleStatusChange(application._id, 'Under Review')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        )}
                        {application.status === 'Under Review' && (
                          <button
                            onClick={() => handleStatusChange(application._id, 'Shortlisted')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        {application.status === 'Under Review' && (
                          <button
                            onClick={() => handleStatusChange(application._id, 'Rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Candidate Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedApplication.candidateId.firstName} {selectedApplication.candidateId.lastName}</p>
                    <p><strong>Email:</strong> {selectedApplication.candidateId.email}</p>
                    <p><strong>Applied:</strong> {formatDate(selectedApplication.applicationDate)}</p>
                    <p><strong>Status:</strong> {selectedApplication.status}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Job Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Position:</strong> {selectedApplication.jobId.title}</p>
                    <p><strong>Department:</strong> {selectedApplication.jobId.department}</p>
                    <p><strong>Location:</strong> {selectedApplication.jobId.location}</p>
                  </div>
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedApplication.coverLetter.content}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Resume</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <a
                    href={selectedApplication.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {selectedApplication.resume.filename || 'View Resume'}
                  </a>
                </div>
              </div>

              {selectedApplication.interviews.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Interviews</h4>
                  <div className="space-y-2">
                    {selectedApplication.interviews.map((interview, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Round {interview.round}:</strong> {interview.type}</p>
                        <p><strong>Date:</strong> {formatDate(interview.scheduledDate)}</p>
                        <p><strong>Status:</strong> {interview.status}</p>
                        {interview.feedback && (
                          <p><strong>Feedback:</strong> {interview.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 