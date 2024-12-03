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
            setMessage('The status of the product in the order has been successfully updated.'); // MUESTRA MENSAJE DE ÉXITO
            setTimeout(() => {
                setMessage(''); // LIMPIA EL MENSAJE DESPUÉS DE 3 SEGUNDOS
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'It was not possible to update the status.'); // MUESTRA MENSAJE DE ERROR
        }
    };

    // RENDERIZA LOS DETALLES DEL PEDIDO
    return (
        <div className="order-details-page">
            {/* MENSAJES INFORMATIVOS */}
            {message && <div className="message">{message}</div>}
            <h2>Order Details</h2>
            {orderItems.length ? (
                // RENDERIZA CADA ITEM DEL PEDIDO
                orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="order-item-details">
                        {/* INFORMACIÓN DEL PEDIDO */}
                        <div className="info">
                            <h3>Order Information</h3>
                            <p><strong>Order Product ID:</strong>{orderItem.id}</p>
                            <p><strong>Quantity:</strong>{orderItem.quantity}</p>
                            <p><strong>Total Price:</strong>{orderItem.price}</p>
                            <p><strong>Order Status:</strong>{orderItem.status}</p>
                            <p><strong>Order Date:</strong>{new Date(orderItem.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* INFORMACIÓN DEL COMPRADOR */}
                        <div className="info">
                            <h3>Buyer Information</h3>
                            <p><strong>Name:</strong>{orderItem.user.name}</p>
                            <p><strong>Email:</strong>{orderItem.user.email}</p>
                            <p><strong>Phone Number:</strong>{orderItem.user.phoneNumber}</p>
                            <p><strong>Rol:</strong>{orderItem.user.role}</p>

                            {/* DIRECCIÓN ENVIO DEL COMPRADOR */}
                            <div className="info">
                                <h3>Shipping Address</h3>
                                <p><strong>Country:</strong>{orderItem.user.address?.country}</p>
                                <p><strong>State:</strong>{orderItem.user.address?.state}</p>
                                <p><strong>City:</strong>{orderItem.user.address?.city}</p>
                                <p><strong>Street:</strong>{orderItem.user.address?.street}</p>
                                <p><strong>Zip Code:</strong>{orderItem.user.address?.zipcode}</p>
                            </div>
                        </div>

                        {/* INFORMACIÓN DEL PRODUCTO */}
                        <div>
                            <h2>Product Information</h2>
                            <img
                                src={`data:${orderItem.product.imageType || "image/jpeg"};base64,${orderItem.product.image}`}
                                alt={orderItem.product.name}
                                style={{ width: '150px', height: '150px' }}
                            />
                            <p><strong>Name:</strong>{orderItem.product.name}</p>
                            <p><strong>Description:</strong>{orderItem.product.description}</p>
                            <p><strong>Price:</strong>{orderItem.product.price}</p>
                        </div>

                        {/* CAMBIO DE ESTADO DEL PEDIDO */}
                        <div className="status-change">
                            <h4>Change Status</h4>
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
                                Update Status
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading order details...</p> // MENSAJE MIENTRAS SE CARGAN LOS DETALLES
            )}
        </div>
    );
};

export default AdminOrderDetails;