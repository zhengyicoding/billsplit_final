import './FormField.css';

function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  error = null,
  placeholder = '',
  options = [],
  ...rest
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For checkboxes, pass the checked property instead of value
    onChange(type === 'checkbox' ? checked : value, name);
  };

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          {...rest}
        />
      ) : type === 'radio' ? (
        <div className="radio-group">
          {options.map((option) => (
            <label key={option.value} className="radio-label">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                {...rest}
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          {...rest}
        />
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default FormField;
