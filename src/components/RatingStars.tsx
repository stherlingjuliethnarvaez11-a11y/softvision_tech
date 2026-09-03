/**
 * SOFTVISION TECH — Componente de Calificación con Estrellas (Presentacional)
 */

import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  interactive = false,
  onRatingChange,
  size = 'md',
  showNumber = false,
  reviewCount
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const currentDisplay = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5" id="rating-stars-container">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(currentDisplay);

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform p-0.5' : 'cursor-default'} focus:outline-none`}
              aria-label={`${starValue} de ${max} estrellas`}
              id={`star-btn-${starValue}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-bold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500 font-medium">
          ({reviewCount} {reviewCount === 1 ? 'opinión' : 'opiniones'})
        </span>
      )}
    </div>
  );
};
