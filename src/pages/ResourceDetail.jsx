import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Bookmark, Clock, BookOpen, Share2 } from 'lucide-react'
import { useResources } from '../hooks/useResources'
import { useBookmarks } from '../hooks/useBookmarks'
import { SUBJECTS } from '../data/mockData'
import ResourceCard from '../components/ResourceCard'

const ResourceDetail = () => {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { getResourceById, getResourcesBySubject } = useResources()
  const { isBookmarked, toggleBookmark } = useBookmarks()

  const resource = getResourceById(resourceId)

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

  const subjectName = SUBJECTS.find(s => s.id === resource.subjectId)?.name || 'Unknown'
  const bookmarked = isBookmarked(resource.id)

  // Get 2 related resources
  const relatedResources = getResourcesBySubject(resource.subjectId)
    .filter(r => r.id !== resource.id)
    .slice(0, 2)

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
                {new Date(resource.uploadDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {resource.downloads} downloads
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-textPrimary mb-3">Description</h2>
              <p className="text-textSecondary leading-relaxed">
                {resource.description}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-surface border border-borders rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-textPrimary mb-6 text-lg">Actions</h3>

            <div className="flex flex-col gap-4">
              <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                <Download className="w-5 h-5" />
                Download Material
              </button>

              <button
                onClick={() => toggleBookmark(resource.id)}
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
              <ResourceCard key={res.id} resource={res} subjectName={subjectName} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourceDetail
