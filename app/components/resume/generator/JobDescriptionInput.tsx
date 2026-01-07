interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  const characterCount = value.length;

  return (
    <div className="space-y-2">
      <label
        htmlFor="job-description"
        className="block text-sm font-medium text-gray-700"
      >
        Job Description <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500">
        Paste the full job description here. The more detail, the better the AI
        can tailor your resume.
      </p>
      <textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        placeholder="Paste the job description here...

Example:
We are seeking a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate will have strong leadership skills and experience building scalable applications..."
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{characterCount} characters</span>
        {characterCount < 100 && (
          <span className="text-amber-600">
            Add more detail for better results
          </span>
        )}
      </div>
    </div>
  );
}
