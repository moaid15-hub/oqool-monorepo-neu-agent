import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './ProductCard.css';

// Move formatPrice function outside the component to prevent re-creation on every render
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use useCallback to memoize callback functions
  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product);
  }, [product, onAddToCart]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(product.id);
  }, [product.id, onViewDetails]);

  // Directly setting state without creating separate functions
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  // Memoize components that depend on product properties to prevent unnecessary re-renders
  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price]);
  const discountedPrice = useMemo(() => formatPrice(product.price * (1 - product.discount / 100)), [product.price, product.discount]);

  return (
    <div className={classnames('product-card', className)}>
      <div className="product-card__image-container">
        {!imageLoaded && !imageError && <div className="product-card__image-skeleton" />}
        {imageError ? (
          <div className="product-card__image-placeholder">
            <span>No Image</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={classnames('product-card__image', {'product-card__image--loaded': imageLoaded})}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        {product.isNew && <span className="product-card__badge product-card__badge--new">New</span>}
        {product.discount > 0 && (
          <span className="product-card__badge product-card__badge--discount">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        
        <div className="product-card__price-section">
          {product.discount > 0 ? (
            <>
              <span className="product-card__price product-card__price--current">
                {discountedPrice}
              </span>
              <span className="product-card__price product-card__price--original">
                {formattedPrice}
              </span>
            </>
          ) : (
            <span className="product-card__price product-card__price--current">
              {formattedPrice}
            </span>
          )}
        </div>

        <div className="product-card__rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={classnames('product-card__star', {
                'product-card__star--filled': index < Math.floor(product.rating),
              })}
            >
              ★
            </span>
          ))}
          <span className="product-card__rating-count">({product.reviewCount})</span>
        </div>

        <div className="product-card__actions">
          <button
            className="product-card__button product-card__button--primary"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button
            className="product-card__button product-card__button--secondary"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    discount: PropTypes.number,
    isNew: PropTypes.bool,
    inStock: PropTypes.bool
  }).isRequired,
  onAddToCart: PropTypes.func,
  onViewDetails: PropTypes.func,
  className: PropTypes.string,
};

ProductCard.defaultProps = {
  onAddToCart: null,
  onViewDetails: null,
};

export default ProductCard;