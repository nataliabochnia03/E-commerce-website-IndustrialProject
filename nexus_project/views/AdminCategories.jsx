import React, { useState, useEffect } from 'react';

import { db } from '../config/firebase';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function AdminCategories() {
  const [categoriesData, setCategoriesData] = useState();

  const categoriesCollectionRef = collection(db, 'categories');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query to fetch products sorted by name
        const q = query(categoriesCollectionRef, orderBy('name', 'desc'));
        // Read products data from the database
        const categoriesSnapshot = await getDocs(q);
        // Extract data from each document snapshot and store it in an array
        const catData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Set productsData state with the array of category data
        setCategoriesData(catData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className='global-container'>
        {!categoriesData ? (
          <div className="loading-animation"></div>
        ) : (
          <>
            <br /><br />
            <div style={{textAlign: 'center'}}>
              <a href='/admin/categories/new'><button className='button'>New Category</button></a>
            </div>
            <br /><br />
            <div className='row'>
              <div className='admin-panel-column-2'>
                <h2>Main Categories</h2>
                <br />
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesData.filter(cat => cat.type.toLowerCase() === 'category').map((category, index) => (
                      <tr key={index}>
                        <td>{category.name}</td>
                        <td>{category.type}</td>
                        <td><a href={`/admin/categories/edit/${category.id}`}><button className='button'>Edit</button></a></td>
                        <td><button className='button'>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='admin-panel-column-2'>
                <h2>Sub Categories</h2>
                <br />
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesData.filter(cat => cat.type.toLowerCase() === 'subcategory').map((category, index) => (
                      
                      <tr key={index}>
                        {console.log(category)}
                        <td>{category.name}</td>
                        <td>{category.type}</td>
                        <td><a href={`/admin/categories/edit/${category.id}`}><button className='button'>Edit</button></a></td>
                        <td><button className='button'>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
  
      <br /><br />

      <Footer />
    </>
  );
  
}

export default AdminCategories;