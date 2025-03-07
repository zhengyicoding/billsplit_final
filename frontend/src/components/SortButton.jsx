import './SortButton.css';

function SortButton({ 
  label, 
  field, 
  currentSortField, 
  currentSortDirection, 
  onSort 
}) {
  const isActive = currentSortField === field;
  
  const handleClick = () => {
    if (isActive) {
      // Toggle direction if already sorting by this field
      const newDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      onSort(field, newDirection);
    } else {
      // Default to descending for new sort field
      onSort(field, 'desc');
    }
  };
  
  return (
    <button 
      className={`sort-button ${isActive ? 'active' : ''}`} 
      onClick={handleClick}
    >
      {label}
      {isActive && (
        <span className="sort-indicator">
          {currentSortDirection === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </button>
  );
}
export default SortButton;