import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: ''
  });
  const [sortBy, setSortBy] = useState('price-asc');
  const router = useRouter();

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters when filters or sort change
  useEffect(() => {
    let result = [...properties];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        property =>
          property.title.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      const min = parseInt(filters.minPrice.replace(/[^0-9]/g, ''));
      result = result.filter(property => {
        const price = parseInt(property.price.replace(/[^0-9]/g, ''));
        return price >= min;
      });
    }

    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice.replace(/[^0-9]/g, ''));
      result = result.filter(property => {
        const price = parseInt(property.price.replace(/[^0-9]/g, ''));
        return price <= max;
      });
    }

    // Apply property type filter
    if (filters.propertyType) {
      result = result.filter(property => 
        property.title.toLowerCase().includes(filters.propertyType.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
      
      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProperties(result);
  }, [filters, properties, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: ''
    });
    setSortBy('price-asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Property Listings | Delight Homes</title>
        <meta name="description" content="Browse our selection of premium properties in Kampala, Uganda" />
      </Head>

      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Find Your Dream Property</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-100">
            Browse our selection of premium properties in Kampala, Uganda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range (UGX)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="minPrice" className="sr-only">Min Price</label>
                    <input
                      type="text"
                      id="minPrice"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="sr-only">Max Price</label>
                    <input
                      type="text"
                      id="maxPrice"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Listings */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing <span className="font-medium">{filteredProperties.length}</span> properties
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Name: A to Z</option>
                  <option value="title-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Property Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <Link 
                    href={`/properties/${property.id}`} 
                    key={property.id} 
                    className="group block h-full"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={property.image}
                          alt={property.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {property.description}
                        </p>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                          <span className="text-blue-600 font-semibold">{property.price}</span>
                          <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                            View Details
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Data is fetched client-side to enable real-time filtering and sorting
