import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import ResourceCard from '../components/ResourceCard'
import EmptyState from '../components/EmptyState'
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react'

const Search = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialQuery = searchParams.get('q') || ''

  const [subjects, setSubjects] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [subjectFilter, setSubjectFilter] = useState('')
  const [sortOption, setSortOption] = useState('newest')

  // Update searchQuery if URL changes (e.g. from Navbar)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearchQuery(q)
  }, [location.search])

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get('/api/subjects')
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching subjects', error)
      }
    }
    fetchSubjects()
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = {}
        if (searchQuery) params.search = searchQuery
        if (subjectFilter) params.subject = subjectFilter
        if (sortOption) params.sort = sortOption

        const { data } = await axios.get('/api/resources', { params })
        setResources(data)
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchResults, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery, subjectFilter, sortOption])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary">Search Resources</h1>
        <p className="text-textSecondary mt-2">Find exactly what you're looking for.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4 space-y-6">
          <div className="bg-surface border border-borders rounded-xl p-5 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-textPrimary mb-4 pb-2 border-b border-borders">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </div>

            {/* Keyword */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-textSecondary mb-2">Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-cards border border-borders rounded-lg text-textPrimary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
                <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-textSecondary" />
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-textSecondary mb-2">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full p-2 bg-cards border border-borders rounded-lg text-textPrimary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 bg-cards border border-borders rounded-lg text-textPrimary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="most_downloaded">Most Downloaded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <div className="text-textSecondary font-medium">
              {loading ? 'Searching...' : `Found ${resources.length} result${resources.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-cards animate-pulse rounded-xl border border-borders"></div>
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  subjectName={resource.subject?.title || 'Unknown'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No results found"
              description="Try adjusting your filters or search keywords."
              action={
                <button 
                  onClick={() => { setSearchQuery(''); setSubjectFilter(''); setSortOption('newest'); }}
                  className="px-4 py-2 bg-cards border border-borders text-textPrimary rounded-lg hover:bg-surface transition-colors"
                >
                  Clear all filters
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
