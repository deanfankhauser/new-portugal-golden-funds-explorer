
import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { PdfDocument } from '../../data/funds';

interface DocumentsSectionProps {
  documents?: PdfDocument[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-5 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
        <h2 className="text-2xl font-bold">Documents</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <a 
            key={index} 
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-100"
          >
            <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
            <span className="flex-grow">{doc.title}</span>
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;
