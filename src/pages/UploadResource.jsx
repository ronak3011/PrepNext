import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CheckCircle } from 'lucide-react'
import { SUBJECTS, RESOURCE_TYPES } from '../data/mockData'
import { useResources } from '../hooks/useResources'

const UploadResource = () => {
  const navigate = useNavigate()
  const { addResource } = useResources()

  const [formData, setFormData] = useState({
    title: '',
    subjectId: SUBJECTS[0].id,
    type: RESOURCE_TYPES[0],
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate network request
    setTimeout(() => {
      const newResource = addResource(formData)
      setIsSubmitting(false)
      setSuccess(true)

      setTimeout(() => {
        navigate(`/resources/${newResource.id}`)
      }, 1500)
    }, 800)
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center fade-in">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-textPrimary mb-2">Upload Successful!</h1>
        <p className="text-textSecondary">Your resource has been shared with the community. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Share a Resource</h1>
        <p className="text-textSecondary">Help your peers by sharing notes, PYQs, and other study materials.</p>
      </div>

      <div className="bg-surface border border-borders rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-textPrimary mb-2">
              Resource Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="eg., Module 1 Complete Notes"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-textPrimary mb-2">
                Subject
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {SUBJECTS.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-textPrimary mb-2">
                Resource Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                {RESOURCE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textPrimary mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Briefly describe what this material covers..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-borders">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 px-4 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-70"
            >
              <Upload className="w-5 h-5" />
              {isSubmitting ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadResource
