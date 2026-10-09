import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onOpenAuth, onLogout }) {
  return (
    <nav className="navbar">
      <h2>AWDF Full-Stack App</h2>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/repositories" className={({ isActive }) => (isActive ? "active" : "")}>
            GitHub Repos
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
            Tasks (JWT)
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Auth Control in Navbar */}
      <div className="navbar-auth">
        {user ? (
          <div className="user-profile-badge">
            <span className="user-name-text">👤 {user.name}</span>
            <button className="auth-nav-btn logout" onClick={onLogout} title="Clear JWT Token and Log Out">
              Logout
            </button>
          </div>
        ) : (
          <button className="auth-nav-btn login" onClick={onOpenAuth} title="Log in or Register">
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
