import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Upload, CheckCircle, ChevronDown, FileText, X } from 'lucide-react'
import { RESOURCE_TYPES } from '../data/mockData'
import { useResources } from '../hooks/useResources'

const UploadResource = () => {
  const navigate = useNavigate()
  const { addResource } = useResources()

  const [subjects, setSubjects] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    type: RESOURCE_TYPES[0],
    description: '',
  })
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get('/api/subjects')
        setSubjects(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, subjectId: data[0]._id }))
        }
      } catch (error) {
        console.error('Error fetching subjects', error)
      }
    }
    fetchSubjects()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (!file) {
        throw new Error('Please select a PDF file to upload')
      }

      // Step 1: Upload the file to our backend (which forwards it to Cloudinary)
      const uploadData = new FormData()
      uploadData.append('file', file)
      
      const uploadRes = await axios.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const pdfUrl = uploadRes.data.pdfUrl

      // Step 2: Save the resource in our database with the new Cloudinary URL
      const newResource = await addResource({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: pdfUrl,
        subject: formData.subjectId
      })
      
      setIsSubmitting(false)
      setSuccess(true)

      setTimeout(() => {
        navigate(`/resources/${newResource._id}`)
      }, 1500)
    } catch (err) {
      setIsSubmitting(false)
      setError(err.response?.data?.message || err.message || 'Failed to upload resource')
    }
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
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

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

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Upload PDF File
            </label>
            
            {file ? (
              <div className="flex items-center justify-between p-4 bg-cards border border-borders rounded-xl transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-textPrimary text-sm font-medium truncate">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 text-textSecondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <input
                type="file"
                id="file"
                name="file"
                accept="application/pdf"
                required
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-textPrimary mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  id="subjectId"
                  name="subjectId"
                  required
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none pr-10"
                >
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textSecondary">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-textPrimary mb-2">
                Resource Type
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-borders rounded-xl text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none pr-10"
                >
                  {RESOURCE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textSecondary">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
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
