import React from 'react';
import './Pagination.css';
import { Button } from '.';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <Button 
        variant="outline" 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <Button 
        variant="outline" 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
