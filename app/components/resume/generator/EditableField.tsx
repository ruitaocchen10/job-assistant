"use client";

import { useState } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

export function EditableField({
  value,
  onSave,
  multiline = false,
  placeholder = "Click to edit",
  className = "",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-md border border-blue-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            rows={4}
            autoFocus
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-md border border-blue-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            autoFocus
            placeholder={placeholder}
          />
        )}
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`group relative cursor-pointer rounded-md px-2 py-1 hover:bg-gray-50 ${className}`}
    >
      <span>{value || placeholder}</span>
      <button
        className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
        title="Edit"
      >
        <svg
          className="inline h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    </div>
  );
}
