import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobService } from '../services/dbService';
import { JobApplication, JobStatus, RoundType, RoundResult, InterviewRound } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingRound, setIsAddingRound] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  // New Round State
  const [newRound, setNewRound] = useState({
    roundType: RoundType.TECHNICAL,
    questions: '',
    feedback: '',
    result: RoundResult.PENDING,
    roundNumber: 1
  });

  const fetchJob = async () => {
    if (!id) return;
    setLoading(true);
    const data = await JobService.getById(id);
    setJob(data || null);
    if(data) setNewRound(prev => ({...prev, roundNumber: (data.rounds?.length || 0) + 1}));
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!job) return;
    const newStatus = e.target.value as JobStatus;
    await JobService.updateStatus(job.id, newStatus);
    setJob({ ...job, status: newStatus });
  };

  const handleAddRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    await JobService.addRound(job.id, {
        ...newRound,
        date: new Date().toISOString()
    });
    setIsAddingRound(false);
    setNewRound({
        roundType: RoundType.TECHNICAL,
        questions: '',
        feedback: '',
        result: RoundResult.PENDING,
        roundNumber: (job.rounds?.length || 0) + 2
    });
    fetchJob();
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>;
  if (!job) return <div className="text-center py-12">Job not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">&larr; Back to Dashboard</Link>
      
      {/* Header Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.role}</h1>
                <h2 className="text-xl text-primary-600 font-semibold">{job.company}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {job.salary}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select 
                        value={job.status} 
                        onChange={handleStatusChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                        {Object.values(JobStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 {job.jobLink && (
                    <a href={job.jobLink} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                        View Original Post <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                 )}
            </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Summary</h3>
                    <p className="mt-1 text-gray-900 text-sm leading-relaxed">{job.summary}</p>
                </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <button onClick={() => setShowRaw(!showRaw)} className="text-xs text-gray-500 underline">
                        {showRaw ? 'Hide Raw JD' : 'Show Full Job Description'}
                    </button>
                    {showRaw && (
                        <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 whitespace-pre-wrap font-mono h-48 overflow-y-auto border border-gray-200">
                            {job.rawJD}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-100 h-fit">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Applied:</dt>
                        <dd className="font-medium text-gray-900">{new Date(job.appliedDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Experience:</dt>
                        <dd className="font-medium text-gray-900">{job.experience}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Job Type:</dt>
                        <dd className="font-medium text-gray-900">{job.jobType || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-500">Source:</dt>
                        <dd className="font-medium text-gray-900">{job.source || 'N/A'}</dd>
                    </div>
                    {job.resume && (
                        <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                            <dt className="text-gray-500">Resume:</dt>
                            <dd className="font-medium text-primary-600 flex items-center gap-1 overflow-hidden max-w-[120px]" title={job.resume}>
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="truncate text-xs">{job.resume}</span>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
      </div>

      {/* Interview Rounds */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Interview Timeline</h3>
            <button 
                onClick={() => setIsAddingRound(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
            >
                + Add Round
            </button>
        </div>

        {isAddingRound && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <h4 className="text-sm font-semibold mb-3">Log Round {newRound.roundNumber}</h4>
                <form onSubmit={handleAddRound} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                             <label className="block text-xs font-medium text-gray-700">Type</label>
                             <select 
                                value={newRound.roundType} 
                                onChange={e => setNewRound({...newRound, roundType: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                             >
                                {Object.values(RoundType).map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                         <div>
                             <label className="block text-xs font-medium text-gray-700">Result</label>
                             <select 
                                value={newRound.result} 
                                onChange={e => setNewRound({...newRound, result: e.target.value})}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                             >
                                {Object.values(RoundResult).map(r => <option key={r} value={r}>{r}</option>)}
                             </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Questions Asked</label>
                        <textarea rows={2} value={newRound.questions} onChange={e => setNewRound({...newRound, questions: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="Key technical questions..."></textarea>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-700">Feedback / Notes</label>
                        <textarea rows={2} value={newRound.feedback} onChange={e => setNewRound({...newRound, feedback: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end gap-2">
                         <button type="button" onClick={() => setIsAddingRound(false)} className="text-xs text-gray-600 px-3 py-1">Cancel</button>
                         <button type="submit" className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700">Save Round</button>
                    </div>
                </form>
            </div>
        )}

        <div className="flow-root">
            <ul className="-mb-8">
                {(!job.rounds || job.rounds.length === 0) ? (
                    <li className="text-sm text-gray-500 italic pb-8">No interview rounds recorded yet.</li>
                ) : (
                    job.rounds.map((round, idx) => (
                        <li key={round.id}>
                            <div className="relative pb-8">
                                {idx !== (job.rounds?.length || 0) - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                            round.result === RoundResult.PASS ? 'bg-green-500' : 
                                            round.result === RoundResult.FAIL ? 'bg-red-500' : 'bg-gray-400'
                                        }`}>
                                            <span className="text-white text-xs font-bold">{round.roundNumber}</span>
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-900 font-medium">
                                                {round.roundType} <span className="text-gray-400 font-normal">• {new Date(round.date).toLocaleDateString()}</span>
                                            </p>
                                            {round.questions && (
                                                <div className="mt-2 text-sm text-gray-700">
                                                    <span className="font-medium text-xs uppercase text-gray-500">Questions:</span>
                                                    <p>{round.questions}</p>
                                                </div>
                                            )}
                                             {round.feedback && (
                                                <div className="mt-1 text-sm text-gray-500">
                                                    <span className="font-medium text-xs uppercase text-gray-400">Notes:</span>
                                                    <p>{round.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                                 round.result === RoundResult.PASS ? 'bg-green-100 text-green-800' : 
                                                 round.result === RoundResult.FAIL ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {round.result}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
      </div>
    </div>
  );
};