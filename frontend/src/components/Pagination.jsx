import Button from './Button';
import './Pagination.css';
import PropTypes from 'prop-types';

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first and last page, and up to 3 pages around current page
    if (totalPages <= maxPagesToShow) {
      // If small number of pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add first page
      pages.push(1);
      
      // Add ellipsis if needed
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always add last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <Button 
        variant="secondary"
        size="small"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        &laquo; First
      </Button>
      
      <Button 
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt; Prev
      </Button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "secondary"}
            size="small"
            onClick={() => onPageChange(page)}
            className="pagination-number"
          >
            {page}
          </Button>
        )
      ))}
      
      <Button 
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </Button>
      
      <Button 
        variant="secondary"
        size="small"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last &raquo;
      </Button>
    </div>
  );
}
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;