import { useState, useEffect } from 'react'
import { INITIAL_RESOURCES } from '../data/mockData'
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage'

const RESOURCES_KEY = 'prepnext_resources'

export const useResources = () => {
  const [resources, setResources] = useState(() => {
    const saved = getLocalStorageItem(RESOURCES_KEY, null)
    if (saved && saved.length > 0) return saved
    
    // Initialize with mock data if empty
    setLocalStorageItem(RESOURCES_KEY, INITIAL_RESOURCES)
    return INITIAL_RESOURCES
  })

  useEffect(() => {
    setLocalStorageItem(RESOURCES_KEY, resources)
  }, [resources])

  const addResource = (resourceData) => {
    const newResource = {
      ...resourceData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
    }
    setResources((prev) => [newResource, ...prev])
    return newResource
  }

  const getResourceById = (id) => resources.find((r) => r.id === id)
  
  const getResourcesBySubject = (subjectId) => resources.filter((r) => r.subjectId === subjectId)

  return { resources, addResource, getResourceById, getResourcesBySubject }
}
