import FriendCard from './FriendCard';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import './FriendsList.css';

function FriendsList({ 
  friends = [], 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onSettle,
  onAddNew
}) {
  if (isLoading) {
    return <LoadingSpinner message="Loading friends..." />;
  }

  if (friends.length === 0) {
    return (
      <EmptyState 
        message="You haven't added any friends yet." 
        actionText="Add Your First Friend" 
        onAction={onAddNew} 
      />
    );
  }

  return (
    <div className="friends-list">
      {friends.map(friend => (
        <FriendCard
          key={friend._id}
          friend={friend}
          onEdit={onEdit}
          onDelete={onDelete}
          onSettle={onSettle}
        />
      ))}
    </div>
  );
}

export default FriendsList;