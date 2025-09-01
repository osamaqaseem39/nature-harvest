import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  EyeIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  TrendingUpIcon,
} from '@heroicons/react/24/outline';

interface CareerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsThisMonth: number;
  averageApplicationsPerJob: number;
  topDepartments: Array<{ name: string; count: number }>;
  applicationStatuses: Array<{ status: string; count: number }>;
  monthlyTrends: Array<{ month: string; jobs: number; applications: number }>;
}

const CareerAnalytics: React.FC = () => {
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockStats: CareerStats = {
      totalJobs: 24,
      activeJobs: 18,
      totalApplications: 156,
      applicationsThisMonth: 23,
      averageApplicationsPerJob: 6.5,
      topDepartments: [
        { name: 'Production', count: 8 },
        { name: 'Sales & Marketing', count: 6 },
        { name: 'Research & Development', count: 4 },
        { name: 'IT & Technology', count: 3 },
        { name: 'Finance', count: 2 }
      ],
      applicationStatuses: [
        { status: 'Applied', count: 45 },
        { status: 'Under Review', count: 32 },
        { status: 'Shortlisted', count: 28 },
        { status: 'Interview Scheduled', count: 25 },
        { status: 'Hired', count: 18 },
        { status: 'Rejected', count: 8 }
      ],
      monthlyTrends: [
        { month: 'Jan', jobs: 3, applications: 12 },
        { month: 'Feb', jobs: 5, applications: 18 },
        { month: 'Mar', jobs: 4, applications: 15 },
        { month: 'Apr', jobs: 6, applications: 22 },
        { month: 'May', jobs: 8, applications: 28 },
        { month: 'Jun', jobs: 7, applications: 25 }
      ]
    };
    
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Career Analytics</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into your recruitment and career management
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeJobs}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalApplications}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.applicationsThisMonth}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Departments */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Top Departments by Job Count
              </h3>
              <div className="space-y-3">
                {stats.topDepartments.map((dept, index) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 w-8">{index + 1}.</span>
                      <span className="text-sm text-gray-600">{dept.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(dept.count / Math.max(...stats.topDepartments.map(d => d.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Application Statuses */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Application Status Distribution
              </h3>
              <div className="space-y-3">
                {stats.applicationStatuses.map((status) => (
                  <div key={status.status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{status.status}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(status.count / stats.totalApplications) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{status.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Monthly Trends
            </h3>
            <div className="grid grid-cols-6 gap-4">
              {stats.monthlyTrends.map((trend) => (
                <div key={trend.month} className="text-center">
                  <div className="text-sm font-medium text-gray-900">{trend.month}</div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">Jobs: {trend.jobs}</div>
                    <div className="text-xs text-gray-500">Apps: {trend.applications}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Insights</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Average applications per job: {stats.averageApplicationsPerJob}
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-yellow-500 mr-2" />
                {stats.activeJobs} out of {stats.totalJobs} jobs are currently active
              </div>
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 text-blue-500 mr-2" />
                {stats.applicationsThisMonth} new applications this month
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <TrendingUpIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                Consider posting more jobs in Production department as it has high application rates
              </div>
              <div className="flex items-start">
                <UserGroupIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                Review applications faster to reduce the "Under Review" backlog
              </div>
              <div className="flex items-start">
                <BriefcaseIcon className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                Focus on quality job descriptions to attract better candidates
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAnalytics; 