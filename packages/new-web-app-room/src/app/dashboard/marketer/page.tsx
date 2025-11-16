'use client';

import { useState } from 'react';
import { Users, Home, DollarSign, Calendar, TrendingUp, Eye } from 'lucide-react';

export default function MarketerDashboard() {
  const [stats] = useState({
    totalReferrals: 12,
    activeProperties: 8,
    totalEarnings: 450000,
    pendingInspections: 3
  });

  const [referredLandlords] = useState([
    { id: 1, name: 'Adebayo Johnson', properties: 3, totalEarnings: 180000, joinDate: '2024-01-15' },
    { id: 2, name: 'Fatima Hassan', properties: 2, totalEarnings: 120000, joinDate: '2024-02-20' },
    { id: 3, name: 'Chidi Okafor', properties: 3, totalEarnings: 150000, joinDate: '2024-03-10' }
  ]);

  const [inspectionRequests] = useState([
    { id: 1, property: '3 Bedroom Flat - Victoria Island', tenant: 'Sarah Adebayo', date: '2024-03-25', time: '2:00 PM' },
    { id: 2, property: '2 Bedroom Apartment - Lekki', tenant: 'Michael Ogun', date: '2024-03-26', time: '10:00 AM' },
    { id: 3, property: '4 Bedroom Duplex - Ikeja', tenant: 'Grace Emeka', date: '2024-03-27', time: '3:30 PM' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketer Dashboard</h1>
              <p className="text-gray-600">Manage your referrals and track earnings</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">Your Referral Code: MKT2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Inspections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingInspections}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referred Landlords */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Referred Landlords</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {referredLandlords.map((landlord) => (
                  <div key={landlord.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{landlord.name}</h3>
                      <p className="text-sm text-gray-600">{landlord.properties} properties • Joined {landlord.joinDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₦{landlord.totalEarnings.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inspection Requests */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Inspections</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {inspectionRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{request.property}</h3>
                        <p className="text-sm text-gray-600">Tenant: {request.tenant}</p>
                        <p className="text-sm text-gray-500">{request.date} at {request.time}</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                        Confirm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Share this link with landlords to earn commissions:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value="https://rentdirect.ng/register?ref=MKT2024"
                readOnly
                className="flex-1 p-2 border rounded-lg bg-white"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
