import '../css/SearchInput.css';
import PropTypes from 'prop-types';

function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}) {
  return (
    <div className={`search-input ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}
SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};


export default SearchInput;