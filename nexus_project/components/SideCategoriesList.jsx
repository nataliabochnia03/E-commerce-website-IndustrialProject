import React, { useState, useEffect } from "react";
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

const SideCategoriesList = () => {

  const [categoriesData, setCategoriesData] = useState([]);

  const categoriesCollectionRef = collection(db, 'categories');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read categories data from the database
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        // Extract data from each document snapshot and store it in an array
        const categoriesData = categoriesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
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
      <h2>Categories</h2>
      <br />
      <a href={`/`}><p>Home</p></a>
      {categoriesData && 
        categoriesData.map((category) => (
          <React.Fragment key={category.id}>
            <a href={`/category/${category.name}`}><p>{category.type === 'category' ? category.name : null}</p></a>
          </React.Fragment>
        ))
      }
    </>
  )
};

export default SideCategoriesList;