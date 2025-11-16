'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: any) => {
    setLoading(true);
    try {
      // TODO: Implement actual authentication
      console.log('Login data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - redirect based on role
      const mockUser = {
        id: '1',
        email: data.email,
        role: 'tenant', // This would come from the API
        firstName: 'John',
        lastName: 'Doe'
      };
      
      // Store user data (in real app, use proper auth state management)
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Redirect to appropriate dashboard
      switch (mockUser.role) {
        case 'tenant':
          router.push('/dashboard/tenant');
          break;
        case 'landlord':
          router.push('/dashboard/landlord');
          break;
        case 'marketer':
          router.push('/dashboard/marketer');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />;
}
