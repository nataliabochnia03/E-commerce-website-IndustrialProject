import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';

import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

import '../styles/adminPanel.css';

function Admin() {
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
  
  return (
    <>
      <Navbar />

      <div className='global-container'>
        {loadingUserData ? (
          <div className="loading-animation"></div>
        ) : !userData.isAdmin ? (
          <p>Are you lost?</p>
        ) : (
          <div className='row'>
            <div className='admin-panel-column' onClick={() => window.location.href=('/admin/import-specific-product')}>
              <img src='https://images.unsplash.com/photo-1573376670774-4427757f7963?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
              <h3>Import a specific product</h3>
            </div>
            <div className='admin-panel-column' onClick={() => window.location.href=('/admin/stock')}>
              <img src='https://images.unsplash.com/photo-1586528116493-a029325540fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
              <h3>Products Stock</h3>
            </div>
            <div className='admin-panel-column' onClick={() => window.location.href=('/admin/import-bulk-products')}>
              <img src='https://images.unsplash.com/photo-1513672494107-cd9d848a383e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
              <h3>Bulk products import</h3>
            </div>
            <div className='admin-panel-column' onClick={() => window.location.href=('/admin/categories')}>
              <img src='https://images.unsplash.com/photo-1573376670774-4427757f7963?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
              <h3>Categories</h3>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
  
}  

export default Admin;