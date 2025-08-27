import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
  maxLength?: number;
  showFullContent?: boolean;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({
  content,
  className = '',
  maxLength = 150,
  showFullContent = false
}) => {
  if (!content) {
    return <span className="text-gray-400">No content</span>;
  }

  // If we want to show full content or content is short enough, show it all
  if (showFullContent || content.length <= maxLength) {
    return (
      <div className={`prose prose-sm max-w-none ${className}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Otherwise, truncate and show preview
  const truncatedContent = content.substring(0, maxLength) + '...';
  
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {truncatedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay; 