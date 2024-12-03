import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import '../../style/adminProduct.css'; // ESTILOS PARA LA PÁGINA DE ADMINISTRACIÓN DE PRODUCTOS
import Pagination from '../common/Pagination'; // COMPONENTE PARA PAGINACIÓN

const AdminProductPage = () => {
    // ESTADO PARA ALMACENAR LA LISTA DE PRODUCTOS
    const [products, setProducts] = useState([]);
    // ESTADO PARA RASTREAR LA PÁGINA ACTUAL
    const [currentPage, setCurrentPage] = useState(1);
    // ESTADO PARA ALMACENAR EL NÚMERO TOTAL DE PÁGINAS
    const [totalPages, setTotalPages] = useState(0);
    // HOOK PARA NAVEGACIÓN ENTRE RUTAS
    const navigate = useNavigate();
    // ESTADO PARA MANEJAR ERRORES
    const [error, setError] = useState(null);
    // NÚMERO DE PRODUCTOS POR PÁGINA
    const itemsPerPage = 4;

    // FUNCIÓN PARA OBTENER LOS PRODUCTOS DESDE LA API
    const fetchProducts = async () => {
        try {
            // LLAMA A LA API PARA OBTENER TODOS LOS PRODUCTOS
            const response = await ApiService.getAllProducts();
            const productList = response.productList || []; // LISTA DE PRODUCTOS (SI ES NULA, SE INICIALIZA COMO VACÍA)
            
            // CALCULA EL NÚMERO TOTAL DE PÁGINAS
            setTotalPages(Math.ceil(productList.length / itemsPerPage));
            
            // ESTABLECE LOS PRODUCTOS PARA LA PÁGINA ACTUAL
            setProducts(productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            // GESTIONA LOS ERRORES SI LA PETICIÓN FALLA
            setError(error.response?.data?.message || error.message || 'The products could not be loaded.');
        }
    };

    // useEffect PARA CARGAR LOS PRODUCTOS CUANDO CAMBIA currentPage
    useEffect(() => {
        fetchProducts(); // LLAMA A LA FUNCIÓN PARA OBTENER LOS PRODUCTOS
    }, [currentPage]);

    // FUNCIÓN PARA REDIRIGIR A LA PÁGINA DE EDICIÓN DE UN PRODUCTO
    const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`); // REDIRIGE CON EL ID DEL PRODUCTO
    };

    // FUNCIÓN PARA ELIMINAR UN PRODUCTO
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?"); // CONFIRMACIÓN
        if (confirmed) {
            try {
                await ApiService.deleteProduct(id); // LLAMA A LA API PARA BORRAR EL PRODUCTO
                fetchProducts(); // ACTUALIZA LA LISTA DE PRODUCTOS
            } catch (error) {
                // GESTIONA LOS ERRORES SI LA PETICIÓN FALLA
                setError(error.response?.data?.message || error.message || 'The product could not be deleted.');
            }
        }
    };

    // RENDERIZA LA LISTA DE PRODUCTOS CON PAGINACIÓN Y OPCIONES DE ADMINISTRACIÓN
    return (
        <div className="admin-product-list">
            {/* SI HAY UN ERROR, LO MUESTRA */}
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <h2>Products</h2>
                    {/* BOTÓN PARA AÑADIR UN NUEVO PRODUCTO */}
                    <button className="product-btn" onClick={() => { navigate('/admin/add-product'); }}>
                        Add Product
                    </button>
                    {/* LISTA DE PRODUCTOS */}
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <img 
                                    src={`data:${product?.imageType || "image/jpeg"};base64,${product?.image}`}
                                    alt={product?.name} 
                                />
                                <span>{product.name}</span>
                                {/* BOTÓN PARA EDITAR UN PRODUCTO */}
                                <button className="product-btn" onClick={() => handleEdit(product.id)}>Edit</button>
                                {/* BOTÓN PARA BORRAR UN PRODUCTO */}
                                <button className="product-btn-delete" onClick={() => handleDelete(product.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {/* COMPONENTE DE PAGINACIÓN */}
                    <Pagination
                        currentPage={currentPage} // PÁGINA ACTUAL
                        totalPages={totalPages}   // TOTAL DE PÁGINAS
                        onPageChange={(page) => setCurrentPage(page)} // CAMBIA LA PÁGINA
                    />
                </div>
            )}
        </div>
    );
};

export default AdminProductPage;