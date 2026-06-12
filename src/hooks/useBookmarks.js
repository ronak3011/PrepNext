import { useState, useEffect } from 'react'
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage'

const BOOKMARKS_KEY = 'prepnext_bookmarks'

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => getLocalStorageItem(BOOKMARKS_KEY, []))

  useEffect(() => {
    setLocalStorageItem(BOOKMARKS_KEY, bookmarks)
  }, [bookmarks])

  const toggleBookmark = (resourceId) => {
    setBookmarks((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId)
      } else {
        return [...prev, resourceId]
      }
    })
  }

  const isBookmarked = (resourceId) => bookmarks.includes(resourceId)

  return { bookmarks, toggleBookmark, isBookmarked }
}
