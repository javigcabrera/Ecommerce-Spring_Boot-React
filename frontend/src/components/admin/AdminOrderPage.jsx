import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // HOOKS PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import '../../style/adminOrderPage.css'; // ESTILOS PARA LA PÁGINA DE ADMINISTRACIÓN DE PEDIDOS
import Pagination from "../common/Pagination"; // COMPONENTE DE PAGINACIÓN

// LISTA DE ESTADOS DISPONIBLES PARA LOS PEDIDOS
const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderPage = () => {
    // ESTADOS PARA ALMACENAR LA INFORMACIÓN DE LOS PEDIDOS
    const [orders, setOrders] = useState([]); // TODOS LOS PEDIDOS
    const [filteredOrders, setFilteredOrders] = useState([]); // PEDIDOS FILTRADOS POR ESTADO
    const [statusFilter, setStatusFilter] = useState(''); // ESTADO PARA EL FILTRO
    const [searchStatus, setSearchStatus] = useState(''); // ESTADO PARA BÚSQUEDA POR ESTADO
    const [currentPage, setCurrentPage] = useState(1); // PÁGINA ACTUAL
    const [totalPages, setTotalPages] = useState(0); // TOTAL DE PÁGINAS DISPONIBLES
    const [error, setError] = useState(null); // MENSAJES DE ERROR

    const itemsPerPage = 4; // NÚMERO DE ELEMENTOS POR PÁGINA
    const navigate = useNavigate(); // HOOK PARA REDIRECCIONAR ENTRE RUTAS

    // USEFFECT PARA CARGAR LOS PEDIDOS CUANDO CAMBIAN searchStatus O currentPage
    useEffect(() => {
        fetchOrders();
    }, [searchStatus, currentPage]);

    // FUNCIÓN PARA OBTENER TODOS LOS PEDIDOS O FILTRADOS POR ESTADO
    const fetchOrders = async () => {
        try {
            let response;
            if (searchStatus) {
                // SI HAY UN ESTADO DE BÚSQUEDA, FILTRA POR ESE ESTADO
                response = await ApiService.getAllOrderItemsByStatus(searchStatus);
            } else {
                // SI NO, OBTIENE TODOS LOS PEDIDOS
                response = await ApiService.getAllOrders();
            }
            const orderList = response.orderItemList || []; // OBTIENE LA LISTA DE PEDIDOS
            setTotalPages(Math.ceil(orderList.length / itemsPerPage)); // CALCULA EL TOTAL DE PÁGINAS
            setOrders(orderList); // GUARDA TODOS LOS PEDIDOS
            setFilteredOrders(orderList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)); // FILTRA LOS PEDIDOS PARA LA PÁGINA ACTUAL
        } catch (error) {
            // MANEJA LOS ERRORES
            setError(error.response?.data?.message || error.message || 'It is not possible to load the orders.');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    // FUNCIÓN PARA FILTRAR LOS PEDIDOS POR ESTADO
    const handleFilterChange = (e) => {
        const filterValue = e.target.value; // OBTIENE EL VALOR DEL FILTRO
        setStatusFilter(filterValue); // ACTUALIZA EL FILTRO
        setCurrentPage(1); // REINICIA LA PÁGINA ACTUAL
        if (filterValue) {
            // SI HAY UN FILTRO, FILTRA LOS PEDIDOS
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage)); // ACTUALIZA LOS PEDIDOS FILTRADOS
            setTotalPages(Math.ceil(filtered.length / itemsPerPage)); // CALCULA EL TOTAL DE PÁGINAS
        } else {
            // SI NO HAY FILTRO, MUESTRA TODOS LOS PEDIDOS
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    };

    // FUNCIÓN PARA ACTUALIZAR EL ESTADO DE BÚSQUEDA
    const handleSearchStatusChange = async (e) => {
        setSearchStatus(e.target.value); // ACTUALIZA EL ESTADO DE BÚSQUEDA
        setCurrentPage(1); // REINICIA LA PÁGINA ACTUAL
    };

    // FUNCIÓN PARA VER LOS DETALLES DE UN PEDIDO
    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`); // REDIRIGE A LA PÁGINA DE DETALLES
    };

    // RENDERIZA LA PÁGINA
    return (
        <div className="admin-orders-page">
            <h2>Orders</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="filter-container">
                <div className="statusFilter">
                    <label htmlFor="statusFilter">Filter by Status </label>
                    {/* SELECT PARA FILTRAR POR ESTADO */}
                    <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
                        <option value="">ALL</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TABLA DE PEDIDOS */}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Issue Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user.name}</td>
                            <td>{order.status}</td>
                            <td>€{order.price.toFixed(2)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleOrderDetails(order.id)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* COMPONENTE DE PAGINACIÓN */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminOrderPage;