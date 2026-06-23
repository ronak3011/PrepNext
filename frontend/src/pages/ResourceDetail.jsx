import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, Download, Bookmark, Clock, BookOpen, Share2, Eye, Trash2 } from 'lucide-react'
import { useBookmarks } from '../hooks/useBookmarks'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ResourceCard from '../components/ResourceCard'
import PdfPreviewModal from '../components/PdfPreviewModal'
import StarRating from '../components/StarRating'
import CommentSection from '../components/CommentSection'

const ResourceDetail = () => {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [resource, setResource] = useState(null)
  const [relatedResources, setRelatedResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingLoading, setRatingLoading] = useState(false)
  const { user } = useContext(AuthContext)

  const handleDownloadClick = () => {
    setResource(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
  };

  const handleRate = async (newRating) => {
    if (!user) {
      alert("Please log in to rate this resource");
      return;
    }
    
    if (ratingLoading) return;
    setRatingLoading(true);
    
    try {
      const { data } = await axios.post(`/api/resources/${resource._id}/rate`, { rating: newRating });
      setResource(prev => ({
        ...prev,
        averageRating: data.averageRating,
        totalRatings: data.totalRatings,
        ratings: data.ratings
      }));
    } catch (error) {
      console.error('Error rating resource', error);
      alert(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleCommentsUpdated = (newComments) => {
    setResource(prev => ({
      ...prev,
      comments: newComments
    }));
  };

  const handleDeleteResource = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete this material? All comments and ratings will be permanently lost.")) return;
    
    try {
      await axios.delete(`/api/resources/${resourceId}`);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error.response?.data?.message || 'Failed to delete material');
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // The backend proxy handles tracking and renaming the file
  const downloadUrl = `${API_URL}/api/resources/${resource?._id}/download`;

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await axios.get(`/api/resources/${resourceId}`)
        setResource(data)
        
        // Fetch related resources by the same subject
        if (data.subject) {
          const relatedRes = await axios.get(`/api/resources?subject=${data.subject._id}`)
          setRelatedResources(relatedRes.data.filter(r => r._id !== data._id).slice(0, 2))
        }
      } catch (error) {
        console.error('Error fetching resource', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResource()
  }, [resourceId, user])

  if (loading) {
    return <div className="text-center py-20 text-textSecondary">Loading resource...</div>
  }

  if (!resource) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-textPrimary">Resource not found</h1>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline mt-4 inline-block">
          Go back
        </button>
      </div>
    )
  }

  const subjectName = resource.subject?.title || 'Unknown'
  const bookmarked = isBookmarked(resource._id)
  
  // Determine current user's rating, if any
  const currentUserRating = user ? resource.ratings?.find(r => r.user === user._id)?.rating || 0 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-textSecondary hover:text-textPrimary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-surface border border-borders rounded-2xl p-8 mb-8">
            <div className="flex gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-cards border border-borders text-textSecondary text-sm font-medium rounded-md">
                {resource.type}
              </span>
              <span className="inline-block px-3 py-1 bg-cards border border-borders text-textSecondary text-sm font-medium rounded-md">
                {subjectName}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-textPrimary mb-4">{resource.title}</h1>

            <div className="flex items-center gap-6 text-sm text-textSecondary mb-8 pb-8 border-b border-borders">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(resource.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {resource.downloads || 0} downloads
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={resource.averageRating} totalRatings={resource.totalRatings} size="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-textPrimary mb-3">Description</h2>
              <p className="text-textSecondary leading-relaxed">
                {resource.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-borders">
              <h2 className="text-lg font-bold text-textPrimary mb-4">Rate this Resource</h2>
              <div className="flex items-center gap-4">
                <StarRating 
                  rating={currentUserRating} 
                  interactive={true} 
                  onRate={handleRate} 
                  size="w-6 h-6"
                />
                <span className="text-sm text-textSecondary">
                  {currentUserRating > 0 ? 'Your rating' : 'Click to rate'}
                </span>
              </div>
            </div>

            <CommentSection 
              resourceId={resource._id} 
              comments={resource.comments || []} 
              onCommentsUpdated={handleCommentsUpdated} 
            />
          </div>
        </div>

        <div>
          <div className="bg-surface border border-borders rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-textPrimary mb-6 text-lg">Actions</h3>

            <div className="flex flex-col gap-4">
              <a 
                href={downloadUrl} 
                onClick={handleDownloadClick}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
              >
                <Download className="w-5 h-5" />
                View/Download Material
              </a>

              <button
                onClick={() => toggleBookmark(resource._id)}
                className={`w-full flex justify-center items-center gap-2 px-4 py-3 border rounded-xl font-medium transition-all ${bookmarked
                    ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                    : 'bg-background border-borders text-textPrimary hover:bg-borders'
                  }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved to Bookmarks' : 'Bookmark Resource'}
              </button>

              <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-background border border-borders text-textPrimary rounded-xl font-medium hover:bg-borders transition-all">
                <Share2 className="w-5 h-5" />
                Share
              </button>

              {user && resource.uploadedBy && (resource.uploadedBy._id === user._id || resource.uploadedBy === user._id) && (
                <button
                  onClick={handleDeleteResource}
                  className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-sm shadow-red-600/20"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Material
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedResources.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-textPrimary" />
            More from {subjectName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedResources.map(res => (
              <ResourceCard key={res._id} resource={res} subjectName={subjectName} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourceDetail
