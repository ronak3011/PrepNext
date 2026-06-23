import { FileText, Download, Bookmark, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useBookmarks } from '../hooks/useBookmarks'
import StarRating from './StarRating'

const ResourceCard = ({ resource, subjectName }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const resourceId = resource._id || resource.id
  const bookmarked = isBookmarked(resourceId)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // The backend proxy handles tracking and renaming the file
  const downloadUrl = `${API_URL}/api/resources/${resourceId}/download`;

  return (
    <div className="bg-surface border border-borders rounded-xl p-5 card-hover flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2.5 py-1 bg-cards border border-borders text-textSecondary text-xs font-medium rounded-md mb-2">
            {resource.type}
          </span>
          {subjectName && (
            <span className="inline-block px-2.5 py-1 bg-cards border border-borders text-textSecondary text-xs font-medium rounded-md mb-2 ml-2">
              {subjectName}
            </span>
          )}
          <h3 className="text-lg font-semibold text-textPrimary line-clamp-2">{resource.title}</h3>
          
          <div className="mt-2">
            <StarRating 
              rating={resource.averageRating} 
              totalRatings={resource.totalRatings} 
              size="w-3.5 h-3.5" 
            />
          </div>
        </div>
        <div className="p-2 bg-cards rounded-lg text-textSecondary">
          <FileText className="w-5 h-5" />
        </div>
      </div>
      
      <p className="text-sm text-textSecondary mb-6 line-clamp-3 flex-grow">
        {resource.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-borders">
        <span className="text-xs text-textSecondary">
          {new Date(resource.createdAt || resource.uploadDate).toLocaleDateString()}
        </span>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => toggleBookmark(resourceId)}
            className={`p-2 rounded-lg transition-colors ${
              bookmarked ? 'bg-primary/20 text-primary' : 'bg-cards text-textSecondary hover:text-textPrimary hover:bg-borders'
            }`}
            title={bookmarked ? "Remove Bookmark" : "Bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          <a 
            href={downloadUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-cards text-textSecondary rounded-lg hover:text-textPrimary hover:bg-borders transition-colors" 
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
          <Link 
            to={`/resources/${resourceId}`}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            title="View Details"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResourceCard
