import { Star } from 'lucide-react';
import { useState } from 'react';

const StarRating = ({ 
  rating = 0, 
  interactive = false, 
  onRate = null, 
  totalRatings = undefined, 
  size = 'w-5 h-5' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" onMouseLeave={() => interactive && setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            className={`p-0.5 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${
              star <= displayRating ? 'text-yellow-400' : 'text-borders'
            }`}
          >
            <Star className={`${size} ${star <= displayRating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      
      {!interactive && rating > 0 && (
        <span className="text-sm font-medium text-textPrimary ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
      
      {totalRatings !== undefined && (
        <span className="text-xs text-textSecondary">
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
