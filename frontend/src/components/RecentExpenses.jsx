import { Link } from 'react-router-dom';
import ExpenseCard from './ExpenseCard';
import EmptyState from './EmptyState';
import './RecentExpenses.css';

function RecentExpenses({ 
  expenses = [], 
  isLoading = false, 
  getFriendName = () => 'Unknown' 
}) {
  if (isLoading) {
    return <div className="recent-expenses-loading">Loading expenses...</div>;
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

export default RecentExpenses;