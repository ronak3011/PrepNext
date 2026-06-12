import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useResources } from '../hooks/useResources'
import { SUBJECTS, RESOURCE_TYPES } from '../data/mockData'
import ResourceCard from '../components/ResourceCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import EmptyState from '../components/EmptyState'

const SubjectDetail = () => {
  const { subjectId } = useParams()
  const { getResourcesBySubject } = useResources()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  const subject = SUBJECTS.find(s => s.id === subjectId)
  const resources = getResourcesBySubject(subjectId)

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-textPrimary">Subject not found</h1>
        <Link to="/subjects" className="text-primary hover:underline mt-4 inline-block">
          Back to subjects
        </Link>
      </div>
    )
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All' || resource.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <Link to="/subjects" className="inline-flex items-center text-sm font-medium text-textSecondary hover:text-textPrimary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Subjects
      </Link>

      <div className="bg-surface border border-borders rounded-2xl p-8 mb-10">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">{subject.name}</h1>
        <p className="text-textSecondary">{subject.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <div className="w-full md:w-96">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full md:w-auto overflow-hidden">
          <FilterBar types={RESOURCE_TYPES} selectedType={selectedType} onSelectType={setSelectedType} />
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} subjectName={subject.name} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No resources found"
          description={resources.length === 0 ? "Be the first to upload material for this subject." : "Try adjusting your search or filters."}
          icon={BookOpen}
          action={
            <Link to="/upload" className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">
              Upload Resource
            </Link>
          }
        />
      )}
    </div>
  )
}

export default SubjectDetail
