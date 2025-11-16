export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, phone, role, fullName, referralCode } = req.body;

  // Validate required fields
  if (!email || !password || !phone || !role || !fullName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // In a real app, you'd hash the password and save to database
    const hashedPassword = password; // Use bcrypt in production
    
    // Create user object
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      phone,
      role,
      fullName,
      referralCode: referralCode || null,
      verificationStatus: role === 'tenant' ? 'verified' : 'pending',
      createdAt: new Date().toISOString(),
      documents: []
    };

    // In production, save to database
    // For demo, we'll simulate success
    
    // If user was referred by a marketer, link them
    if (referralCode && role === 'landlord') {
      // Find marketer by referral code and link
      console.log(`Linking landlord ${email} to marketer with code ${referralCode}`);
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
        verificationStatus: newUser.verificationStatus
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
