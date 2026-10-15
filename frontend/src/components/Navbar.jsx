import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

/**
 * SCHOLARO Global Navbar
 *
 * Props:
 * @param {boolean} [props.isLoggedIn=false]
 * @param {{ name: string, email: string } | null} [props.user=null]
 * @param {Function} [props.onLogout]
 */
const Navbar = ({ isLoggedIn = false, user = null, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = isLoggedIn
    ? [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Scholarships', to: '/scholarships' },
        { label: 'My Profile', to: '/profile' },
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Scholarships', to: '/scholarships' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'About', to: '/about' },
      ];

  const handleLogout = () => {
    setProfileOpen(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  const getInitials = (user) => {
    const name = user?.full_name || user?.name || '';
    if (!name) return 'U';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  };

  return (
    <header className="navbar" role="banner">
      <div className="app-container">
        <nav className="navbar-inner" aria-label="Main navigation">

          {/* Brand */}
          <Link to="/" className="navbar-brand" aria-label="SCHOLARO Home">
            <span className="navbar-logo" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#059669" />
                <path d="M8 21l8-10 8 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="10" r="2.5" fill="white" />
              </svg>
            </span>
            <span className="navbar-brand-text">
              <span className="navbar-name">SCHOLARO</span>
              <span className="navbar-tagline">Eligible Scholarship Finder</span>
            </span>
          </Link>

          {/* Primary Nav Links */}
          <ul className="navbar-links" role="list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'navbar-link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="navbar-actions">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="navbar-action-link">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            ) : (
              <div className="navbar-profile">
                <button
                  type="button"
                  className="navbar-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                >
                  <span className="navbar-avatar" aria-hidden="true">
                    {getInitials(user)}
                  </span>
                  <span className="navbar-user-name">{user?.full_name || user?.name || 'Student'}</span>
                  <span className="navbar-chevron" aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="navbar-dropdown" role="menu">
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.full_name || user?.name || 'Student'}</p>
                      <p className="navbar-dropdown-email">{user?.email || ''}</p>
                    </div>
                    <hr className="navbar-dropdown-divider" />
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      to="/saved"
                      className="navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                      Saved Scholarships
                    </Link>
                    <hr className="navbar-dropdown-divider" />
                    <button
                      type="button"
                      className="navbar-dropdown-item navbar-dropdown-item--danger"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
