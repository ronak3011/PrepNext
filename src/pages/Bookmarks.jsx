import { Bookmark, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { useResources } from '../hooks/useResources'
import { SUBJECTS } from '../data/mockData'
import ResourceCard from '../components/ResourceCard'
import EmptyState from '../components/EmptyState'

const Bookmarks = () => {
  const { bookmarks } = useBookmarks()
  const { resources } = useResources()

  const bookmarkedResources = resources.filter(r => bookmarks.includes(r.id))

  const getSubjectName = (subjectId) => {
    return SUBJECTS.find(s => s.id === subjectId)?.name || 'Unknown'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-textPrimary">Your Bookmarks</h2>
        <p className="text-textSecondary mt-2">Quick access to all your saved study materials.</p>
      </div>

      {bookmarkedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              subjectName={getSubjectName(resource.subjectId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookmarks till now"
          description="You haven't saved any resources. Browse subjects and bookmark the useful materials."
          icon={Bookmark}
          action={
            <Link to="/subjects" className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
              <Search className="w-4 h-4" />
              Browse Subjects
            </Link>
          }
        />
      )}
    </div>
  )
}

export default Bookmarks
