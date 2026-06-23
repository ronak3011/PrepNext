import { X } from 'lucide-react';

const PdfPreviewModal = ({ url, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content - Fixed Size to prevent resizing on hover */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-surface border border-borders rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-borders bg-surface shrink-0">
          <h3 className="text-lg font-semibold text-textPrimary truncate pr-4">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-textSecondary hover:text-textPrimary hover:bg-borders/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 w-full bg-cards relative">
          <iframe 
            src={url} 
            className="absolute inset-0 w-full h-full border-0"
            title={`PDF Preview: ${title}`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
