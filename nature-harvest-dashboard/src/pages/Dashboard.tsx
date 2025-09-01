import React from 'react';
import { useApi } from '../hooks/useApi';
import { dashboardAPI, productsAPI } from '../services/api';
import { 
  ChartBarIcon, 
  CubeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ShoppingBagIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Type definitions
interface DashboardStats {
  products: number;
  services: number;
  brands: number;
  categories: number;
  flavors: number;
  sizes: number;
  users: number;
  blogs: number;
  suppliers: number;
  quotes: number;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface SystemHealth {
  database: string;
  server: string;
  api: string;
  timestamp: string;
  uptime: number;
}

interface ActivityItem {
  id: string;
  type: string;
  action: string;
  description: string;
  timestamp: string;
  status: string;
}

const Dashboard = () => {
  const { data: stats, loading: statsLoading, error: statsError } = useApi(dashboardAPI.getStats);
  const { data: health } = useApi(dashboardAPI.getHealth);
  const { data: activity, loading: activityLoading } = useApi(dashboardAPI.getActivity);
  const { data: recentProducts, loading: productsLoading } = useApi(() => productsAPI.getAll({ limit: 5, sort: '-createdAt' }));

  // Type guard for products response - handle the case where useApi returns the data directly
  const isProductsResponse = (data: any): data is ProductsResponse => {
    return data && typeof data === 'object' && 'data' in data && Array.isArray(data.data);
  };

  // Handle both cases: when useApi returns the full response or just the data
  const products = recentProducts && typeof recentProducts === 'object' && 'data' in recentProducts 
    ? (recentProducts as ProductsResponse).data 
    : (Array.isArray(recentProducts) ? recentProducts : []);

  const statCards = [
    {
      title: 'Products',
      value: stats && typeof stats === 'object' && 'products' in stats ? (stats as DashboardStats).products : 0,
      icon: CubeIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Brands',
      value: stats && typeof stats === 'object' && 'brands' in stats ? (stats as DashboardStats).brands : 0,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      title: 'Categories',
      value: stats && typeof stats === 'object' && 'categories' in stats ? (stats as DashboardStats).categories : 0,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Flavors',
      value: stats && typeof stats === 'object' && 'flavors' in stats ? (stats as DashboardStats).flavors : 0,
      icon: CogIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Sizes',
      value: stats && typeof stats === 'object' && 'sizes' in stats ? (stats as DashboardStats).sizes : 0,
      icon: ShoppingBagIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
    {
      title: 'Users',
      value: stats && typeof stats === 'object' && 'users' in stats ? (stats as DashboardStats).users : 0,
      icon: UserGroupIcon,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
    },
  ];

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600">{statsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to Nature Harvest Dashboard. Monitor your business metrics and activities.
          </p>
        </div>

        {/* System Health */}
        {health && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    (health as SystemHealth).database === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    Database: {(health as SystemHealth).database}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    Server: {(health as SystemHealth).server}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    API: {(health as SystemHealth).api}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Products List */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
          </div>
          <div className="p-6">
            {productsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product: Product) => (
                  <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CubeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Brand: {product.brand}</span>
                          <span>Category: {product.category}</span>
                          <span>Price: ${product.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {activity && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {activityLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading activity...</p>
                </div>
              ) : (activity as ActivityItem[]) && (activity as ActivityItem[]).length > 0 ? (
                <div className="space-y-4">
                  {(activity as ActivityItem[]).slice(0, 5).map((item: ActivityItem, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()} at{' '}
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 