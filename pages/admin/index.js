import { useState, useEffect } from 'react';
import { withAdminLayout } from '../../components/AdminLayout';
import Link from 'next/link';

// Mock data
const stats = [
  { name: 'Total Properties', value: '24', change: '+2.5%', changeType: 'increase' },
  { name: 'Active Listings', value: '18', change: '+5.2%', changeType: 'increase' },
  { name: 'Pending Approvals', value: '3', change: '-1.8%', changeType: 'decrease' },
  { name: 'Total Messages', value: '47', change: '+12.3%', changeType: 'increase' },
];

const recentActivity = [
  { id: 1, type: 'property', action: 'added', title: 'Luxury Villa in Kololo', time: '2h ago', user: 'John Doe' },
  { id: 2, type: 'message', action: 'received', title: 'New inquiry', time: '5h ago', user: 'Sarah Johnson' },
  { id: 3, type: 'property', action: 'updated', title: 'Beachfront Property', time: '1d ago', user: 'Michael Brown' },
];

function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) setProperties(await res.json());
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topProperties = [...properties].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}</h2>
            <p className="mt-1 text-gray-600">Here's what's happening today.</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Property
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
            <p className={`mt-2 text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600">
                        {activity.type === 'property' ? '🏠' : '✉️'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user} {activity.action} {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Properties */}
        <div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Properties</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {topProperties.map((property) => (
                <div key={property.id} className="p-4">
                  <div className="flex items-center">
                    <img 
                      className="h-12 w-12 rounded-md object-cover" 
                      src={property.image} 
                      alt={property.title} 
                    />
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {property.title.length > 30 ? `${property.title.substring(0, 30)}...` : property.title}
                      </h4>
                      <p className="text-sm text-gray-500">{property.price}</p>
                      <span className="text-xs text-indigo-600">{property.views || 0} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminLayout(Dashboard);
