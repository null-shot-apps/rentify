'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      // TODO: Implement actual registration
      console.log('Registration data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        address: data.address,
        verified: false, // New users need verification
        createdAt: new Date().toISOString()
      };
      
      console.log('New user created:', newUser);
      
      // Show success message
      alert(`Account created successfully! ${
        data.role === 'landlord' || data.role === 'marketer' 
          ? 'Please wait for admin verification before you can access all features.' 
          : 'You can now sign in to your account.'
      }`);
      
      // Redirect to login
      router.push('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="register" onSubmit={handleRegister} loading={loading} />;
}
