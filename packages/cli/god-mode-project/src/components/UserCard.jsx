import React, { useState, useEffect, useCallback, memo } from 'react';
import './UserCard.css';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: number) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = memo(({ 
  user, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image error state when user changes
    setImageError(false);
  }, [user.id]); // Use user.id instead of user.avatar to detect any user changes

  const handleEdit = () => {
    if (onEdit) {
      setIsLoading(true);
      try {
        onEdit(user);
      } catch (error) {
        console.error('Error editing user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setIsLoading(true);
      try {
        onDelete(user.id);
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []); // Memoize the error handler to prevent unnecessary re-renders

  const formatJoinDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Sanitize role for CSS class name
  const sanitizeRole = (role: string): string => {
    return role.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  };

  const roleClass = sanitizeRole(user.role);

  return (
    <div className={`user-card ${className} ${isLoading ? 'user-card--loading' : ''}`}>
      <div className="user-card__content">
        <div className="user-card__avatar">
          {imageError ? (
            <div className="user-card__avatar-fallback">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
        
        <div className="user-card__info">
          <h3 className="user-card__name">{user.name}</h3>
          <p className="user-card__email">{user.email}</p>
          <div className="user-card__meta">
            <span className={`user-card__role user-card__role--${roleClass}`}>
              {user.role}
            </span>
            <span className="user-card__join-date">
              Joined {formatJoinDate(user.joinDate)}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="user-card__actions">
            {onEdit && (
              <button
                className="user-card__btn user-card__btn--edit"
                onClick={handleEdit}
                disabled={isLoading}
                aria-label={`Edit ${user.name}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="user-card__btn user-card__btn--delete"
                onClick={handleDelete}
                disabled={isLoading}
                aria-label={`Delete ${user.name}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="user-card__loading-overlay">
          <div className="user-card__spinner"></div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return prevProps.user.id === nextProps.user.id &&
         prevProps.onEdit === nextProps.onEdit &&
         prevProps.onDelete === nextProps.onDelete &&
         prevProps.className === nextProps.className;
});

UserCard.displayName = 'UserCard';

export default UserCard;