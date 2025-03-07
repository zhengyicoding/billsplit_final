import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BillSplit</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname === '/expenses' ? 'active' : ''}>
          <Link to="/expenses">Expenses</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;