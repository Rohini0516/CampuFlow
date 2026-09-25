import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Award,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionsModal, setSubmissionsModal] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Grade Modal
  const [gradeModalData, setGradeModalData] = useState(null);
  const [gradeInput, setGradeInput] = useState({ marks: '', feedback: '' });

  // Student Submit Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submissionPayload, setSubmissionPayload] = useState({
    fileUrl: '',
    content: '',
  });

  // Create Assignment Form
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    maxMarks: 100,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, subjRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/academic/subjects'),
      ]);

      if (assignRes.data.success) {
        setAssignments(assignRes.data.data.assignments || []);
      }
      if (subjRes.data.success) {
        const subs = subjRes.data.data.subjects || [];
        setSubjects(subs);
        if (subs.length > 0) {
          setNewAssignment((prev) => ({ ...prev, subjectId: subs[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate || !newAssignment.subjectId) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const res = await api.post('/assignments', newAssignment);
      if (res.data.success) {
        toast.success('Assignment created & published successfully!');
        setIsCreateModalOpen(false);
        setNewAssignment({
          title: '',
          description: '',
          subjectId: subjects[0]?._id || '',
          dueDate: '',
          maxMarks: 100,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setSubmissionsModal(assignment);
    try {
      setLoadingSubmissions(true);
      const res = await api.get(`/assignments/${assignment._id}/submissions`);
      if (res.data.success) {
        setSubmissionsList(res.data.data.submissions || []);
      }
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!submissionPayload.fileUrl && !submissionPayload.content) {
      toast.error('Please provide a file URL or text content');
      return;
    }

    try {
      const res = await api.post(`/assignments/${selectedAssignment._id}/submit`, submissionPayload);
      if (res.data.success) {
        toast.success('Assignment submitted successfully!');
        setSubmitModalOpen(false);
        setSubmissionPayload({ fileUrl: '', content: '' });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment');
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/assignments/submissions/${gradeModalData._id}/grade`, {
        marksObtained: Number(gradeInput.marks),
        feedback: gradeInput.feedback,
      });

      if (res.data.success) {
        toast.success('Grade recorded successfully');
        setGradeModalData(null);
        // Refresh submissions
        if (submissionsModal) {
          handleOpenSubmissions(submissionsModal);
        }
      }
    } catch (err) {
      toast.error('Failed to grade submission');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading coursework & assignments..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-brand-600" />
            Course Assignments & Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {role === 'STUDENT'
              ? 'View project briefs, submit solutions, and track grades & faculty remarks'
              : 'Create homework prompts, view submissions, and grade coursework'}
          </p>
        </div>

        {role !== 'STUDENT' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No active assignments"
              description="No coursework assignments have been published for your classes yet."
            />
          </div>
        ) : (
          assignments.map((item) => {
            const isDuePassed = new Date(item.dueDate) < new Date();
            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {item.subjectId?.code || 'CS-301'}
                    </span>
                    <Badge variant={isDuePassed ? 'danger' : 'success'} size="sm">
                      {isDuePassed ? 'Past Due' : 'Active'}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    </span>
                    <span className="font-bold text-slate-700">Max: {item.maxMarks} Pts</span>
                  </div>

                  {role === 'STUDENT' ? (
                    <button
                      onClick={() => {
                        setSelectedAssignment(item);
                        setSubmitModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmissions(item)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Review Submissions</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        subtitle="Publish a problem set, project, or homework task"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="e.g. Distributed Consensus Algorithm Implementation"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Course *</label>
              <select
                value={newAssignment.subjectId}
                onChange={(e) => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Marks *</label>
              <input
                type="number"
                required
                value={newAssignment.maxMarks}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Submission Deadline *</label>
            <input
              type="datetime-local"
              required
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instructions & Guidelines</label>
            <textarea
              rows={3}
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Provide prompt specifications, grading rubric, or expected deliverables..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Submit Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title || 'Assignment'}`}
        subtitle="Upload your solution link or write notes"
      >
        <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              GitHub Repository / Cloud Drive URL
            </label>
            <input
              type="url"
              value={submissionPayload.fileUrl}
              onChange={(e) =>
                setSubmissionPayload({ ...submissionPayload, fileUrl: e.target.value })
              }
              placeholder="https://github.com/username/project-repo"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Submission Text / Executive Summary
            </label>
            <textarea
              rows={4}
              value={submissionPayload.content}
              onChange={(e) =>
                setSubmissionPayload({ ...submissionPayload, content: e.target.value })
              }
              placeholder="Brief explanation of your implementation, design choices, or test results..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setSubmitModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Evaluation</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Faculty Submissions Review Modal */}
      <Modal
        isOpen={!!submissionsModal}
        onClose={() => setSubmissionsModal(null)}
        title={`Submissions: ${submissionsModal?.title || ''}`}
        subtitle="Review student solutions and assign marks"
        maxWidth="max-w-2xl"
      >
        {loadingSubmissions ? (
          <LoadingSpinner text="Fetching submissions..." />
        ) : submissionsList.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Students have not uploaded solutions for this assignment yet."
          />
        ) : (
          <div className="divide-y divide-slate-100 space-y-3">
            {submissionsList.map((sub) => {
              const u = sub.studentId?.userId || {};
              return (
                <div key={sub._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-slate-900 text-sm">{u.name || 'Alex Rivera'}</p>
                      <span className="font-mono text-[10px] text-slate-500">
                        {sub.studentId?.rollNumber}
                      </span>
                    </div>
                    {sub.fileUrl && (
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-600 hover:underline flex items-center space-x-1 mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{sub.fileUrl}</span>
                      </a>
                    )}
                    {sub.content && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{sub.content}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {sub.marksObtained !== undefined ? (
                      <Badge variant="success" size="sm">
                        {sub.marksObtained} / {submissionsModal.maxMarks} Pts
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Pending Grade
                      </Badge>
                    )}

                    <button
                      onClick={() => {
                        setGradeModalData(sub);
                        setGradeInput({
                          marks: sub.marksObtained || '',
                          feedback: sub.feedback || '',
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 font-bold text-xs transition-all"
                    >
                      Grade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Grade Entry Modal */}
      <Modal
        isOpen={!!gradeModalData}
        onClose={() => setGradeModalData(null)}
        title="Grade Submission"
        subtitle={`Assign points out of ${submissionsModal?.maxMarks || 100}`}
      >
        <form onSubmit={handleSaveGrade} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Marks Awarded *</label>
            <input
              type="number"
              required
              min="0"
              max={submissionsModal?.maxMarks || 100}
              value={gradeInput.marks}
              onChange={(e) => setGradeInput({ ...gradeInput, marks: e.target.value })}
              placeholder="e.g. 92"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Feedback / Comments</label>
            <textarea
              rows={3}
              value={gradeInput.feedback}
              onChange={(e) => setGradeInput({ ...gradeInput, feedback: e.target.value })}
              placeholder="Excellent code structure and comprehensive test cases."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setGradeModalData(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              Save Marks & Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
