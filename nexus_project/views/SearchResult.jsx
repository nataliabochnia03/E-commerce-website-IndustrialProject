import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { db } from '../config/firebase';
import { getDocs, collection, getDoc, DocumentReference } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

import '../styles/searchBar.css';

const SearchResult = () => {

  const { searchTerm } = useParams(); // Get the searchTerm from URL parameters

  const productsCollectionRef = collection(db, 'products');

  const [searchResults, setSearchResults] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read products data from the database
        const productsSnapshot = await getDocs(productsCollectionRef);
        // Extract data from each document snapshot and store it in an array
        const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
          const productData = { id: doc.id, ...doc.data() };
          // Resolve category reference to actual category data
          if (productData.category instanceof DocumentReference) {
            const categoryDoc = await getDoc(productData.category);
            const subCategoryDoc = await getDoc(productData.subCategory);
            productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
            productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
          }
          return productData;
        }));
        // Set recentlyAddedProducts state with the array of products data
        setSearchResults(productsData.filter(prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase())));
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <br /><br />
      <div className='global-container'>
        <h2>Search results for: {searchTerm}</h2>
        <br /><br />
        {!searchResults ? (
          <div className="loading-animation"></div>
        ) : (
          searchResults.map((product, index) => {
            if (index % 4 === 0) {
              return (
                <>
                  <div className='row' key={index}>
                    {searchResults
                      .slice(index, index + 4)
                      .filter(product => product.available === true)
                      .map((product, innerIndex) => (
                        <div className='column-product' onClick={() => window.location.href = `/product/${product.id}`} key={innerIndex}>
                          <img src={product.img} alt={product.name}></img>
                          <p>{product.name}</p>
                          <h3>{product.price}</h3>
                          <a href={`/${product.subCategory.name}`}><p>{product.subCategory.name}</p></a>
                        </div>
                      ))}
                  </div>
                  <br />
                </>
              );
            }
            return null;
          })
        )}
      </div>
      <br /><br />
      <Footer />
    </>
  );
};

export default SearchResult;