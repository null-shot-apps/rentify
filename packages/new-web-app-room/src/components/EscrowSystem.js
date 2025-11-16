import { useState, useEffect, useCallback } from 'react';

export default function EscrowSystem({ rentalId, userRole }) {
  const [escrowDetails, setEscrowDetails] = useState(null);
  const [inspectionReport, setInspectionReport] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEscrowDetails();
  }, [rentalId, fetchEscrowDetails]);

  const fetchEscrowDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/escrow/${rentalId}`);
      const data = await response.json();
      setEscrowDetails(data);
    } catch (error) {
      console.error('Error fetching escrow details:', error);
    }
  }, [rentalId]);

  const submitInspectionReport = async (damageFound) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/escrow/${rentalId}/inspect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          damageFound,
          report: inspectionReport,
          inspectorId: 'current-user-id' // Replace with actual user ID
        })
      });

      if (response.ok) {
        alert('Inspection report submitted successfully!');
        fetchEscrowDetails();
      }
    } catch (error) {
      console.error('Error submitting inspection:', error);
      alert('Error submitting inspection report');
    }
    setLoading(false);
  };

  // Escrow release is handled through the inspection report submission

  if (!escrowDetails) {
    return <div className="p-4">Loading escrow details...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Escrow Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold text-blue-800">Caution Fee</h4>
          <p className="text-2xl font-bold text-blue-600">
            ₦{escrowDetails.cautionFee?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Status: {escrowDetails.status}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold text-green-800">Lease Period</h4>
          <p className="text-sm text-gray-600">
            Start: {new Date(escrowDetails.leaseStart).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            End: {new Date(escrowDetails.leaseEnd).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Admin/Marketer Inspection Interface */}
      {(userRole === 'admin' || userRole === 'marketer') && escrowDetails.status === 'pending_inspection' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Property Inspection</h4>
          
          <textarea
            value={inspectionReport}
            onChange={(e) => setInspectionReport(e.target.value)}
            placeholder="Enter detailed inspection report..."
            className="w-full p-3 border rounded-lg mb-4"
            rows="4"
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => submitInspectionReport(false)}
              disabled={loading || !inspectionReport.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              No Damage Found - Release to Tenant
            </button>
            
            <button
              onClick={() => submitInspectionReport(true)}
              disabled={loading || !inspectionReport.trim()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Damage Found - Release to Landlord
            </button>
          </div>
        </div>
      )}

      {/* Inspection History */}
      {escrowDetails.inspections && escrowDetails.inspections.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-3">Inspection History</h4>
          {escrowDetails.inspections.map((inspection, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {inspection.damageFound ? 'Damage Found' : 'No Damage'}
                  </p>
                  <p className="text-sm text-gray-600">{inspection.report}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(inspection.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm">
          <strong>Current Status:</strong> {escrowDetails.status}
        </p>
        {escrowDetails.status === 'released' && (
          <p className="text-sm text-green-600">
            Funds released to: {escrowDetails.releasedTo}
          </p>
        )}
      </div>
    </div>
  );
}






