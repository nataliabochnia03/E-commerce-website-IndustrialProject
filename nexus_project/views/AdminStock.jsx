import React, { useState, useEffect } from 'react';

import { db } from '../config/firebase';
import { getDocs, collection, query, orderBy, doc, deleteDoc, getDoc, DocumentReference } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function AdminStock() {
  const [productsData, setProductsData] = useState();

  const productsCollectionRef = collection(db, 'products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query to fetch products sorted by a timestamp
        const q = query(productsCollectionRef, orderBy('importingDate', 'desc'));
        // Read products data from the database
        const productsSnapshot = await getDocs(q);
        // Extract data from each document snapshot and store it in an array
        const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
          const productData = { id: doc.id, ...doc.data() };
          // Resolve category reference to actual category data
          if (productData.category instanceof DocumentReference) {
            const categoryDoc = await getDoc(productData.category);
            productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
          }
          if (productData.subCategory instanceof DocumentReference) {
            const categoryDoc = await getDoc(productData.subCategory);
            productData.subCategory = categoryDoc.exists() ? categoryDoc.data() : null;
          }
          return productData;
        }));
        // Set productsData state with the array of category data
        setProductsData(productsData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (productId) => {
    // Prompt the user for confirmation
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  
    // If user confirms, proceed with deletion
    if (confirmDelete) {
      const productDocRef = doc(db, "products", productId);
  
      try {
        // Delete the document
        await deleteDoc(productDocRef);
        alert("Product successfully deleted!");

        // Update productsData state by filtering out the deleted product
        setProductsData(prevProductsData => prevProductsData.filter(product => product.id !== productId));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  return (
    <>
      <Navbar />
  
      <br /><br />

      <div className='global-container'>
        {!productsData ? (
          <div className="loading-animation"></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Available</th>
                <th>Link</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product, index) => (
                <tr key={index} style={ !product.available ? { backgroundColor: 'red', color: 'white' } : {} }>
                  <td><a href={`/product/${product.id}`}><img src={product.img} alt='Product' /></a></td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category.name ? product.category.name : product.category[0].name}</td>
                  <td>{product.subCategory.name ? product.subCategory.name : product.subCategory[0].name}</td>
                  <td>{product.available ? 'True' : 'False'}</td>
                  <td>
                    <a href={product.link} 
                      target='_blank' 
                      rel="noreferrer" 
                      style={ !product.available ? { backgroundColor: 'red', color: 'white' } : {} }>
                        Link
                    </a>
                  </td>
                  <td><button onClick={() => handleDelete(product.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
      <br /><br />

      <Footer />
    </>
  );
  
}

export default AdminStock;