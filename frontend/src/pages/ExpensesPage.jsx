import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import ExpensesList from '../components/ExpensesList';
import ExpenseFilters from '../components/ExpenseFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import './ExpensesPage.css';

function ExpensesPage() {
  // State for expenses data
  const [expenses, setExpenses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    friendId: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Fetch friends data (needed for expense form and filtering)
  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError(err.message || 'Failed to load friends');
    }
  };
  
  // Fetch expenses data with pagination and filtering
  const fetchExpenses = async (page = pagination.currentPage) => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.itemsPerPage,
        sortBy: sortField,
        sortDirection,
        search: searchTerm
      });
      
      // Add filters if they exist
      if (filters.friendId) queryParams.append('friendId', filters.friendId);
      if (filters.status !== 'all') queryParams.append('settled', filters.status === 'settled');
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const response = await fetch(`/api/expenses?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const data = await response.json();
      
      // Check if the response has the new format with pagination info
      if (data.expenses && data.pagination) {
        setExpenses(data.expenses);
        setPagination({
          ...pagination,
          currentPage: data.pagination.page,
          totalPages: data.pagination.pages,
          totalItems: data.pagination.total,
          itemsPerPage: data.pagination.limit
        });
      } else {
        // Fallback for old format (just an array of expenses)
        setExpenses(data);
        setPagination({
          ...pagination,
          currentPage: page,
          totalPages: 1,
          totalItems: data.length || 0
        });
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to load expenses');
      setIsLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await fetchFriends();
      await fetchExpenses(1);
    };
    
    loadData();
  }, []);
  
  // Refetch when filters, sort, or search changes
  useEffect(() => {
    fetchExpenses(1);
  }, [filters, sortField, sortDirection, searchTerm]);
  
  // Handle adding a new expense
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      // Refresh expenses after adding
      await fetchExpenses(1);
      setShowModal(false);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.message || 'Failed to add expense');
    }
  };

  // Handle updating an expense
  const handleUpdateExpense = async (expenseData) => {
    try {
      const response = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      // Refresh expenses after updating
      await fetchExpenses(pagination.currentPage);
      setEditingExpense(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err.message || 'Failed to update expense');
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      // Refresh expenses after deleting
      await fetchExpenses(pagination.currentPage);
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err.message || 'Failed to delete expense');
    }
  };
  
  // Form submission handler
  const handleSubmit = (formData) => {
    if (editingExpense) {
      handleUpdateExpense(formData);
    } else {
      handleAddExpense(formData);
    }
  };
  
  // Get friend name by ID
  const getFriendName = (friendId) => {
    const friend = friends.find(f => f._id === friendId);
    return friend ? friend.name : 'Unknown';
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      friendId: '',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };
  
  // Handle sort change
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Expenses</h1>
        <Button 
          onClick={() => {
            setEditingExpense(null);
            setShowModal(true);
          }}
        >
          Add Expense
        </Button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <ExpenseFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={setFilters}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        friends={friends}
        onResetFilters={resetFilters}
      />
      
      {isLoading && expenses.length === 0 ? (
        <LoadingSpinner message="Loading expenses..." />
      ) : (
        <ExpensesList 
          expenses={expenses}
          pagination={pagination}
          getFriendName={getFriendName}
          onPageChange={fetchExpenses}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setShowModal(true);
          }}
          onDelete={handleDeleteExpense}
          onAddNew={() => {
            setEditingExpense(null);
            setShowModal(true);
          }}
        />
      )}
      
      {isLoading && expenses.length > 0 && (
        <div className="loading-overlay">
          <LoadingSpinner message="Loading expenses..." />
        </div>
      )}
      
      {showModal && (
        <Modal 
          title={editingExpense ? "Edit Expense" : "Add New Expense"}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
        >
          <ExpenseForm 
            initialData={editingExpense}
            onSubmit={handleSubmit}
            friends={friends}
          />
        </Modal>
      )}
    </div>
  );
}

export default ExpensesPage;