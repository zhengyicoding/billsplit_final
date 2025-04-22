import '../css/Card.css';
import PropTypes from 'prop-types';

function Card({ 
  children, 
  className = '', 
  onClick,
  tabIndex,
  onKeyDown,
  role,
  ref,
  'aria-expanded': ariaExpanded,
  'aria-label': ariaLabel,
  ...otherProps
}) {
  return (
    <div 
      className={`card ${className} ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      role={role}
      ref={ref}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.string,
  onKeyDown: PropTypes.func,
  role: PropTypes.string,
  ref: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  'aria-expanded': PropTypes.bool,
  'aria-label': PropTypes.string
};

export default Card;