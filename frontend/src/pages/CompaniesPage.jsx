import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Building,
  Plus,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Users,
} from 'lucide-react';

export const CompaniesPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Information Technology & Cloud',
    website: 'https://',
    location: 'San Francisco, CA',
    contactEmail: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/placements/companies');
      if (res.data.success) {
        setCompanies(res.data.data.companies || []);
      }
    } catch (err) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCompany.name) {
      toast.error('Please enter company name');
      return;
    }

    try {
      const res = await api.post('/placements/companies', newCompany);
      if (res.data.success) {
        toast.success('Partner company registered!');
        setIsAddModalOpen(false);
        setNewCompany({
          name: '',
          industry: 'Information Technology & Cloud',
          website: 'https://',
          location: 'San Francisco, CA',
          contactEmail: '',
          description: '',
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add company');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading corporate recruitment partners..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-7 h-7 text-brand-600" />
            Corporate Recruitment Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Partner tech companies, enterprise recruiters, and industry hiring partners
          </p>
        </div>

        {(role === 'ADMIN' || role === 'PLACEMENT_OFFICER') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner Company</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No companies registered yet"
              description="Add corporate partners using the button above."
            />
          </div>
        ) : (
          companies.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 p-2 flex items-center justify-center font-bold text-brand-700 text-lg">
                    {comp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <Badge variant="indigo" size="sm">
                    Tier-1 Partner
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-1">{comp.name}</h3>
                <p className="text-xs font-semibold text-brand-600 mb-2">{comp.industry}</p>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                  {comp.description ||
                    'Global technology enterprise specializing in scalable cloud software, AI, and developer tools.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{comp.location || 'Global Headquarters'}</span>
                </div>
                {comp.website && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      {comp.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Partner Company"
        subtitle="Add a new corporate recruiter to CampusFlow"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              placeholder="e.g. Microsoft Corporation"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Industry Sector</label>
              <input
                type="text"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                placeholder="Cloud & AI Infrastructure"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Headquarters Location</label>
              <input
                type="text"
                value={newCompany.location}
                onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                placeholder="Redmond, WA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Website</label>
              <input
                type="url"
                value={newCompany.website}
                onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                placeholder="https://microsoft.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">HR / Recruiter Email</label>
              <input
                type="email"
                value={newCompany.contactEmail}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, contactEmail: e.target.value })
                }
                placeholder="university-recruiting@company.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Overview</label>
            <textarea
              rows={3}
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              placeholder="Summary of enterprise domains, hiring practices, and internship partnerships..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Register Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
