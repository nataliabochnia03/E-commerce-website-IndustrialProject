import React, { useState } from 'react';

import { db } from '../config/firebase';
import { query, getDocs, addDoc, collection, where } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function AdminCategoriesNew() {

  const [categoryName, setCategoryName] = useState();
  const [categoryType, setCategoryType] = useState();

  const categoriesCollectionRef = collection(db, 'categories');

  async function newCategory() {
    try {
      // Check if the category name already exists
      const q = query(categoriesCollectionRef, where("name", "==", categoryName));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // If a document with the same name exists, display an alert and return
        alert('Category with the same name already exists!');
        return;
      }
  
      // If the category name doesn't exist, proceed to create a new category
      await addDoc(categoriesCollectionRef, {
        name: categoryName,
        type: categoryType
      });
      alert('Category created!');
      window.location.href = '/admin/categories';
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <>
      <Navbar />

      <div className='global-container'>
        <>
          <br /><br />
          <h2>New Category</h2>
          <br />
          <p>Insert Category Name</p>
          <input type='text' name="name" id="name" placeholder='Insert Category Name' onChange={(e) => setCategoryName(e.target.value)} />
          <br /><br />
          <p>Select Category Type</p>
          <select name="subCategory" id="subCategory" onChange={(e) => setCategoryType(e.target.value)}>
            <option disabled selected >Select Category Type</option>
            <option value='category'>Category</option>
            <option value='subCategory'>Sub Category</option>
          </select>
          <br /><br />
          <button className='button' onClick={newCategory}>Create</button>
          <br /><br />
        </>
      </div>
      <Footer />
    </>
  );
  
}

export default AdminCategoriesNew;