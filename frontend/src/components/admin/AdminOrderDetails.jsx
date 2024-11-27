import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // HOOK PARA OBTENER PARÁMETROS DE LA URL
import '../../style/adminOrderDetails.css'; // ESTILOS PARA LA PÁGINA DE DETALLES DE PEDIDOS
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API

// LISTA DE ESTADOS DISPONIBLES PARA LOS PEDIDOS
const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetails = () => {
    const { itemId } = useParams(); // OBTIENE EL ID DEL ITEM DESDE LA URL
    const [orderItems, setOrderItems] = useState([]); // ESTADO PARA ALMACENAR LOS ITEMS DEL PEDIDO
    const [message, setMessage] = useState(''); // ESTADO PARA MENSAJES INFORMATIVOS
    const [selectedStatus, setSelectedStatus] = useState({}); // ESTADO PARA CONTROLAR LOS CAMBIOS EN EL ESTADO DEL PEDIDO

    // CARGA LOS DETALLES DEL PEDIDO CUANDO SE MONTA EL COMPONENTE
    useEffect(() => {
        fetchOrderDetails(itemId); // LLAMA A LA FUNCIÓN PARA OBTENER LOS DETALLES
    }, [itemId]);

    // FUNCIÓN PARA OBTENER LOS DETALLES DEL PEDIDO DESDE LA API
    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId); // LLAMA A LA API PARA OBTENER LOS DETALLES DEL PEDIDO
            setOrderItems(response.orderItemList); // ESTABLECE LOS DETALLES EN EL ESTADO
        } catch (error) {
            console.log(error.message || error); // MUESTRA ERRORES EN LA CONSOLA
        }
    };

    // ACTUALIZA EL ESTADO SELECCIONADO DEL PEDIDO
    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus }); // ACTUALIZA EL ESTADO EN EL OBJETO selectedStatus
    };

    // ENVÍA LA ACTUALIZACIÓN DEL ESTADO A LA API
    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderItemStatus(orderItemId, selectedStatus[orderItemId]); // ENVÍA LA ACTUALIZACIÓN A LA API
            setMessage('El estado del producto del pedido se ha actualizado correctamente'); // MUESTRA MENSAJE DE ÉXITO
            setTimeout(() => {
                setMessage(''); // LIMPIA EL MENSAJE DESPUÉS DE 3 SEGUNDOS
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'No ha sido posible actualizar el estado'); // MUESTRA MENSAJE DE ERROR
        }
    };

    // RENDERIZA LOS DETALLES DEL PEDIDO
    return (
        <div className="order-details-page">
            {/* MENSAJES INFORMATIVOS */}
            {message && <div className="message">{message}</div>}
            <h2>Detalles del Pedido</h2>
            {orderItems.length ? (
                // RENDERIZA CADA ITEM DEL PEDIDO
                orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="order-item-details">
                        {/* INFORMACIÓN DEL PEDIDO */}
                        <div className="info">
                            <h3>Información del Pedido</h3>
                            <p><strong>ID Producto Pedido:</strong>{orderItem.id}</p>
                            <p><strong>Cantidad:</strong>{orderItem.quantity}</p>
                            <p><strong>Precio Total:</strong>{orderItem.price}</p>
                            <p><strong>Estado Pedido:</strong>{orderItem.status}</p>
                            <p><strong>Fecha Pedido:</strong>{new Date(orderItem.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* INFORMACIÓN DEL COMPRADOR */}
                        <div className="info">
                            <h3>Información del Comprador</h3>
                            <p><strong>Nombre:</strong>{orderItem.user.name}</p>
                            <p><strong>Email:</strong>{orderItem.user.email}</p>
                            <p><strong>Teléfono:</strong>{orderItem.user.phoneNumber}</p>
                            <p><strong>Rol:</strong>{orderItem.user.role}</p>

                            {/* DIRECCIÓN DEL COMPRADOR */}
                            <div className="info">
                                <h3>Dirección de envío</h3>
                                <p><strong>País:</strong>{orderItem.user.address?.country}</p>
                                <p><strong>Provincia:</strong>{orderItem.user.address?.state}</p>
                                <p><strong>Ciudad:</strong>{orderItem.user.address?.city}</p>
                                <p><strong>Calle:</strong>{orderItem.user.address?.street}</p>
                                <p><strong>Código Postal:</strong>{orderItem.user.address?.zipcode}</p>
                            </div>
                        </div>

                        {/* INFORMACIÓN DEL PRODUCTO */}
                        <div>
                            <h2>Información del Producto</h2>
                            <img
                                src={`data:${orderItem.product.imageType || "image/jpeg"};base64,${orderItem.product.image}`}
                                alt={orderItem.product.name}
                                style={{ width: '150px', height: '150px' }}
                            />
                            <p><strong>Nombre:</strong>{orderItem.product.name}</p>
                            <p><strong>Descripción:</strong>{orderItem.product.description}</p>
                            <p><strong>Precio:</strong>{orderItem.product.price}</p>
                        </div>

                        {/* CAMBIO DE ESTADO DEL PEDIDO */}
                        <div className="status-change">
                            <h4>Cambiar Estado</h4>
                            <select
                                className="status-option"
                                value={selectedStatus[orderItem.id] || orderItem.status}
                                onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}>
                                {/* OPCIONES DE ESTADO */}
                                {OrderStatus.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button
                                className="update-status-button"
                                onClick={() => handleSubmitStatusChange(orderItem.id)}>
                                Actualizar Estado
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Cargando detalles del pedido...</p> // MENSAJE MIENTRAS SE CARGAN LOS DETALLES
            )}
        </div>
    );
};

export default AdminOrderDetails;