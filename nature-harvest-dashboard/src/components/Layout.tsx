import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: CubeIcon },
    { name: 'Brands', href: '/brands', icon: TagIcon },
    { name: 'Flavors', href: '/flavors', icon: StarIcon },
    { name: 'Sizes', href: '/sizes', icon: TagIcon },
    // Career Management Section
    { name: 'Job Postings', href: '/jobs', icon: BriefcaseIcon, section: 'careers' },
    { name: 'Applications', href: '/applications', icon: ClipboardDocumentListIcon, section: 'careers' },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon, section: 'careers' },
    { name: 'Skills & Requirements', href: '/skills', icon: AcademicCapIcon, section: 'careers' },
    { name: 'Career Analytics', href: '/career-analytics', icon: ChartBarIcon, section: 'careers' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Group navigation items by section
  const groupedNavigation = navigation.reduce((groups, item) => {
    const section = item.section || 'main';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(item);
    return groups;
  }, {} as Record<string, typeof navigation>);

  const renderNavigationItem = (item: any) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-primary-100 text-primary-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </Link>
    );
  };

  const renderNavigationSection = (section: string, items: typeof navigation) => {
    if (section === 'main') {
      return items.map(renderNavigationItem);
    }
    
    return (
      <div key={section} className="space-y-1">
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {section === 'careers' ? 'Career Management' : section}
        </div>
        {items.map(renderNavigationItem)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Nature Harvest</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {Object.entries(groupedNavigation).map(([section, items]) => (
              renderNavigationSection(section, items)
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Nature Harvest</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {Object.entries(groupedNavigation).map(([section, items]) => (
              renderNavigationSection(section, items)
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 