import { useState, useEffect } from 'react';
import { withAdminLayout } from '../../../components/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';

function PropertiesPage({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProperties(); // Refresh the list
      } else {
        const error = await res.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your property listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Property
        </Link>
      </div>

      {/* Search and filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Land</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <li key={property.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                        <img 
                          className="h-full w-full object-cover" 
                          src={property.image} 
                          alt={property.title} 
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-indigo-600">{property.title}</h3>
                        <p className="text-sm text-gray-500">
                          {property.bedrooms} beds • {property.bathrooms} baths • {property.area || 'N/A'} sq ft
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">{property.price}</p>
                      <p className="text-sm text-gray-500">{property.status || 'Active'}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {property.location || 'Location not specified'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Last updated on <time dateTime={new Date(property.updatedAt || property.createdAt).toISOString()}>
                        {new Date(property.updatedAt || property.createdAt).toLocaleDateString()}
                      </time></p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => router.push(`/admin/properties/${property.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/properties/${property.id}/edit`)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try a different search term.' : 'Get started by creating a new property.'}
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/properties/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Property
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Pagination */}
      {filteredProperties.length > 0 && (
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{filteredProperties.length}</span> results
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default withAdminLayout(PropertiesPage);
