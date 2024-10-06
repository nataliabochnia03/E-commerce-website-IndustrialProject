import React, { useState, useEffect } from 'react';

import { db, auth } from '../../config/firebase';

import { signOut } from 'firebase/auth';

import { getDocs, collection } from 'firebase/firestore';

import '../../styles/style.css';
import '../../styles/common/navbar.css';
import '../../styles/common/loadinganimation.css';

import { useAuth } from '../AuthContext';

const Navbar = () => {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();

  const usersCollectionRef = collection(db, 'users');

  const [userData, setUserData] = useState({});
  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoadingUserData(false);
        // Read users data from the database
        const usersSnapshot = await getDocs(usersCollectionRef);
        // Get current user data
        const filteredUser = usersSnapshot.docs.find(doc => doc.id === user.uid);
        // Set userData to firebase user data
        setUserData(filteredUser._document.data.value.mapValue.fields);
      }
    };
    fetchData();
  }, [user]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const adminRedirect = async () => {
    window.location.href = '/admin';
  };

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">Nexus Commerce</a>
        </div>
        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            {!loadingUserData && (
              userData.isAdmin ? (
                <>
                  <li onClick={adminRedirect} style={{ cursor: 'pointer' }}>Admin</li>
                  <li onClick={logout} style={{ cursor: 'pointer' }}>{user.email} (Logout)</li>
                </>
              ) : userData ? (
                <li onClick={logout} style={{ cursor: 'pointer' }}>{user.email} (Logout)</li>
              ) : (
                <li><a href="/login">Login</a></li>
              )
            )}
          </ul>
        </div>
        <div className="navbar-toggle" onClick={toggleNavbar}>
          {isOpen ? 'Close' : 'Menu'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
