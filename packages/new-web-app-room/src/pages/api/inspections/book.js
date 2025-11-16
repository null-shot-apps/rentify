// Mock database for inspections
let inspections = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { propertyId, tenantId, preferredDate, preferredTime, tenantPhone, tenantEmail } = req.body;

  if (!propertyId || !tenantId || !preferredDate || !preferredTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the property to determine who to notify
    const properties = require('./properties/index.js').properties || [];
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const newInspection = {
      id: (inspections.length + 1).toString(),
      propertyId,
      tenantId,
      preferredDate,
      preferredTime,
      tenantPhone,
      tenantEmail,
      status: 'pending',
      assignedTo: property.marketerId || 'admin', // Assign to marketer or admin
      createdAt: new Date().toISOString(),
      confirmedDate: null,
      confirmedTime: null
    };

    inspections.push(newInspection);

    // In production, send notifications here
    // - Email/SMS to marketer or admin
    // - Email confirmation to tenant
    
    console.log(`Inspection booked for property ${propertyId}`);
    console.log(`Notifying: ${property.marketerId ? 'Marketer' : 'Admin'}`);

    res.status(201).json({
      message: 'Inspection booked successfully! You will be contacted to confirm the date and time.',
      inspection: newInspection
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Export inspections for other API routes
export { inspections };
