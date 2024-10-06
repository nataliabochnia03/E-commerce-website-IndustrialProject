import React, { useState } from 'react';
import '../styles/searchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      // Call the onSearch function passed from parent component
      window.location.href = `/search/${searchTerm}`;
    } else {
      alert("You must type something before searching!");
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className='search-input'
        type="text"
        placeholder="Search a product..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button className="search-btn" type="submit">Search</button>
    </form>
  );
};

export default SearchBar;