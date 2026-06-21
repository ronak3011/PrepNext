import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResources = (initialSubjectId = '') => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async (subjectId = '') => {
    setLoading(true);
    try {
      const url = subjectId ? `/api/resources?subject=${subjectId}` : '/api/resources';
      const { data } = await axios.get(url);
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(initialSubjectId);
  }, [initialSubjectId]);

  const addResource = async (resourceData) => {
    try {
      const { data } = await axios.post('/api/resources', resourceData);
      setResources((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  };

  const getResourceById = (id) => resources.find((r) => r._id === id);
  
  const getResourcesBySubject = (subjectId) => resources.filter((r) => r.subject?._id === subjectId);

  return { resources, loading, addResource, getResourceById, getResourcesBySubject, fetchResources };
};
