import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import "../../style/home.css";


const CategoryProductsPage=()=>{


    const {categoryId}=useParams();
    const [products, setProducts] = useState([]);
    // ESTADO PARA LA PÁGINA ACTUAL (INICIA EN 1)
    const [currentPage, setCurrentPage] = useState(1);
    // ESTADO PARA EL TOTAL DE PÁGINAS DISPONIBLES
    const [totalPages, setTotalPages] = useState(0);
    // ESTADO PARA ALMACENAR ERRORES
    const [error, setError] = useState(null);
    // NÚMERO DE ELEMENTOS A MOSTRAR POR PÁGINA
    const itemsPerPage = 4;


    useEffect(()=>{
        fetchProducts();
    },[categoryId,currentPage])

    const fetchProducts=async()=>{
        setError(null);
        setProducts([]);
        try{
            const response = await ApiService.getAllProductByCategoryId(categoryId);
            const allProducts = response.productList || [];
            setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
            setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        }catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch products from this category.')
        }
    }

    return(
        <div className="home">
            {error ? (
                <p className="error-message">{error}</p>
            ):(
                <div>
                    <ProductList products={products}/>
                    <Pagination  currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page)=> setCurrentPage(page)}/>
                </div>
            )}
        </div>
    )

} 
export default CategoryProductsPage;