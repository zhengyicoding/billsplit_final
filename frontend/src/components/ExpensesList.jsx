import ExpenseCard from './ExpenseCard';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import './ExpensesList.css';
import PropTypes from 'prop-types';

function ExpensesList({ 
  expenses = [], 
  pagination = {},
  isLoading = false,
  getFriendName,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew
}) {
  if (isLoading && expenses.length === 0) {
    return <LoadingSpinner message="Loading expenses..." />;
  }

  if (expenses.length === 0) {
    return (
      <EmptyState 
        message="No expenses found matching your criteria." 
        actionText={pagination.totalItems === 0 ? "Add Your First Expense" : "Clear Filters"}
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="expenses-list-container">
      <div className="expenses-list">
        {expenses.map(expense => (
          <ExpenseCard
            key={expense._id}
            expense={expense}
            friendName={getFriendName(expense.friendId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <Pagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
ExpensesList.propTypes = {
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
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  getFriendName: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired,
};

export default ExpensesList;