"use client";

import React from "react";

type Job = {
  jobId: string;
  jobName: string;
  customDescription?: string;
  generalDescription?: string;
};

type JobsListProps = {
  jobs: Job[];
};

export default function JobsList({ jobs }: JobsListProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm">
        No hay trabajos registrados
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="font-medium text-gray-900 dark:text-gray-100">
        Trabajos y descripciones
      </p>
      {jobs.map((job) => (
        <div
          key={job.jobId}
          className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {job.jobName}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {job.customDescription || job.generalDescription || "Sin descripción"}
          </p>
          {job.customDescription && (
            <span className="inline-block mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Descripción personalizada
            </span>
          )}
        </div>
      ))}
    </div>
  );
}