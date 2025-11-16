export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // In production, verify against database
    // For demo, simulate user lookup
    const mockUsers = {
      'landlord@test.com': { id: '1', role: 'landlord', fullName: 'John Landlord', verificationStatus: 'verified' },
      'tenant@test.com': { id: '2', role: 'tenant', fullName: 'Jane Tenant', verificationStatus: 'verified' },
      'marketer@test.com': { id: '3', role: 'marketer', fullName: 'Mike Marketer', verificationStatus: 'verified' },
      'admin@test.com': { id: '4', role: 'admin', fullName: 'Admin User', verificationStatus: 'verified' }
    };

    const user = mockUsers[email];
    
    if (!user || password !== 'password123') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In production, generate JWT token
    const token = `mock-jwt-token-${user.id}`;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email,
        role: user.role,
        fullName: user.fullName,
        verificationStatus: user.verificationStatus
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
