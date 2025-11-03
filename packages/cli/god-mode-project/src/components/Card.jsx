import React, { useState } from 'react';
import './Card.css';

const Card = ({ 
  title, 
  content, 
  image, 
  onAction, 
  actionLabel = "Learn More",
  variant = "default",
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Improved handling of class names for readability and to avoid unnecessary whitespace
  const cardClasses = [
    'card',
    `card--${variant}`,
    isHovered ? 'card--hovered' : '',
    className
  ].join(' ').trim();

  // Utilizing CSS for hover effects to minimize re-renders
  // Ensure the CSS file contains the necessary styles for hover effects

  // Improved id and aria-labelledby handling
  const sanitizedTitle = title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;
  
  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={sanitizedTitle}
    >
      {image && (
        <div className="card__image-container">
          <img 
            src={image.src} 
            alt={image.alt || ''} 
            className="card__image"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="card__content">
        {title && (
          <h3 
            id={sanitizedTitle}
            className="card__title"
          >
            {title}
          </h3>
        )}
        
        {content && (
          <div className="card__body">
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        )}
        
        {onAction && (
          <button 
            className="card__action"
            onClick={onAction} // Directly using onAction for onClick
            type="button"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;