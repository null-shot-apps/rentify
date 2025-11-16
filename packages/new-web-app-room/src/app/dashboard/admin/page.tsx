'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Users, Home } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats] = useState({
    pendingVerifications: 8,
    pendingProperties: 12,
    activeDisputes: 3,
    totalUsers: 1247
  });

  const [pendingVerifications] = useState([
    { id: 1, name: 'Adebayo Johnson', type: 'Landlord', submitted: '2024-03-20', documents: ['ID', 'Utility Bill'] },
    { id: 2, name: 'Sarah Marketing', type: 'Marketer', submitted: '2024-03-21', documents: ['ID', 'Address Proof'] },
    { id: 3, name: 'Fatima Hassan', type: 'Landlord', submitted: '2024-03-22', documents: ['ID', 'Title Deed'] }
  ]);

  const [pendingProperties] = useState([
    { id: 1, title: '3 Bedroom Flat - Victoria Island', landlord: 'Adebayo Johnson', price: 2500000, submitted: '2024-03-20' },
    { id: 2, title: '2 Bedroom Apartment - Lekki', landlord: 'Fatima Hassan', price: 1800000, submitted: '2024-03-21' },
    { id: 3, title: '4 Bedroom Duplex - Ikeja', landlord: 'Chidi Okafor', price: 3200000, submitted: '2024-03-22' }
  ]);

  const [disputes] = useState([
    { id: 1, tenant: 'Michael Ogun', landlord: 'John Doe', property: '2BR Flat - Surulere', issue: 'Unreasonable quit notice', status: 'Open' },
    { id: 2, tenant: 'Grace Emeka', landlord: 'Jane Smith', property: '3BR House - Gbagada', issue: 'Maintenance issues', status: 'In Review' },
    { id: 3, tenant: 'David Ola', landlord: 'Peter Adamu', property: '1BR Studio - Yaba', issue: 'Caution fee dispute', status: 'Resolved' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage platform operations and user verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeDisputes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {['overview', 'verifications', 'properties', 'disputes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'verifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending User Verifications</h2>
                <div className="space-y-4">
                  {pendingVerifications.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.type} • Submitted {user.submitted}</p>
                        <p className="text-sm text-gray-500">Documents: {user.documents.join(', ')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Property Approvals</h2>
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{property.title}</h3>
                        <p className="text-sm text-gray-600">Landlord: {property.landlord}</p>
                        <p className="text-sm text-gray-500">₦{property.price.toLocaleString()}/year • Submitted {property.submitted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                          Review
                        </button>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'disputes' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dispute Management</h2>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{dispute.property}</h3>
                          <p className="text-sm text-gray-600">Tenant: {dispute.tenant} vs Landlord: {dispute.landlord}</p>
                          <p className="text-sm text-gray-500">Issue: {dispute.issue}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dispute.status === 'Open' ? 'bg-red-100 text-red-800' :
                            dispute.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {dispute.status}
                          </span>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• New landlord registration: Adebayo Johnson</li>
                      <li>• Property listed: 3BR Flat - Victoria Island</li>
                      <li>• Inspection booked: 2BR Apartment - Lekki</li>
                      <li>• Dispute resolved: Caution fee issue</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">System Health</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Payment system: ✅ Operational</li>
                      <li>• SMS notifications: ✅ Operational</li>
                      <li>• Email service: ✅ Operational</li>
                      <li>• File uploads: ✅ Operational</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

