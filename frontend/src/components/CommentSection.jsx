import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import axios from 'axios';

const CommentSection = ({ resourceId, comments = [], onCommentsUpdated }) => {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/resources/${resourceId}/comments`, { text: newComment });
      onCommentsUpdated(data);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { data } = await axios.delete(`/api/resources/${resourceId}/comments/${commentId}`);
      onCommentsUpdated(data);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-10 pt-8 border-t border-borders">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-textPrimary" />
        <h2 className="text-xl font-bold text-textPrimary">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-grow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-background border border-borders rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px] resize-y"
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-cards border border-borders rounded-xl text-center text-textSecondary">
          Please <a href="/login" className="text-primary hover:underline">log in</a> to join the discussion.
        </div>
      )}

      <div className="space-y-6">
        {/* Reverse array to show newest comments first */}
        {[...comments].reverse().map((comment, index) => (
          <div key={comment._id || index} className="flex gap-3 fade-in group">
            <div className="w-10 h-10 rounded-full bg-surface border border-borders flex items-center justify-center flex-shrink-0 text-textSecondary font-bold">
              {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textPrimary">{comment.user?.name || 'Unknown User'}</span>
                  <span className="text-xs text-textSecondary">{formatTime(comment.createdAt)}</span>
                </div>
                {user && (comment.user?._id === user._id || comment.user === user._id) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-textSecondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-textPrimary leading-relaxed whitespace-pre-wrap break-words">{comment.text}</p>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8 text-textSecondary">
            No comments yet. Be the first to start the discussion!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
