import Button from './Button';
import Modal from './Modal';
import { formatCurrency } from '../utils/formatters';
import '../css/SettleModal.css';
import PropTypes from 'prop-types';

function SettleModal({ friend, onConfirm, onCancel }) {
  if (!friend) return null;
  
  return (
    <Modal 
      title={`Settle Up with ${friend.name}`}
      onClose={onCancel}
    >
      <div className="settle-modal-content">
        <p className="balance-summary">
          {friend.balance > 0 ? (
            <span className="positive">
              {friend.name} owes you {formatCurrency(friend.balance)}
            </span>
          ) : (
            <span className="negative">
              You owe {friend.name} {formatCurrency(Math.abs(friend.balance))}
            </span>
          )}
        </p>
        
        <p className="settlement-info">
          Settling up will mark all expenses with {friend.name} as settled and reset the balance to zero.
        </p>
        
        <p className="warning">
          This action cannot be undone.
        </p>
        
        <div className="modal-actions">
          <Button 
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={() => onConfirm(friend._id)}
          >
            Confirm Settlement
          </Button>
        </div>
      </div>
    </Modal>
  );
}
SettleModal.propTypes = {
  friend: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SettleModal;