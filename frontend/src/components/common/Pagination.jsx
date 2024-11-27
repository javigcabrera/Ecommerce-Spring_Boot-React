import React from "react";
import '../../style/pagination.css';

//COMPONENTE DE PAGINACION
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => {
            if (number !== currentPage) {
              onPageChange(number);
            }
          }} // Solo llama a onPageChange si el número no es la página actual
          className={number === currentPage ? 'active' : ''}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
