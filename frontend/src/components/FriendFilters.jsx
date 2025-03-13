import SearchInput from './SearchInput';
import SortButton from './SortButton';
import './FriendFilters.css';
import PropTypes from 'prop-types';

function FriendFilters({ 
  searchTerm = '', 
  onSearchChange,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange
}) {
  return (
    <div className="friend-filters">
      <div className="filter-section">
        <SearchInput 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search friends..."
        />
      </div>
      
      <div className="sort-section">
        <span className="sort-label">Sort by:</span>
        <SortButton 
          label="Name"
          field="name"
          currentSortField={sortField}
          currentSortDirection={sortDirection}
          onSort={onSortChange}
        />
        <SortButton 
          label="Balance"
          field="balance"
          currentSortField={sortField}
          currentSortDirection={sortDirection}
          onSort={onSortChange}
        />
      </div>
    </div>
  );
}
FriendFilters.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSortChange: PropTypes.func.isRequired,
};
export default FriendFilters;