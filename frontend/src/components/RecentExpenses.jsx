import { Link } from 'react-router-dom';
import ExpenseCard from './ExpenseCard';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import '../css/RecentExpenses.css';
import PropTypes from 'prop-types';

function RecentExpenses({ 
  expenses = [], 
  isLoading = false, 
  getFriendName = () => 'Unknown' 
}) {
  if (isLoading) {
    return <LoadingSpinner message="Loading expenses..."/>;
  }
  
  return (
    <div className="recent-expenses">
      <div className="section-header">
        <h2>Recent Expenses</h2>
        <Link to="/expenses" className="view-all-link">View All</Link>
      </div>
      
      {expenses.length === 0 ? (
        <EmptyState 
          message="You haven't added any expenses yet."
          actionText="Add Expenses"
          onAction={() => window.location.href = '/expenses'}
        />
      ) : (
        <div className="expenses-preview">
          {expenses.slice(0, 5).map(expense => (
            <ExpenseCard 
              key={expense._id}
              expense={expense}
              friendName={getFriendName(expense.friendId)}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}
RecentExpenses.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    paidBy: PropTypes.string.isRequired,
    splitMethod: PropTypes.string.isRequired,
    userAmount: PropTypes.number.isRequired,
    friendAmount: PropTypes.number.isRequired,
    settled: PropTypes.bool.isRequired,
    settledAt: PropTypes.string,
  })).isRequired,
  isLoading: PropTypes.bool,
  getFriendName: PropTypes.func.isRequired,
};

export default RecentExpenses;