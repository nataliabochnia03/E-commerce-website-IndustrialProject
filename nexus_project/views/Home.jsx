// import React, { useState, useEffect } from 'react';

// import { db } from '../config/firebase';
// import { getDocs, orderBy, limit, collection, query, doc, where, getDoc, DocumentReference } from 'firebase/firestore';

// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';
// import SearchBar from '../components/SearchBar';

// import CategoriesSlider from '../components/CategoriesSlider';
// import ProductsSlider from '../components/ProductsSlider';

// import '../styles/sideCategories.css';

// function Home() {

//   const categoriesCollectionRef = collection(db, 'categories');
//   const productsCollectionRef = collection(db, 'products');

//   const [categoriesData, setCategoriesData] = useState();
//   const [recentlyAddedProducts, setRecentlyAddedProducts] = useState();
//   const [categoriesProductsData, setCategoriesProductsData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Read categories data from the database
//         const categoriesSnapshot = await getDocs(categoriesCollectionRef);
//         // Extract data from each document snapshot and store it in an array
//         const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         // Set categoriesData state with the array of category data
//         setCategoriesData(categoriesData);
//       } catch (error) {
//         console.error("Error fetching categories data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Query to fetch the last 10 products sorted by a timestamp
//         const q = query(productsCollectionRef, orderBy('importingDate', 'desc'), limit(10));
//         // Read products data from the database
//         const productsSnapshot = await getDocs(q);
//         // Extract data from each document snapshot and store it in an array
//         const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
//           const productData = { id: doc.id, ...doc.data() };
//           // Resolve category reference to actual category data
//           if (productData.category instanceof DocumentReference) {
//             const categoryDoc = await getDoc(productData.category);
//             const subCategoryDoc = await getDoc(productData.subCategory);
//             productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
//             productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
//           }
//           return productData;
//         }));
//         // Set recentlyAddedProducts state with the array of products data
//         setRecentlyAddedProducts(productsData);
//       } catch (error) {
//         console.error("Error fetching products data:", error);
//       }
//     };
//     fetchData();
//   }, []);  

//   useEffect(() => {
//     if (categoriesData) {
//       const fetchData = async () => {
//         try {
//           categoriesData.filter(category => category.type != 'subCategory').forEach(async (category) => {
//             const catDocRef = doc(db, 'categories', category.id);
//             const q = query(productsCollectionRef, where('category', '==', catDocRef), limit(10));
//             const productsSnapshot = await getDocs(q);
//             if (productsSnapshot.size > 0) {
//               const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
//                 const productData = { id: doc.id, ...doc.data() };
//                 if (productData.category instanceof DocumentReference) {
//                   const categoryDoc = await getDoc(productData.category);
//                   const subCategoryDoc = await getDoc(productData.subCategory);
//                   productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
//                   productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
//                 }
//                 return productData;
//               }));
//               setCategoriesProductsData(prevData => [...prevData, productsData]);
//             }
//           });
//         } catch (error) {
//           console.error("Error fetching categories data:", error);
//           throw error;
//         }
//       };
//       fetchData();
//     }
//   }, [categoriesData]);  

//   return (
//     <>
//       <Navbar />
//       <div className='global-container'>
//         <br /><br />
//         <SearchBar />
//         <br /><br />
//         {categoriesData &&
//           <CategoriesSlider categories={categoriesData} />
//         }
//         <div className='row'>
//           <div>
//             <h2>Recently Added Products</h2>
//             <br />
//             {recentlyAddedProducts ? 
//               <>
//                 <ProductsSlider products={recentlyAddedProducts} />
//                 <br /><br />
//               </>
//               : 
//               <div className="loading-animation"></div>
//             }
//             <h2>Explore Categories</h2>
//             <br />
//             {categoriesProductsData ? 
//               categoriesProductsData.map(categoryProducts => {
//                 return (
//                   <>
//                     <a href={`/category/${categoryProducts[0].category.name}`}><h3>{categoryProducts[0].category.name}</h3></a>
//                     <br />
//                     <ProductsSlider products={categoryProducts} />
//                     <br /><br />
//                   </>
//                 )
//               })
//               : 
//               <div className="loading-animation"></div>
//             }
//             <br />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default Home;
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, orderBy, limit, collection, query, doc, where, getDoc, DocumentReference } from 'firebase/firestore';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SearchBar from '../components/SearchBar';
import CategoriesSlider from '../components/CategoriesSlider';
import ProductsSlider from '../components/ProductsSlider';

import '../styles/sideCategories.css';

function Home() {
  const categoriesCollectionRef = collection(db, 'categories');
  const productsCollectionRef = collection(db, 'products');

  const [categoriesData, setCategoriesData] = useState([]);
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState([]);
  const [categoriesProductsData, setCategoriesProductsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategoriesData(categoriesData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(productsCollectionRef, orderBy('importingDate', 'desc'), limit(10));
        const productsSnapshot = await getDocs(q);
        const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
          const productData = { id: doc.id, ...doc.data() };
          if (productData.category instanceof DocumentReference) {
            const categoryDoc = await getDoc(productData.category);
            const subCategoryDoc = await getDoc(productData.subCategory);
            productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
            productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
          }
          return productData;
        }));
        setRecentlyAddedProducts(productsData);
      } catch (error) {
        console.error("Error fetching products data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const categoriesDataMap = new Map();
      try {
        for (const category of categoriesData.filter(category => category.type !== 'subCategory')) {
          if (!categoriesDataMap.has(category.id)) {
            const catDocRef = doc(db, 'categories', category.id);
            const q = query(productsCollectionRef, where('category', '==', catDocRef), limit(10));
            const productsSnapshot = await getDocs(q);
            if (productsSnapshot.size > 0) {
              const productsData = await Promise.all(productsSnapshot.docs.map(async doc => {
                const productData = { id: doc.id, ...doc.data() };
                if (productData.category instanceof DocumentReference) {
                  const categoryDoc = await getDoc(productData.category);
                  const subCategoryDoc = await getDoc(productData.subCategory);
                  productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
                  productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
                }
                return productData;
              }));
              categoriesDataMap.set(category.id, productsData);
            }
          }
        }
        setCategoriesProductsData(Array.from(categoriesDataMap.values()));
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    if (categoriesData.length) {
      fetchCategoryProducts();
    }
  }, [categoriesData]);

  return (
    <>
      <Navbar />
      <div className='global-container'>
        <SearchBar />
        {categoriesData && <CategoriesSlider categories={categoriesData} />}
        <section className='recently-added'>
          <h2>Recently Added Products</h2>
          {recentlyAddedProducts.length ? 
            <ProductsSlider products={recentlyAddedProducts} /> :
            <div className="loading-animation"></div>
          }
        </section>
        <section className='explore-categories'>
          <h2>Explore Categories</h2>
          {categoriesProductsData.length ? 
            categoriesProductsData.map(categoryProducts => (
              <div key={categoryProducts[0].category.name}>
                <a href={`/category/${categoryProducts[0].category.name}`}><h3>{categoryProducts[0].category.name}</h3></a>
                <ProductsSlider products={categoryProducts} />
              </div>
            )) :
            <div className="loading-animation"></div>
          }
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Home;