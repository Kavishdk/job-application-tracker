import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '../types';
import { StatusBadge } from './StatusBadge';

export const JobCard: React.FC<{ job: JobApplication }> = ({ job }) => {
  return (
    <Link to={`/job/${job.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {job.role}
            </h3>
            <p className="text-sm text-gray-600 font-medium mt-1">
                {job.company}
                {job.jobType && <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{job.jobType}</span>}
                {job.source && <span className="text-gray-400 font-normal ml-2 text-xs">via {job.source}</span>}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {job.location}
              <span className="mx-1">•</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Applied: {new Date(job.appliedDate).toLocaleDateString()}
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-400">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};