import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import FriendsList from '../components/FriendsList';
import FriendForm from '../components/FriendForm';
import FriendFilters from '../components/FriendFilters';
import SettleModal from '../components/SettleModal';
import RecentExpenses from '../components/RecentExpenses';
import { formatCurrency } from '../utils/formatters';
import './DashboardPage.css';

function DashboardPage() {
  // State for friends data
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state for friends management
  const [showModal, setShowModal] = useState(false);
  const [editingFriend, setEditingFriend] = useState(null);
  const [settlingFriend, setSettlingFriend] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchDashboardData = async (signal = null) => {
    try {
      setIsLoading(true);
      
      // Create fetch options object, conditionally adding signal if provided
      const fetchOptions = signal ? { signal } : {};
      
      const friendsResponse = await fetch('/api/friends', fetchOptions);
      if (!friendsResponse.ok) {
        throw new Error('Failed to fetch friends');
      }
      const friendsData = await friendsResponse.json();
      
      const expensesResponse = await fetch('/api/expenses?limit=5', fetchOptions);
      if (!expensesResponse.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const expensesData = await expensesResponse.json();
      
      setFriends(friendsData);
      setExpenses(expensesData.expenses || expensesData);
      setIsLoading(false);
    } catch (err) {
      // Don't update state if this was an abort error
      if (err.name !== 'AbortError') {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    // Call the fetchDashboardData function with the abort signal
    fetchDashboardData(controller.signal);
    
    // Return cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  // Calculate the total balance (positive means friends owe you, negative means you owe)
  const calculateTotalBalance = () => {
    return friends.reduce((total, friend) => total + friend.balance, 0);
  };

  // Filter and sort friends
  const filteredAndSortedFriends = friends
    .filter(friend => 
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'balance') {
        return sortDirection === 'asc' 
          ? a.balance - b.balance
          : b.balance - a.balance;
      }
      return 0;
    });
  
  // Handle sort change
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };
  
  // Handle adding a new friend
  const handleAddFriend = async (friendData) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendData),
      });

      if (!response.ok) {
        throw new Error('Failed to add friend');
      }

      const newFriend = await response.json();
      setFriends([...friends, newFriend]);
      setShowModal(false);
    } catch (err) {
      console.error('Error adding friend:', err);
      setError(err.message || 'Failed to add friend');
    }
  };

  // Handle updating a friend
  const handleUpdateFriend = async (friendData) => {
    try {
      const response = await fetch(`/api/friends/${editingFriend._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(friendData),
      });

      if (!response.ok) {
        throw new Error('Failed to update friend');
      }

      const updatedFriend = await response.json();
      setFriends(friends.map(friend => 
        friend._id === updatedFriend._id ? updatedFriend : friend
      ));
      setEditingFriend(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error updating friend:', err);
      setError(err.message || 'Failed to update friend');
    }
  };

  // Handle deleting a friend
  const handleDeleteFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to delete this friend?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete friend');
      }

      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (err) {
      console.error('Error deleting friend:', err);
      alert(err.message || 'Failed to delete friend');
    }
  };

  // Handle settling up with a friend
  const handleSettleUp = async (friendId) => {
    try {
      const response = await fetch(`/api/friends/${friendId}/settle`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to settle balance');
      }

      const data = await response.json();
      setFriends(friends.map(friend => 
        friend._id === friendId ? data.friend : friend
      ));
      setSettlingFriend(null);
      
      // Also refresh expenses since settling will mark some as settled
      fetchDashboardData();
    } catch (err) {
      console.error('Error settling balance:', err);
      setError(err.message || 'Failed to settle balance');
    }
  };

  // Form submission handler
  const handleSubmit = (formData) => {
    if (editingFriend) {
      handleUpdateFriend(formData);
    } else {
      handleAddFriend(formData);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const totalBalance = calculateTotalBalance();
  const balanceClass = totalBalance >= 0 ? 'positive' : 'negative';
  const balanceText = totalBalance === 0 
    ? 'All settled up!' 
    : totalBalance > 0 
      ? 'Friends owe you' 
      : 'You owe friends';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <Card className={`balance-card ${balanceClass}`}>
        <h2 className="balance-title">Total Balance</h2>
        <div className="balance-amount">
          {formatCurrency(Math.abs(totalBalance))}
        </div>
        <div className="balance-label">
          {balanceText}
        </div>
      </Card>

      <div className="dashboard-sections">
        <div className="friends-section">
          <div className="section-header">
            <h2>Friends</h2>
            <Button 
            className="btn-primary"
            onClick={() => {
            setEditingFriend(null);
            setShowModal(true);
          }}
        >
          Add Friend
        </Button>
          </div>
          
          <div className="full-friends-view">
            <FriendFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />
            
            {friends.length === 0 ? (
              <div className="empty-state">
                <p>You haven&apos;t added any friends yet.</p>
                <Button 
                  className="btn-primary"
                  onClick={() => {
                    setEditingFriend(null);
                    setShowModal(true);
                  }}
                >
                  Add Your First Friend
                </Button>
              </div>
            ) : (
              <FriendsList 
                friends={filteredAndSortedFriends}
                onEdit={(friend) => {
                  setEditingFriend(friend);
                  setShowModal(true);
                }}
                onDelete={handleDeleteFriend}
                onSettle={setSettlingFriend}
              />
            )}
          </div>
        </div>

        <RecentExpenses 
          expenses={expenses}
          getFriendName={(friendId) => {
            const friend = friends.find(f => f._id === friendId);
            return friend ? friend.name : 'Unknown';
          }}
        />
      </div>
      
      {showModal && (
        <Modal 
          title={editingFriend ? "Edit Friend" : "Add New Friend"}
          onClose={() => {
            setShowModal(false);
            setEditingFriend(null);
          }}
        >
          <FriendForm 
            initialData={editingFriend}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
      
      {settlingFriend && (
        <SettleModal 
          friend={settlingFriend}
          onConfirm={handleSettleUp}
          onCancel={() => setSettlingFriend(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;