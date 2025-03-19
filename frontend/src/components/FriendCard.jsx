import Card from './Card';
import Button from './Button';
import { formatCurrency } from '../utils/formatters';
import '../css/FriendCard.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

function FriendCard({ 
  friend, 
  onEdit, 
  onDelete, 
  onSettle,
  compact = false
}) {
  const [imageError, setImageError] = useState(false);
  if (!friend) return null;

  const { _id, name, profilePic, avatar, balance } = friend;
  
  // Use either profilePic (new field) or avatar (old field) with fallback
  
  const imageUrl = imageError ? 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random` : 
    (profilePic || avatar);
  
  // Determine balance styling and text
  const balanceText = balance === 0 
    ? 'All settled up' 
    : balance > 0 
      ? `${formatCurrency(balance)} owes you` 
      : `You owe ${formatCurrency(Math.abs(balance))}`;
  
  const balanceClass = balance > 0 
    ? 'positive' 
    : balance < 0 
      ? 'negative' 
      : 'neutral';

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Compact version for dashboards and overview sections
  if (compact) {
    return (
      <Card className="friend-card compact">
        <div className="friend-avatar">
          <img 
            src={imageUrl} 
            alt={`${name}'s avatar`} 
            onError={handleImageError}
          />
        </div>
        <div className="friend-info">
          <h3>{name}</h3>
          <div className={`friend-balance ${balanceClass}`}>
            {balanceText}
          </div>
        </div>
      </Card>
    );
  }

  // Full version with actions for the friends page
  return (
    <Card className="friend-card">
      <div className="friend-avatar">
        <img 
          src={imageUrl} 
          alt={`${name}'s avatar`} 
          onError={handleImageError}
        />
      </div>
      <div className="friend-info">
        <h3>{name}</h3>
        <div className={`friend-balance ${balanceClass}`}>
          {balanceText}
        </div>
      </div>
      <div className="friend-actions">
        {onEdit && (
          <Button 
            variant="secondary"
            size="small"
            onClick={() => onEdit(friend)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button 
            variant="danger"
            size="small"
            onClick={() => onDelete(_id)}
          >
            Delete
          </Button>
        )}
        {onSettle && balance !== 0 && (
          <Button 
            variant="warning"
            size="small"
            onClick={() => onSettle(friend)}
          >
            Settle Up
          </Button>
        )}
      </div>
    </Card>
  );
}

FriendCard.propTypes = {
  friend: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // Support both old and new field names
    avatar: PropTypes.string,
    profilePic: PropTypes.string,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSettle: PropTypes.func,
  compact: PropTypes.bool,
};

export default FriendCard;