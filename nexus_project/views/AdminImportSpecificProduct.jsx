import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useAuth } from '../components/AuthContext';

import { db } from '../config/firebase';
import { getDocs, getDoc, addDoc, doc, collection, query, where } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

import '../styles/adminPanel.css';

function AdminImportSpecificProduct() {
  const { user } = useAuth();

  const usersCollectionRef = collection(db, 'users');
  const categoriesCollectionRef = collection(db, 'categories');
  const productsCollectionRef = collection(db, 'products');

  const [userData, setUserData] = useState({});
  const [loadingUserData, setLoadingUserData] = useState(true);

  const [categoriesData, setCategoriesData] = useState({});

  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();
  const [marketplace, setMarketplace] = useState();
  const [link, setLink] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Get reference to the user document
          const userDocRef = doc(usersCollectionRef, user.uid);
          // Fetch the user document snapshot
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            // Extract user data from the document snapshot
            const userData = userDocSnapshot.data();
            // Set userData state with the user data
            setUserData(userData);
            setLoadingUserData(false);
          } else {
            console.error("User document does not exist");
            setLoadingUserData(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
  
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read categories data from the database
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        // Extract data from each document snapshot and store it in an array
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Set categoriesData state with the array of category data
        setCategoriesData(categoriesData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  async function importProduct() {
    if(link != undefined && category != undefined && subCategory != undefined && marketplace != undefined) {
      if(marketplace === 'Ebay') {
        // API call to get a single product from selected marketplace though its encoded and simplified url
        axios.get(`https://api.nexuscommerce.cloud/ebay/product/${encodeURIComponent(link.split('?')[0])}`, {
          headers: {
            'X-API-KEY': process.env.REACT_APP_API_KEY // Include the API key in the request headers
          }
        })
        .then(async (response) => {

          const productData = response.data;

          const categoryDocRef = doc(db, 'categories', category);
          const subCategoryDocRef = doc(db, 'categories', subCategory);
  
          // Check if the link already exists in the collection
          var q = query(productsCollectionRef, where("link", "==", productData.link));
          const linkQuerySnapshot = await getDocs(q);
  
          // If a document with the link already exists
          if (!linkQuerySnapshot.empty) {
            // Handle the case where the link already exists
            alert('This product have been already imported!');
            // You can choose to return early or perform other actions
            return;
          }
  
          const currentTimestamp = Date.now();

          // If the link doesn't exist, proceed with inserting the new document
          await addDoc(productsCollectionRef, {
            name: productData.name, 
            price: productData.price,
            img: productData.img, 
            link: productData.link.split('?')[0], 
            category: categoryDocRef, 
            subCategory: subCategoryDocRef, 
            marketplace: marketplace,
            available: true,
            importingDate: currentTimestamp
          });

          alert("Product Imported Successfully!")
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        // Possibility to add more marketplaces (SCALABLE)
      }
    } else {
      alert('You must provide all details!')
    }
  }
  
  return (
    <>
      <Navbar />

      <div className='global-container'>
        {loadingUserData ? (
          <p>Loading...</p>
        ) : !userData.isAdmin ? (
          <p>Are you lost?</p>
        ) : (
          <>
            <br /><br />
            <h2>Import Specific Product</h2>
            <br />
            <p>Select Main Category</p>
            <select name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
              <option selected disabled>Select Main Category</option>
              {categoriesData
                .filter(category => category.type === 'category')
                .map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <br /><br />
            <p>Select SubCategory</p>
            <select name="subCategory" id="subCategory" onChange={(e) => setSubCategory(e.target.value)}>
              <option selected disabled>Select SubCategory</option>
              {categoriesData
                .filter(category => category.type === 'subCategory')
                .map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <br /><br />
            <p>Select Marketplace</p>
            <select name="ebay" id="ebay" onChange={(e) => setMarketplace(e.target.value)}>
              <option selected disabled>Select Marketplace</option>
              <option>Ebay</option>
            </select>
            <br /><br />
            <p>Insert Product Link</p>
            <input type='text' name="link" id="link" onChange={(e) => setLink(e.target.value)} />
            <br /><br />
            <button className='button' onClick={importProduct}>Import</button>
            <br /><br />
          </>
        )}
      </div>

      <Footer />
    </>
  );
  
}  

export default AdminImportSpecificProduct;