import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const [innerValue, setInnerValue] = useState(value || '');

  useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(innerValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [innerValue, onChange]);

  return (
    <div className="search-bar">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        value={innerValue} 
        onChange={(e) => setInnerValue(e.target.value)} 
        placeholder={placeholder} 
      />
      {innerValue && (
        <button className="clear-btn" onClick={() => setInnerValue('')}>&times;</button>
      )}
    </div>
  );
};

export default SearchBar;
