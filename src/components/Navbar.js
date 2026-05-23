import React from 'react'
import { Link , useLocation, useNavigate} from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  let location = useLocation()
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-premium sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">iNoteBook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname==="/"?'active':""}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className= {`nav-link ${location.pathname==="/About"?'active':""}`}to="/About">About</Link>
              </li>
            </ul>
            <button className="theme-toggle mx-3" onClick={toggleTheme}>
              {theme === 'dark' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
            </button>
            {!localStorage.getItem('token') ? (
              <div className="d-flex">
                <Link className="btn btn-premium mx-1" to="/login" role="button">Login</Link>
                <Link className="btn btn-premium mx-1" to="/signup" role="button">Signup</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="btn btn-premium mx-1">Logout</button>
            )}
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Navbar
