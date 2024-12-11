import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductList from '../common/ProductList';
import Pagination from '../common/Pagination';
import ApiService from '../../service/ApiService';
import '../../style/home.css';

const Home = () => {
    // OBTIENE LA UBICACIÓN ACTUAL DE LA URL
    const location = useLocation();
    // ESTADO PARA LA LISTA DE PRODUCTOS
    const [products, setProducts] = useState([]);
    // ESTADO PARA LA PÁGINA ACTUAL (INICIA EN 1)
    const [currentPage, setCurrentPage] = useState(1);
    // ESTADO PARA EL TOTAL DE PÁGINAS DISPONIBLES
    const [totalPages, setTotalPages] = useState(0);
    // ESTADO PARA ALMACENAR ERRORES
    const [error, setError] = useState(null);
    // NÚMERO DE ELEMENTOS A MOSTRAR POR PÁGINA
    const itemsPerPage = 4;

    useEffect(() => {
        setCurrentPage(1); // Reinicia a la página 1 cuando cambie el término de búsqueda
    }, [location.search]);


    //EFECTO QUE OBTIENE LOS PRODUCTOS CUANDO CAMBIA LA PAGINA O LA BUSQUEDA 
    useEffect(() => {
        const fetchProducts = async () => {
            setError(null);  // Resetear error al hacer una nueva búsqueda

            try {
                let allProducts = []; // Almacena los productos obtenidos
                // OBTIENE LOS PARAMETROS DE BUSQUEDA DE LA URL
                const queryParams = new URLSearchParams(location.search);
                // RECUPERA EL TERMINO DE BUSQUEDA SI EXISTE
                let searchItem = queryParams.get('search');
                if (searchItem) {
                    // LLAMA A LA API PARA OBTENER LOS PRODUCTOS FILTRADOS
                    const response = await ApiService.searchProducts(searchItem);
                    allProducts = response.productList || [];
                    if (allProducts.length === 0) {
                        setError("No products match the search.");
                    }
                } else {
                    // OBTIENE TODOS LOS PRODUCTOS YA QUE NO EXISTE FILTRO DE BÚSQUEDA
                    const response = await ApiService.getAllProducts();
                    allProducts = response.productList || [];
                }

                // OBTIENE LA CANTIDAD TOTAL PAGINAS DIVIDIENDO TOTALPRODUCTOS/ITEM POR PAGINA
                setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
                // CORTA EL ARREGLO PARA MOSTRAR SOLAMENTE LOS PRODUCTOS DE LA PAGINA ACTUAL
                setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Unable to fetch the products.');
            }
        };
        // LLAMA A LA FUNCION PARA OBTENER LOS PRODUCTOS
        fetchProducts();
    }, [location.search, currentPage]);

    return (
        <div className="home">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    {products.length > 0 ? (
                        <>
                            <ProductList products={products} />
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </>
                    ) : (
                        <p></p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;