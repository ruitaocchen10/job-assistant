"use client";

import { Application } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ApplicationCard } from "./ApplicationCard";
import { QuickAddCard } from "./QuickAddCard";
import { useState } from "react";

interface KanbanColumnProps {
  status: Application["status"];
  title: string;
  applications: Application[];
  onCardClick: (application: Application) => void;
  onAddApplication: (data: {
    company_name: string;
    job_title: string;
    job_url?: string;
    status: Application["status"];
  }) => Promise<void>;
}

const columnColors = {
  wishlist: "bg-gray-50 border-gray-200",
  applied: "bg-blue-50 border-blue-200",
  interviewing: "bg-yellow-50 border-yellow-200",
  offered: "bg-green-50 border-green-200",
  rejected: "bg-red-50 border-red-200",
  withdrawn: "bg-gray-50 border-gray-300",
};

const headerColors = {
  wishlist: "text-gray-700",
  applied: "text-blue-700",
  interviewing: "text-yellow-700",
  offered: "text-green-700",
  rejected: "text-red-700",
  withdrawn: "text-gray-700",
};

export function KanbanColumn({
  status,
  title,
  applications,
  onCardClick,
  onAddApplication,
}: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { setNodeRef } = useDroppable({ id: status });
  const applicationIds = applications.map((app) => app.id);

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      {/* Column Header */}
      <div
        className={`rounded-t-lg border-t border-l border-r p-3 ${columnColors[status]}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className={`font-semibold text-sm ${headerColors[status]}`}>
            {title}
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-white rounded-full px-2 py-0.5">
            {applications.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded px-2 py-1.5 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-b-lg border-b border-l border-r p-2 ${columnColors[status]} min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto`}
      >
        <SortableContext
          items={applicationIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {isAdding && (
              <QuickAddCard
                status={status}
                onAdd={onAddApplication}
                onCancel={() => setIsAdding(false)}
              />
            )}
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={() => onCardClick(application)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
