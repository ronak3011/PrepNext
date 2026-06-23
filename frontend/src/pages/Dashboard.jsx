import { Book, Bookmark, Library, FilePlus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import ResourceCard from '../components/ResourceCard'
import EmptyState from '../components/EmptyState'
import { useResources } from '../hooks/useResources'
import { useBookmarks } from '../hooks/useBookmarks'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SUBJECTS } from '../data/mockData'

const Dashboard = () => {
  const { resources } = useResources()
  const { bookmarks } = useBookmarks()
  const { user } = useContext(AuthContext)

  const totalResources = resources.length
  const totalBookmarks = bookmarks.length
  const subjectsAvailable = new Set(resources.map(r => r.subject?._id)).size

  // Recent resources (last 4)
  const recentResources = [...resources]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary">Dashboard</h1>
        <p className="text-textSecondary mt-2">Welcome back! Here's an overview of all your academic resources.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          title="Total Resources"
          value={totalResources}
          icon={Book}
          trend={null}
        />
        <StatsCard
          title="Bookmarked"
          value={totalBookmarks}
          icon={Bookmark}
        />
        <StatsCard
          title="Subjects Active"
          value={subjectsAvailable}
          icon={Library}
        />
        <StatsCard
          title="Recent Additions"
          value={recentResources.length}
          icon={FilePlus}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Recent Resources */}
        <div className="lg:col-span-2">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-textPrimary">Recently Uploaded</h2>
            <Link to="/subjects" className="text-textSecondary text-sm font-medium hover:text-textPrimary flex items-center transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentResources.map(resource => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  subjectName={resource.subject?.title || 'Unknown'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No resources yet"
              description="Start by uploading your first study material."
              action={
                <Link to="/upload" className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">
                  Upload Resource
                </Link>
              }
            />
          )}
        </div>

        {/* Sidebar: Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-textPrimary mb-6">Quick Actions</h2>
          <div className="bg-surface border border-borders rounded-xl p-4 flex flex-col gap-3">
            <Link
              to="/subjects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-cards transition-colors group"
            >
              <div className="p-2 bg-cards text-textPrimary rounded-lg group-hover:bg-surface transition-colors">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-textPrimary">Browse Subjects</div>
                <div className="text-xs text-textSecondary">Find notes for your classes</div>
              </div>
            </Link>

            <Link
              to="/upload"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-cards transition-colors group"
            >
              <div className="p-2 bg-cards text-textPrimary rounded-lg group-hover:bg-surface transition-colors">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-textPrimary">Upload Resource</div>
                <div className="text-xs text-textSecondary">Share materials with others</div>
              </div>
            </Link>

            <Link
              to="/bookmarks"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-cards transition-colors group"
            >
              <div className="p-2 bg-cards text-textPrimary rounded-lg group-hover:bg-surface transition-colors">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-textPrimary">View Bookmarks</div>
                <div className="text-xs text-textSecondary">Access saved materials instantly</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
