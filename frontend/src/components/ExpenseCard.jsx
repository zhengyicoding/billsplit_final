import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { formatCurrency, formatDate } from '../utils/formatters';
import './ExpenseCard.css';

function ExpenseCard({ 
  expense, 
  friendName, 
  onEdit, 
  onDelete,
  compact = false
}) {
  const [expanded, setExpanded] = useState(false);
  
  if (!expense) return null;

  const { 
    _id, 
    description, 
    amount, 
    date, 
    paidBy, 
    splitMethod, 
    userAmount,
    friendAmount,
    settled,
    settledAt
  } = expense;
  
  // Determine who owes whom based on paidBy and split amounts
  const calculateBalance = () => {
    // Check who paid
    if (paidBy === 'you') {
      // You paid, so friend owes you their portion
      return {
        type: 'positive',
        text: `${friendName} owes you ${formatCurrency(friendAmount)}`
      };
    } else {
      // Friend paid, so you owe friend your portion
      return {
        type: 'negative',
        text: `You owe ${friendName} ${formatCurrency(userAmount)}`
      };
    }
  };

  const balance = calculateBalance();

  // Compact version for dashboard and overview sections
  if (compact) {
    return (
      <Card className={`expense-card compact ${settled ? 'settled' : ''}`}>
        <div className="expense-summary">
          <div className="expense-header">
            <h3>{description}</h3>
            <span className="expense-amount">{formatCurrency(amount)}</span>
          </div>
          <div className="expense-meta">
            <span className="expense-date">{formatDate(date)}</span>
            <span className="expense-friend">with {friendName}</span>
          </div>
          {settled && <div className="settled-badge">Settled</div>}
        </div>
      </Card>
    );
  }

  // Full version with actions and details
  return (
    <Card 
      className={`expense-card ${settled ? 'settled' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="expense-summary">
        <div className="expense-header">
          <h3>{description}</h3>
          <span className="expense-amount">{formatCurrency(amount)}</span>
        </div>
        <div className="expense-meta">
          <span className="expense-date">{formatDate(date)}</span>
          <span className="expense-friend">with {friendName}</span>
          <span className="expense-paid-by">
            Paid by: {paidBy === 'you' ? 'You' : friendName}
          </span>
        </div>
        {settled && <div className="settled-badge">Settled</div>}
      </div>
      
      {expanded && (
        <div className="expense-details">
          <div className="expense-split-info">
            <div className="split-row">
              <span>Split method:</span>
              <span>{splitMethod === 'equally' ? 'Equal (50/50)' : 'Custom'}</span>
            </div>
            <div className="split-row">
              <span>Your share:</span>
              <span>{formatCurrency(userAmount)}</span>
            </div>
            <div className="split-row">
              <span>{friendName}'s share:</span>
              <span>{formatCurrency(friendAmount)}</span>
            </div>
            <div className={`balance-detail ${balance.type}`}>
              {balance.text}
            </div>
            {settled && (
              <div className="settled-detail">
                <span>Settled on:</span>
                <span>{formatDate(settledAt)}</span>
              </div>
            )}
          </div>
          
          {!settled && onEdit && onDelete && (
            <div className="expense-actions" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="secondary"
                size="small"
                onClick={() => onEdit(expense)}
              >
                Edit
              </Button>
              <Button 
                variant="danger"
                size="small"
                onClick={() => onDelete(_id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default ExpenseCard;