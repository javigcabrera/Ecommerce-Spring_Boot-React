import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA PETICIONES A LA API
import '../../style/profile.css'; // ESTILOS PARA LA PÁGINA DE PERFIL
import Pagination from "../common/Pagination"; // COMPONENTE DE PAGINACIÓN

const ProfilePage = () => {
    // ESTADO PARA ALMACENAR LA INFORMACIÓN DEL USUARIO
    const [userInfo, setUserInfo] = useState(null);
    
    // ESTADO PARA MANEJAR MENSAJES DE ERROR
    const [error, setError] = useState(null);
    
    // ESTADO PARA RASTREAR LA PÁGINA ACTUAL EN EL HISTORIAL DE PEDIDOS
    const [currentPage, setCurrentPage] = useState(1);
    
    // NÚMERO DE PEDIDOS QUE SE MOSTRARÁN POR PÁGINA
    const itemsPerPage = 3;

    // HOOK PARA NAVEGACIÓN ENTRE PÁGINAS
    const navigate = useNavigate();

    // useEffect SE EJECUTA UNA VEZ AL MONTAR EL COMPONENTE PARA CARGAR LOS DATOS DEL USUARIO
    useEffect(() => {
        fetchUserInfo(); // LLAMA A LA FUNCIÓN PARA CARGAR LA INFORMACIÓN DEL USUARIO
    }, []);

    // FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO DESDE LA API
    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user); // GUARDA LOS DATOS DEL USUARIO EN EL ESTADO
        } catch (error) {
            // MANEJA LOS ERRORES DE LA PETICIÓN
            setError(error.response?.data?.message || error.message || 'No es posible cargar los datos del usuario');
        }
    };

    // SI LOS DATOS DEL USUARIO AÚN NO SE HAN CARGADO, MUESTRA UN MENSAJE DE "CARGANDO"
    if (!userInfo) {
        return (
            <div data-testid="loading-message">Loading....</div>
        );
    }

    // FUNCIÓN PARA MANEJAR EL BOTÓN DE EDITAR/AÑADIR DIRECCIÓN
    const handleAddressClick = () => {
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    };

    // LISTA DE PEDIDOS DEL USUARIO (SI NO HAY, SERÁ UN ARREGLO VACÍO)
    const orderItemList = userInfo.orderItemList || [];

    // CALCULA EL NÚMERO TOTAL DE PÁGINAS PARA LA PAGINACIÓN
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);

    // OBTIENE LOS PEDIDOS DE LA PÁGINA ACTUAL
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // RENDERIZA LA INFORMACIÓN DEL USUARIO
    return (
        <div className="profile-page" data-testid="profile-page">
            <h2 data-testid="welcome-message">Bienvenido {userInfo.name}</h2>

            {/* SI HAY UN ERROR, LO MUESTRA */}
            {error ? (
                <p className="error-message" data-testid="error-message">{error}</p>
            ) : (
                <div>
                    {/* INFORMACIÓN BÁSICA DEL USUARIO */}
                    <p data-testid="user-name"><strong>Nombre: </strong>{userInfo.name}</p>
                    <p data-testid="user-email"><strong>Email: </strong>{userInfo.email}</p>
                    <p data-testid="user-phone"><strong>Número Teléfono: </strong>{userInfo.phoneNumber}</p>
                
                    {/* INFORMACIÓN DE DIRECCIÓN */}
                    <div data-testid="address-info">
                        <h3>Dirección</h3>
                        {userInfo.address ? (
                            <div>
                                <p data-testid="user-street"><strong>Calle: </strong>{userInfo.address.street}</p>
                                <p data-testid="user-city"><strong>Ciudad: </strong>{userInfo.address.city}</p>
                                <p data-testid="user-state"><strong>Provincia: </strong>{userInfo.address.state}</p>
                                <p data-testid="user-zipcode"><strong>Código Postal: </strong>{userInfo.address.zipCode}</p>
                                <p data-testid="user-country"><strong>País: </strong>{userInfo.address.country}</p>
                            </div>
                        ) : (
                            <p>No hay información de dirección disponible</p>
                        )}
                        <button className="profile-button" onClick={handleAddressClick} data-testid="address-button">
                            {userInfo.address ? "Editar dirección" : "Añadir dirección"}
                        </button>
                    </div>

                    {/* HISTORIAL DE PEDIDOS */}
                    <h3>Historial de pedidos</h3>
                    <ul data-testid="order-list">
                        {paginatedOrders.map(order => (
                            <li key={order.id} data-testid={`order-item-${order.id}`}>
                                {/* IMAGEN DEL PRODUCTO */}
                                <img 
                                    src={`data:${order.product?.imageType || "image/jpeg"};base64,${order.product?.image}`}
                                    alt={order.product?.name} 
                                    data-testid={`order-product-image-${order.id}`}
                                />
                                <div>
                                    {/* DETALLES DEL PRODUCTO EN EL PEDIDO */}
                                    <p data-testid={`order-product-name-${order.id}`}><strong>Nombre: </strong>{order.product.name}</p>
                                    <p data-testid={`order-status-${order.id}`}><strong>Estado: </strong>{order.status}</p>
                                    <p data-testid={`order-quantity-${order.id}`}><strong>Cantidad: </strong>{order.quantity}</p>
                                    <p data-testid={`order-price-${order.id}`}><strong>Precio: </strong>€{order.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    {/* PAGINACIÓN */}
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

export default ProfilePage;
