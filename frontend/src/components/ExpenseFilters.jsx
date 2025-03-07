import SearchInput from './SearchInput';
import FormField from './FormField';
import SortButton from './SortButton';
import Button from './Button';
import './ExpenseFilters.css';

function ExpenseFilters({ 
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  sortField = 'date',
  sortDirection = 'desc',
  onSortChange,
  friends = [],
  onResetFilters
}) {
  // Handler for filter changes
  const handleFilterChange = (value, name) => {
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="expense-filters">
      <div className="search-section">
        <SearchInput 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search expenses..."
        />
      </div>
      
      <div className="filters-section">
        <div className="filter-row">
          <FormField 
            type="select"
            name="friendId"
            label="Friend"
            value={filters.friendId || ''}
            onChange={handleFilterChange}
            options={[
              { value: '', label: 'All Friends' },
              ...friends.map(friend => ({ 
                value: friend._id, 
                label: friend.name 
              }))
            ]}
          />
          
          <FormField 
            type="select"
            name="status"
            label="Status"
            value={filters.status || 'all'}
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: 'All' },
              { value: 'settled', label: 'Settled' },
              { value: 'unsettled', label: 'Unsettled' }
            ]}
          />
        </div>
        
        <div className="filter-row">
          <FormField 
            type="date"
            name="dateFrom"
            label="From"
            value={filters.dateFrom || ''}
            onChange={handleFilterChange}
          />
          
          <FormField 
            type="date"
            name="dateTo"
            label="To"
            value={filters.dateTo || ''}
            onChange={handleFilterChange}
          />
          
          <div className="reset-filters">
            <Button 
              variant="secondary"
              size="small"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="sort-section">
        <span className="sort-label">Sort by:</span>
        <SortButton 
          label="Date"
          field="date"
          currentSortField={sortField}
          currentSortDirection={sortDirection}
          onSort={onSortChange}
        />
        <SortButton 
          label="Amount"
          field="amount"
          currentSortField={sortField}
          currentSortDirection={sortDirection}
          onSort={onSortChange}
        />
        <SortButton 
          label="Description"
          field="description"
          currentSortField={sortField}
          currentSortDirection={sortDirection}
          onSort={onSortChange}
        />
      </div>
    </div>
  );
}

export default ExpenseFilters;