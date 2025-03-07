import Button from './Button';
import './EmptyState.css';

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

export default EmptyState;
