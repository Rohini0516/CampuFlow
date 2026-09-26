import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  FileCheck2,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const CertificatesPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [viewCertificateModal, setViewCertificateModal] = useState(null);

  const [newRequest, setNewRequest] = useState({
    type: 'BONAFIDE',
    purpose: 'Passport Application / Educational Loan verification',
    remarks: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/communication/certificates');
      if (res.data.success) {
        setRequests(res.data.data.requests || []);
      }
    } catch (err) {
      toast.error('Failed to load certificate requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.purpose) {
      toast.error('Please specify purpose of certificate');
      return;
    }

    try {
      const res = await api.post('/communication/certificates', newRequest);
      if (res.data.success) {
        toast.success('Certificate request submitted to Registrar Office!');
        setRequestModalOpen(false);
        setNewRequest({
          type: 'BONAFIDE',
          purpose: 'Passport Application / Educational Loan verification',
          remarks: '',
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleUpdateStatus = async (reqId, status) => {
    try {
      const res = await api.put(`/communication/certificates/${reqId}/status`, { status });
      if (res.data.success) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to update certificate request');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading certificate desk..." fullScreen />;
  }

  const certificateTypes = {
    BONAFIDE: 'Bonafide Student Certificate',
    LEAVING: 'College Leaving Certificate (LC)',
    TRANSCRIPT: 'Official Academic Transcript',
    RECOMMENDATION: 'Letter of Recommendation (LOR)',
    COURSE_COMPLETION: 'Course Completion Attestation',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-[#E27B88]" />
            E-Certificate & Document Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Request, approve, and download digitally signed university bonafide certificates and transcripts
          </p>
        </div>

        {role === 'STUDENT' && (
          <button
            onClick={() => setRequestModalOpen(true)}
            className="peach-button-primary text-xs sm:text-sm flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Request Certificate</span>
          </button>
        )}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No certificate requests found"
              description="Click 'Request Certificate' above to apply for official campus documentation."
            />
          </div>
        ) : (
          requests.map((item) => {
            const isApproved = item.status === 'APPROVED' || item.status === 'ISSUED';
            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-[#F0D9D5] p-6 shadow-sm hover:shadow-xl hover:border-[#EFA7B5] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-3 rounded-2xl bg-[#FFF5F1] text-[#A95763] border border-[#F0D9D5]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <Badge
                      variant={
                        item.status === 'APPROVED' || item.status === 'ISSUED'
                          ? 'success'
                          : item.status === 'REJECTED'
                          ? 'danger'
                          : 'peach'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-[#2D2526] text-base mb-1">
                    {certificateTypes[item.type] || item.type}
                  </h3>
                  <p className="text-xs text-[#6F6264] mb-3 font-medium">Purpose: {item.purpose}</p>

                  <div className="text-[11px] text-[#A95763] font-medium">
                    Requested on: {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0D9D5] space-y-2">
                  {isApproved ? (
                    <button
                      onClick={() => setViewCertificateModal(item)}
                      className="w-full py-2.5 rounded-xl bg-[#FFF5F1] hover:bg-[#E27B88] hover:text-white text-[#A95763] font-bold text-xs border border-[#F0D9D5] transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>View & Download Certificate</span>
                    </button>
                  ) : role === 'ADMIN' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'APPROVED')}
                        className="flex-1 py-2 rounded-xl peach-button-primary text-xs"
                      >
                        Approve & Issue
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'REJECTED')}
                        className="flex-1 py-2 rounded-xl peach-button-secondary text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#FFF5F1] border border-[#F0D9D5] text-[#A95763] text-xs font-semibold flex items-center justify-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Under Registrar Verification</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Request Certificate Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Apply for Official Certificate"
        subtitle="Submit documentation request to the University Office"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Certificate Type *</label>
            <select
              value={newRequest.type}
              onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
              className="w-full peach-input font-medium text-[#2D2526]"
            >
              <option value="BONAFIDE">Bonafide Student Certificate</option>
              <option value="TRANSCRIPT">Official Academic Transcript</option>
              <option value="RECOMMENDATION">Letter of Recommendation (LOR)</option>
              <option value="COURSE_COMPLETION">Course Completion Certificate</option>
              <option value="LEAVING">College Leaving / Transfer Certificate</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">
              Purpose & Organization Requiring It *
            </label>
            <input
              type="text"
              required
              value={newRequest.purpose}
              onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
              placeholder="e.g. Higher Education Application / Bank Education Loan"
              className="w-full peach-input"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Additional Remarks</label>
            <textarea
              rows={3}
              value={newRequest.remarks}
              onChange={(e) => setNewRequest({ ...newRequest, remarks: e.target.value })}
              placeholder="Any specific reference numbers or urgent dispatch notes..."
              className="w-full peach-input"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="peach-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* View / Print Digital Certificate Modal */}
      <Modal
        isOpen={!!viewCertificateModal}
        onClose={() => setViewCertificateModal(null)}
        title="Digitally Signed Campus Certificate"
        subtitle="Official certified copy"
        maxWidth="max-w-2xl"
      >
        {viewCertificateModal && (
          <div className="space-y-6">
            {/* Certificate Canvas */}
            <div className="p-8 rounded-2xl border-4 border-double border-[#A95763] bg-gradient-to-b from-[#FFF5F1] via-white to-[#FFF5F1] text-center relative overflow-hidden shadow-inner">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#E27B88] to-[#A95763] text-white flex items-center justify-center font-black text-xl mb-3 shadow-md">
                CF
              </div>

              <h2 className="text-xl font-serif font-black tracking-widest text-[#2D2526] uppercase mb-1">
                CampusFlow Institute of Technology
              </h2>
              <p className="text-[11px] font-mono text-[#A95763] uppercase tracking-wider mb-6 font-semibold">
                Accredited University • Office of the Registrar
              </p>

              <div className="inline-block px-4 py-1 rounded-full bg-[#FFF5F1] border border-[#F0D9D5] text-[#A95763] font-bold text-xs uppercase tracking-wider mb-6">
                {certificateTypes[viewCertificateModal.type] || viewCertificateModal.type}
              </div>

              <p className="text-xs sm:text-sm text-[#2D2526] leading-relaxed max-w-lg mx-auto mb-6">
                This is to certify that <strong>{user?.name || 'Alex Rivera'}</strong> is a bona fide
                student of this institution, currently enrolled in the{' '}
                <strong>Bachelor of Technology (Computer Science)</strong> program for the Academic
                Year 2025-2026.
              </p>

              <p className="text-xs text-[#6F6264] italic max-w-md mx-auto mb-8 font-medium">
                Issued for the purpose of: {viewCertificateModal.purpose}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-[#F0D9D5] text-xs">
                <div className="text-left">
                  <p className="font-mono text-[10px] text-[#A95763]">Date: {new Date().toLocaleDateString()}</p>
                  <p className="font-mono text-[10px] text-[#A95763]">Ref: CF-CERT-{viewCertificateModal._id?.substring(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <div className="font-serif font-bold text-[#2D2526] italic">Dr. Arthur Vance</div>
                  <div className="text-[10px] text-[#6F6264] font-semibold">Dean & Registrar</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="peach-button-primary text-xs flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
