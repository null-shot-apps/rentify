'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Bed, Bath, Home, Heart } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  landlord: {
    name: string;
    verified: boolean;
  };
  amenities: string[];
  status: 'available' | 'rented';
}

// Sample properties data
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3-Bedroom Apartment in Victoria Island',
    location: 'Victoria Island, Lagos',
    price: 2500000,
    bedrooms: 3,
    bathrooms: 2,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: 'Beautiful modern apartment with ocean view, fully furnished with modern amenities.',
    landlord: {
      name: 'Mr. Adebayo Johnson',
      verified: true
    },
    amenities: ['Air Conditioning', 'Generator', 'Swimming Pool', 'Security', 'Parking'],
    status: 'available'
  },
  {
    id: '2',
    title: 'Spacious 2-Bedroom Flat in Ikeja',
    location: 'Ikeja, Lagos',
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: 'Well-maintained apartment in a serene environment with good road network.',
    landlord: {
      name: 'Mrs. Fatima Abubakar',
      verified: true
    },
    amenities: ['Generator', 'Security', 'Parking', 'Water Supply'],
    status: 'available'
  },
  {
    id: '3',
    title: 'Luxury 4-Bedroom Duplex in Lekki',
    location: 'Lekki Phase 1, Lagos',
    price: 4500000,
    bedrooms: 4,
    bathrooms: 3,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: 'Luxury duplex with modern fittings, private garden, and 24/7 security.',
    landlord: {
      name: 'Chief Emmanuel Okafor',
      verified: true
    },
    amenities: ['Air Conditioning', 'Generator', 'Swimming Pool', 'Security', 'Parking', 'Garden'],
    status: 'available'
  },
  {
    id: '4',
    title: 'Affordable 1-Bedroom Apartment in Surulere',
    location: 'Surulere, Lagos',
    price: 800000,
    bedrooms: 1,
    bathrooms: 1,
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: 'Cozy apartment perfect for young professionals, close to major bus stops.',
    landlord: {
      name: 'Mr. Chinedu Okwu',
      verified: true
    },
    amenities: ['Generator', 'Security', 'Water Supply'],
    status: 'available'
  }
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = property.price >= priceRange.min && property.price <= priceRange.max;
      const matchesBedrooms = bedroomFilter === '' || property.bedrooms.toString() === bedroomFilter;
      const matchesLocation = locationFilter === '' || property.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesPrice && matchesBedrooms && matchesLocation;
    });
    
    setFilteredProperties(filtered);
  }, [searchTerm, priceRange, bedroomFilter, locationFilter, properties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">RentDirect</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/properties" className="text-green-600 font-medium">Properties</Link>
              <Link href="/login" className="text-gray-500 hover:text-gray-900">Login</Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or property name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Locations</option>
                  <option value="Victoria Island">Victoria Island</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Lekki">Lekki</option>
                  <option value="Surulere">Surulere</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  value={bedroomFilter}
                  onChange={(e) => setBedroomFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  value={priceRange.max === 10000000 ? '' : priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || 10000000})}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                  <Heart className="h-5 w-5 text-gray-400" />
                </button>
                <div className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                  Available
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.bathrooms} bath</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-sm text-gray-500">per year</p>
                  </div>
                  
                  <Link
                    href={`/properties/${property.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>

                {/* Landlord Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Listed by {property.landlord.name}</span>
                    {property.landlord.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <Home className="h-24 w-24" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
