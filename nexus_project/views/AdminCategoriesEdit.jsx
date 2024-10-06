import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { db } from '../config/firebase';
import { getDoc, doc, collection, updateDoc } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function AdminCategories() {

  const { id } = useParams(); // Get the searchTerm from URL parameters

  const [categoryName, setCategoryName] = useState();
  const [categoryType, setCategoryType] = useState();

  const categoriesCollectionRef = collection(db, 'categories');
  const categoryDocRef = doc(categoriesCollectionRef, id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read products data from the database
        const categoriesSnapshot = await getDoc(categoryDocRef);
        // Extract data from each document snapshot and store it in an array
        const catData = {
          id: categoriesSnapshot.id,
          ...categoriesSnapshot.data()
        };
        // Set productsData state with the array of category data
        setCategoryName(catData.name);
        setCategoryType(catData.type);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  async function updateCategory() {
    try {
      await updateDoc(categoryDocRef, {
        name: categoryName,
        type: categoryType
      });
      alert('Category updated!')
      window.location.href = '/admin/categories'
    } catch(err) {
      console.error(err);
    };
  };

  return (
    <>
      <Navbar />

      <div className='global-container'>
        {!categoryName ? (
          <div className="loading-animation"></div>
        ) : (
          <>
            <br /><br />
            <h2>Update Category</h2>
            <br />
            <p>Insert Category Name</p>
            <input type='text' name="name" id="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            <br /><br />
            <p>Select Category Type (Cannot be changed)</p>
            <select name="subCategory" id="subCategory" onChange={(e) => setCategoryType(e.target.value)} disabled>
              <option value={categoryType} selected >{categoryType === 'category' ? 'Category' : 'Sub Category'}</option>
              <option value='category'>Category</option>
              <option value='subCategory'>Sub Category</option>
            </select>
            <br /><br />
            <button className='button' onClick={updateCategory}>Update</button>
            <br /><br />
          </>
        )}
      </div>
      <Footer />
    </>
  );
  
}

export default AdminCategories;