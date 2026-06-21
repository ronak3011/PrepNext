import SubjectCard from '../components/SubjectCard'
import { useResources } from '../hooks/useResources'
import SearchBar from '../components/SearchBar'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Subjects = () => {
  const { resources } = useResources()
  const [subjects, setSubjects] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const getResourceCount = (subjectId) => {
    return resources.filter(r => r.subject?._id === subjectId).length
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Subjects</h1>
          <p className="text-textSecondary mt-2">Browse all available subjects.</p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search subjects..."
          />
        </div>
      </div>

      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              resourceCount={getResourceCount(subject._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-borders">
          <p className="text-textSecondary">No subjects found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

export default Subjects
