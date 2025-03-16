import '../css/Card.css';
import PropTypes from 'prop-types';

function Card({ children, className = '', onClick }) {
  return (
    <div 
      className={`card ${className} ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
}
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;