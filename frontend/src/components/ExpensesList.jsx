import React from 'react';
import ExpenseCard from './ExpenseCard';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import './ExpensesList.css';

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

export default ExpensesList;