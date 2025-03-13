import Button from './Button';
import './EmptyState.css';
import PropTypes from 'prop-types';

function EmptyState({ 
  message = 'No items found', 
  actionText, 
  onAction 
}) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
EmptyState.propTypes = {
  message: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

export default EmptyState;
