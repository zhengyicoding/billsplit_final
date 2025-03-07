import './SearchInput.css';

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

export default SearchInput;