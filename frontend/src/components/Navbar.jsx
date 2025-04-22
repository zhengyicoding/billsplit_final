import { Link, useLocation } from 'react-router-dom';
import '../css/Navbar.css';
import logo from '../assets/billsplit-logo.svg'; 

function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="BillSplit Logo" className="navbar-logo" />
          <span>BillSplit</span>
        </Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={`${location.pathname === '/expenses' ? 'active' : ''} expenses-link`}>
          <Link to="/expenses">Expenses</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;