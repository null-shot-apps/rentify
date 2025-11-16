// Mock database for demo
let properties = [
  {
    id: '1',
    landlordId: '1',
    title: 'Modern 3-Bedroom Apartment in Victoria Island',
    address: 'Victoria Island, Lagos',
    state: 'Lagos',
    lga: 'Eti-Osa',
    annualRent: 2500000,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Generator', 'Security', 'Parking'],
    photos: ['/api/placeholder/400/300', '/api/placeholder/400/301', '/api/placeholder/400/302'],
    description: 'Beautiful modern apartment with ocean view',
    status: 'approved',
    marketerId: null,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    landlordId: '1',
    title: '2-Bedroom Flat in Ikeja',
    address: 'Ikeja GRA, Lagos',
    state: 'Lagos',
    lga: 'Ikeja',
    annualRent: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Generator', 'Security', 'Parking'],
    photos: ['/api/placeholder/400/303', '/api/placeholder/400/304'],
    description: 'Comfortable apartment in serene environment',
    status: 'approved',
    marketerId: '3',
    createdAt: '2024-01-10T10:00:00Z'
  }
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get properties with filters
    const { state, minPrice, maxPrice, bedrooms, status = 'approved' } = req.query;
    
    let filteredProperties = properties.filter(p => p.status === status);
    
    if (state) {
      filteredProperties = filteredProperties.filter(p => 
        p.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => p.annualRent >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.annualRent <= parseInt(maxPrice));
    }
    
    if (bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === parseInt(bedrooms));
    }
    
    res.status(200).json(filteredProperties);
    
  } else if (req.method === 'POST') {
    // Create new property
    const {
      landlordId,
      title,
      address,
      state,
      lga,
      annualRent,
      bedrooms,
      bathrooms,
      amenities,
      photos,
      description,
      marketerId
    } = req.body;
    
    // Validate required fields
    if (!landlordId || !title || !address || !state || !annualRent || !bedrooms) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (!photos || photos.length < 5) {
      return res.status(400).json({ message: 'Minimum 5 photos required' });
    }
    
    const newProperty = {
      id: (properties.length + 1).toString(),
      landlordId,
      title,
      address,
      state,
      lga,
      annualRent: parseInt(annualRent),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      amenities: amenities || [],
      photos,
      description,
      status: 'pending', // Requires admin approval
      marketerId: marketerId || null,
      createdAt: new Date().toISOString()
    };
    
    properties.push(newProperty);
    
    res.status(201).json({
      message: 'Property listed successfully. Awaiting admin approval.',
      property: newProperty
    });
    
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
