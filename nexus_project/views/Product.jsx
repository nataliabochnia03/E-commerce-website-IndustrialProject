import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useParams } from 'react-router-dom';

import { db } from '../config/firebase';
import { getDocs, getDoc, doc, collection, updateDoc } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

import '../styles/product.css';

function Product() {

  const { productId } = useParams(); // Get the productLink from URL parameters

  const productRef = doc(db, 'products', productId);
  const categoriesCollectionRef = collection(db, 'categories');

  const [categoriesData, setCategoriesData] = useState();
  const [liveProductData, setLiveProductData] = useState();
  const [storedProductData, setStoredProductData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if(productId) {
        try {
          // Read product data from the database
          const productSnapshot = await getDoc(productRef);
          if (!productSnapshot.empty) {
            // Extract the data from the document
            const productData = productSnapshot.data(); // Extracting data from the first document

            const categoryDoc = await getDoc(productData.category);
            const subCategoryDoc = await getDoc(productData.subCategory);
            productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
            productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;

            // Set storedProductsData state with the product data retrieved
            setStoredProductData(productData);

            const productDocRef = doc(db, 'products', productId);

            try {
              // Retrieve live product data from ebay through the stored product data link just retrieved 
              axios.get(`https://api.nexuscommerce.cloud/ebay/product/${encodeURIComponent(productData.link)}`, {
                headers: {
                  'X-API-KEY': process.env.REACT_APP_API_KEY // Include the API key in the request headers
                }
              })
              .then(async (response) => {
                setLiveProductData(response.data);

                // If availability of product scraped live is not null and its availability does not contain the word 'Out of stock'
                if(response.data.isSoldOut) {
                  await updateDoc(productDocRef, {
                    // Availability status
                    available: false,
                  });
                  alert("Sorry! Product has SOLD OUT!")
                  window.location.href = '/';
                } else if(response.data.availability === null || response.data.availability === undefined) {
                  await updateDoc(productDocRef, {
                    // Availability status
                    available: false,
                  });
                  alert("Sorry! Product has SOLD OUT!")
                  window.location.href = '/';
                } else if(response.data.availability.split('Out of stock').length > 1) {
                  await updateDoc(productDocRef, {
                    // Availability status
                    available: false,
                  });
                  alert("Sorry! Product has SOLD OUT!")
                  window.location.href = '/';
                } else {
                  //Update the document with new data
                  await updateDoc(productDocRef, {
                    // Product details
                    name: response.data.name, 
                    price: response.data.price,
                    img: response.data.img, 
                    // Availability status
                    available: true,
                  });
                }
              })
            } catch (error) {
              console.error("Error fetching online product data:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      }
    };
    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read categories data from the database
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        // Extract data from each document snapshot and store it in an array
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data());
        // Set categoriesData state with the array of category data
        setCategoriesData(categoriesData);
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
        {!liveProductData || !storedProductData ? (
          <div className="loading-animation"></div>
        ) : 
          <>
            <br /><br />
            <div className='row'>
              <div className='product-column-left'>
                <img src={liveProductData.img} />
              </div>
              <div className='product-column-right'>
                <h3>{liveProductData.name}</h3>
                <br />
                {
                  <p>
                    <a href={`/category/${storedProductData.category.name}`}>
                      {storedProductData.category.name}
                    </a>
                    {' > '}
                    <a href={`/category/${storedProductData.subCategory.name}`}>
                      {storedProductData.subCategory.name}
                    </a>
                  </p>
                }
                <br />
                {/* If product has a description display it */}
                <p>{liveProductData.description !== '' ? <><p>{liveProductData.description}</p><br /></> : null}</p>
                <h2>{liveProductData.price}</h2>
                <br />
                <h3>{liveProductData.isSoldOut ? 'SOLD OUT' : liveProductData.availability ? liveProductData.availability : '1 available'}</h3>
                <br />
                <h2>⭐ {liveProductData.rating ? liveProductData.rating : 'No reviews yet'}</h2>
                <br />
                <a href={liveProductData.link}><button className='button'>Buy Now</button></a>
              </div>
            </div>
            <br /><br />
          </>
        }
      </div>

      <Footer />
    </>
  );
  
}  

export default Product;