import Button from "./Button";
import './SortButton.css';
import PropTypes from 'prop-types';


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
    <Button 
      className={`sort-button ${isActive ? 'active' : ''}`} 
      onClick={handleClick}
    >
      {label}
      {isActive && (
        <span className="sort-indicator">
          {currentSortDirection === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </Button>
  );
}
SortButton.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  currentSortField: PropTypes.string.isRequired,
  currentSortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSort: PropTypes.func.isRequired,
};
export default SortButton;