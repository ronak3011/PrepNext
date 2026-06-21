import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.get('/api/bookmarks');
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const toggleBookmark = async (resourceId) => {
    if (!user) return; // Must be logged in

    const isCurrentlyBookmarked = bookmarks.some(b => b.resource._id === resourceId);

    try {
      if (isCurrentlyBookmarked) {
        await axios.delete(`/api/bookmarks/${resourceId}`);
        setBookmarks((prev) => prev.filter((b) => b.resource._id !== resourceId));
      } else {
        const { data } = await axios.post('/api/bookmarks', { resourceId });
        setBookmarks((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (resourceId) => bookmarks.some((b) => b.resource._id === resourceId);

  return { bookmarks, loading, toggleBookmark, isBookmarked, fetchBookmarks };
};
