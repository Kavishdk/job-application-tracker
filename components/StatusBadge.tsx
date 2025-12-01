import React from 'react';
import { JobStatus } from '../types';

const statusColors: Record<JobStatus, string> = {
  [JobStatus.APPLIED]: 'bg-blue-100 text-blue-800',
  [JobStatus.ONLINE_TEST]: 'bg-purple-100 text-purple-800',
  [JobStatus.INTERVIEW]: 'bg-orange-100 text-orange-800',
  [JobStatus.OFFER]: 'bg-green-100 text-green-800',
  [JobStatus.REJECTED]: 'bg-red-100 text-red-800',
  [JobStatus.NO_RESPONSE]: 'bg-gray-100 text-gray-800',
};

export const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};
