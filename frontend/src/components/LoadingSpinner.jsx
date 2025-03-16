import '../css/LoadingSpinner.css';
import PropTypes from 'prop-types';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
LoadingSpinner.propTypes = {
  message: PropTypes.string,
};


export default LoadingSpinner;
