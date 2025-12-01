import React, { useState } from 'react';
import { parseJobDescription } from '../services/geminiService';
import { JobService } from '../services/dbService';
import { JobStatus } from '../types';

interface AddJobModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onSaved }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [rawJD, setRawJD] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    salary: '',
    skills: '',
    experience: '',
    jobLink: '',
    source: '',
    jobType: 'Full Time',
    summary: '',
    resume: '',
    status: JobStatus.APPLIED
  });

  const handleParse = async () => {
    if (!rawJD.trim()) return;
    setIsParsing(true);
    setError(null);
    try {
      const parsed = await parseJobDescription(rawJD);
      setFormData({
        ...formData,
        ...parsed,
        source: parsed.source || '',
        jobType: parsed.jobType || 'Full Time',
        skills: parsed.skills.join(', '), // Convert array to comma-string for input
      });
      setStep(2);
    } catch (err) {
      setError("Failed to parse JD. Please try again or fill manually.");
      setStep(2); // Still allow manual entry
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // For mock purposes, we store the filename. 
      // In a real app, you would upload this to S3/Cloudinary or convert to Base64.
      setFormData({ ...formData, resume: e.target.files[0].name });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await JobService.create({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        rawJD,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError("Failed to save job.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              {step === 1 ? 'Add New Job Application' : 'Review & Save'}
            </h3>

            {step === 1 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Paste the full job description below. AI will extract the key details for you.</p>
                <textarea
                  className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="Paste JD text here..."
                  value={rawJD}
                  onChange={(e) => setRawJD(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3 mt-4">
                   <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                    onClick={() => setStep(2)}
                  >
                    Skip to Form
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:text-sm ${isParsing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleParse}
                    disabled={isParsing || !rawJD.trim()}
                  >
                    {isParsing ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Extracting...
                        </>
                    ) : 'Extract Details'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                 {error && <div className="p-2 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                    <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Link</label>
                        <input type="url" value={formData.jobLink} onChange={e => setFormData({...formData, jobLink: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Source</label>
                        <input 
                            type="text"
                            value={formData.source} 
                            onChange={e => setFormData({...formData, source: e.target.value})}
                            placeholder="e.g. LinkedIn"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select 
                            value={formData.jobType} 
                            onChange={e => setFormData({...formData, jobType: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Intern">Intern</option>
                            <option value="Intern + Full Time">Intern + Full Time</option>
                        </select>
                    </div>
                 </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
                    <div className="mt-1 flex items-center">
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                    {formData.resume && <p className="mt-1 text-xs text-green-600">Selected: {formData.resume}</p>}
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700">AI Summary</label>
                    <textarea rows={3} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                 </div>

                 <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-600 hover:text-gray-900 underline">Back</button>
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:text-sm"
                    >
                        Save Application
                    </button>
                 </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};