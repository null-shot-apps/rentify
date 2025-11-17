'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Bath, Calendar, Heart, Filter } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  amenities: string[];
  landlord: {
    name: string;
    phone: string;
  };
  marketer?: {
    name: string;
    phone: string;
  };
}

export default function TenantDashboard() {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: ''
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock properties data
    setProperties([
      {
        id: '1',
        title: 'Modern 2-Bedroom Apartment in Lekki',
        location: 'Lekki Phase 1, Lagos',
        price: 2500000,
        bedrooms: 2,
        bathrooms: 2,
        images: ['/api/placeholder/400/300'],
        description: 'Beautiful modern apartment with excellent amenities',
        amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Parking'],
        landlord: {
          name: 'Mr. Johnson',
          phone: '+234 801 234 5678'
        },
        marketer: {
          name: 'Sarah Properties',
          phone: '+234 802 345 6789'
        }
      },
      {
        id: '2',
        title: 'Spacious 3-Bedroom House in Ikeja',
        location: 'Ikeja GRA, Lagos',
        price: 3200000,
        bedrooms: 3,
        bathrooms: 3,
        images: ['/api/placeholder/400/300'],
        description: 'Family-friendly house in a quiet neighborhood',
        amenities: ['Garden', 'Parking', 'Security', 'Generator'],
        landlord: {
          name: 'Mrs. Adebayo',
          phone: '+234 803 456 7890'
        }
      }
    ]);
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = (!filters.minPrice || property.price >= parseInt(filters.minPrice)) &&
                        (!filters.maxPrice || property.price <= parseInt(filters.maxPrice));
    
    const matchesBedrooms = !filters.bedrooms || property.bedrooms === parseInt(filters.bedrooms);
    
    const matchesLocation = !filters.location || 
                           property.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesPrice && matchesBedrooms && matchesLocation;
  });

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const bookInspection = (property: Property) => {
    alert(`Booking inspection for ${property.title}. You will be contacted soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">RentDirect</h1>
              <span className="ml-4 text-gray-600">Tenant Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'Tenant'}
              </span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-32"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-32"
              />

              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Property Image
                </div>
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full ${
                    favorites.includes(property.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600'
                  } hover:scale-110 transition-transform`}
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.bathrooms} bath</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ₦{property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm">/year</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-xs text-gray-500 mb-4">
                  <div>Landlord: {property.landlord.name}</div>
                  {property.marketer && (
                    <div>Marketer: {property.marketer.name}</div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => bookInspection(property)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Inspection
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No properties found</div>
            <div className="text-gray-400">Try adjusting your search criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}
