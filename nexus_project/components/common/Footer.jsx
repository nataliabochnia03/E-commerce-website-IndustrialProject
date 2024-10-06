import React, { useState } from 'react';

import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

import { useAuth } from '../AuthContext';

import '../../styles/common/footer.css'; // CSS file for styling

const Footer = () => {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <a href="/">Nexus Commerce</a>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="/">Home</a></li>
            {user ? (
              <>
                <li onClick={logout} style={{ cursor: 'pointer' }}>{user.email} (Logout)</li>
              </>
            ) : <li><a href="/login">Login</a></li>}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Nexus Commerce</p>
      </div>
    </footer>
  );
};

export default Footer;
