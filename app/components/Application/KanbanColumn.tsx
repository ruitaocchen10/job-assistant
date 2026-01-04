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
  wishlist: "bg-gray-100 border-gray-100",
  applied: "bg-blue-50 border-blue-50",
  interviewing: "bg-yellow-50 border-yellow-50",
  offered: "bg-green-50 border-green-50",
  rejected: "bg-red-50 border-red-50",
  withdrawn: "bg-gray-50 border-gray-50",
};

const headerColors = {
  wishlist: "text-gray-700",
  applied: "text-blue-700",
  interviewing: "text-yellow-700",
  offered: "text-green-700",
  rejected: "text-red-700",
  withdrawn: "text-gray-700",
};

const addButtonColors = {
  wishlist: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
  applied: "bg-white hover:bg-blue-100 text-blue-700 border border-blue-300",
  interviewing:
    "bg-white hover:bg-yellow-100 text-yellow-700 border border-yellow-300",
  offered: "bg-white hover:bg-green-100 text-green-700 border border-green-300",
  rejected: "bg-white hover:bg-red-100 text-red-700 border border-red-300",
  withdrawn: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
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
          className={`w-full text-center text-xs font-semibold rounded-md px-3 py-2 transition-all duration-200 shadow-sm hover:shadow cursor-pointer ${addButtonColors[status]}`}
        >
          + Add Application
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
