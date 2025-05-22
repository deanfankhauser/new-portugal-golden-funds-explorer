
import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { PdfDocument } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";

interface DocumentsSectionProps {
  documents?: PdfDocument[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-2xl font-bold">Documents</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <a 
              key={index} 
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all hover:bg-gray-100 group"
            >
              <FileText className="w-5 h-5 mr-3 text-[#EF4444]" />
              <span className="flex-grow font-medium">{doc.title}</span>
              <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-[#EF4444] transition-colors" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
