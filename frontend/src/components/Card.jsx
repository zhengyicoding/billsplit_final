import './Card.css';

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

export default Card;