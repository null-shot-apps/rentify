'use client';

import Link from 'next/link';
import { Home, Users, Building, Shield } from 'lucide-react';

export default function RentDirectLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">RentDirect</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/login" className="text-gray-500 hover:text-gray-900">Login</Link>
              <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Rent Properties</span>
            <span className="block text-green-600">Without Agent Fees</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect directly with landlords and tenants in Nigeria. No more exploitative agent fees. 
            Secure payments, verified properties, and transparent transactions.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                Start Renting
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/properties" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Browse Properties
              </Link>
            </div>
          </div>
        </div>

        {/* User Types */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Choose Your Role</h2>
            <p className="mt-4 text-lg text-gray-500">Join as a landlord, tenant, or marketer</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Landlord */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto h-12 w-12 text-green-600">
                <Building className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Landlord</h3>
              <p className="mt-2 text-sm text-gray-500">List your properties and connect directly with tenants</p>
              <Link href="/register?type=landlord" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                List Property
              </Link>
            </div>

            {/* Tenant */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto h-12 w-12 text-blue-600">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tenant</h3>
              <p className="mt-2 text-sm text-gray-500">Find your perfect home without agent fees</p>
              <Link href="/register?type=tenant" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Find Home
              </Link>
            </div>

            {/* Marketer */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto h-12 w-12 text-purple-600">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Marketer</h3>
              <p className="mt-2 text-sm text-gray-500">Earn commissions by referring landlords and handling inspections</p>
              <Link href="/register?type=marketer" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Become Marketer
              </Link>
            </div>

            {/* Admin */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="mx-auto h-12 w-12 text-gray-600">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Admin</h3>
              <p className="mt-2 text-sm text-gray-500">Verify properties and handle disputes</p>
              <Link href="/login?type=admin" className="mt-4 inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose RentDirect?</h2>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Agent Fees</h3>
              <p className="mt-2 text-sm text-gray-500">Connect directly with landlords and save on exploitative agent commissions</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-sm text-gray-500">Escrow system protects both landlords and tenants with secure transactions</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verified Properties</h3>
              <p className="mt-2 text-sm text-gray-500">All properties are verified by our admin team before listing</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Home className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-white">RentDirect</span>
            </div>
            <p className="mt-4 text-gray-400">
              Connecting Nigerian landlords and tenants directly. No agent fees, no exploitation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

