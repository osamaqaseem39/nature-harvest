import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface MarkdownFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
}

const MarkdownField: React.FC<MarkdownFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  rows = 4,
  className = ''
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showPreview ? (
            <>
              <EyeSlashIcon className="h-4 w-4 mr-1" />
              Edit
            </>
          ) : (
            <>
              <EyeIcon className="h-4 w-4 mr-1" />
              Preview
            </>
          )}
        </button>
      </div>

      {showPreview ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[120px] prose prose-sm max-w-none">
          {value ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <span className="text-gray-400">No content to preview</span>
          )}
        </div>
      ) : (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!showPreview && (
        <div className="text-xs text-gray-500">
          <p>Markdown supported: <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code>, # Headers, - Lists, [links](url), tables, and more</p>
        </div>
      )}
    </div>
  );
};

export default MarkdownField; 