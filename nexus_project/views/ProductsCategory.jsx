import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { getDocs, collection, query, where, doc, getDoc, DocumentReference } from 'firebase/firestore';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SideCategoriesList from '../components/SideCategoriesList';
import '../styles/sideCategories.css';

const ProductsCategory = () => {
  const { categoryName } = useParams();

  const categoriesCollectionRef = collection(db, 'categories');
  const productsCollectionRef = collection(db, 'products');

  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);

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
    const fetchProducts = async () => {
      try {
        const cat = categoriesData.filter(doc => doc.name === categoryName);
        const categoryDocRef = doc(db, 'categories', cat[0].id);

        let q = query(productsCollectionRef, where("category", "==", categoryDocRef));
        let querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length === 0) {
          q = query(productsCollectionRef, where("subCategory", "==", categoryDocRef));
          querySnapshot = await getDocs(q);
        }

        const productsData = await Promise.all(querySnapshot.docs.map(async doc => {
          const productData = { id: doc.id, ...doc.data() };
          if (productData.category instanceof DocumentReference) {
            const categoryDoc = await getDoc(productData.category);
            const subCategoryDoc = await getDoc(productData.subCategory);
            productData.category = categoryDoc.exists() ? categoryDoc.data() : null;
            productData.subCategory = subCategoryDoc.exists() ? subCategoryDoc.data() : null;
          }
          return productData;
        }));

        setProductsData(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [categoryName, categoriesData]);

  return (
    <>
      <Navbar />
      <div className='global-container'>
        <h2>{categoryName}</h2>
        {!productsData.length ? (
          <div className="loading-animation"></div>
        ) : (
          <div className='row'>
            <div className='column-sideCategories-left'>
              <SideCategoriesList />
            </div>
            <div className='column-sideCategories-right'>
              {productsData.filter(product => product.available === true).map((product, index) => (
                <div className='column-product' onClick={() => window.location.href = `/product/${product.id}`} key={index}>
                  <img src={product.img} alt={product.name} />
                  <p>{product.name}</p>
                  <h3>{product.price}</h3>
                  <a href={`/category/${product.subCategory.name}`}><p>{product.subCategory.name}</p></a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductsCategory;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../config/firebase';
// import { getDocs, collection, query, where, doc, getDoc, DocumentReference } from 'firebase/firestore';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';
// import SideCategoriesList from '../components/SideCategoriesList';
// import '../styles/searchBar.css';

// const ProductsCategory = () => {
//   const { categoryName } = useParams(); // Get the searchTerm from URL parameters

//   const categoriesCollectionRef = collection(db, 'categories');
//   const productsCollectionRef = collection(db, 'products');

//   const [categoriesData, setCategoriesData] = useState([]);
//   const [productsData, setProductsData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Read categories data from the database
//         const categoriesSnapshot = await getDocs(categoriesCollectionRef);
//         // Extract data from each document snapshot and store it in an array
//         const categoriesData = categoriesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
//         // Set categoriesData state with the array of category data
//         setCategoriesData(categoriesData);
//       } catch (error) {
//         console.error("Error fetching categories data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const cat = categoriesData.filter(doc => doc.name == categoryName);
//         const categoryDocRef = doc(db, 'categories', cat[0].id);

//         // Query products based on categoryId
//         const q = query(productsCollectionRef, where("category", "==", categoryDocRef));
//         var querySnapshot = await getDocs(q);

//         // If no category is found, check subcategories
//         if(querySnapshot.docs.length === 0) {
//           // Query products based on categoryId
//           const q = query(productsCollectionRef, where("subCategory", "==", categoryDocRef));
//           querySnapshot = await getDocs(q);
//         }
    
//         const productsData = await Promise.all(querySnapshot.docs.map(async doc => {
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
    
//         setProductsData(productsData);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, [categoryName, categoriesData]);

//   return (
//     <>
//       <Navbar />
//       <br /><br />
//       <div className='global-container'>
//         <h2>{categoryName}</h2>
//         <br /><br />
//         {!productsData ? (
//           <div className="loading-animation"></div>
//         ) : (
//           <div className='row'>
//             <div className='column-sideCategories-left'>
//               <SideCategoriesList />
//             </div>
//             <div className='column-sideCategories-right'>
//               {productsData.map((product, index) => {
//                 if (index % 4 === 0) {
//                   return (
//                     <div className='row' key={index}>
//                       {productsData
//                         .filter(product => product.available === true)
//                         .slice(index, index + 4)
//                         .map((product, innerIndex) => (
//                           <div className='column-product' onClick={() => window.location.href = `/product/${product.id}`} key={innerIndex}>
//                             <img src={product.img} alt={product.name}></img>
//                             <p>{product.name}</p>
//                             <h3>{product.price}</h3>
//                             <a href={`/category/${product.subCategory.name}`}><p>{product.subCategory.name}</p></a>
//                           </div>
//                         ))}
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//       <br /><br />
//       <Footer />
//     </>
//   );
// };

// export default ProductsCategory;
