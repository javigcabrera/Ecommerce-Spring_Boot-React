import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // PARA NAVEGAR ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA INTERACTUAR CON LA API
import { useCart } from '../context/CartContext'; // HOOK PARA EL CONTEXTO DEL CARRITO
import '../../style/cart.css'; // ESTILOS DEL CARRITO

const CartPage = () => {
    // OBTENEMOS EL ESTADO DEL CARRITO Y LA FUNCIÓN dispatch DEL CONTEXTO
    const { cart, dispatch } = useCart();
    // ESTADO PARA MOSTRAR MENSAJES AL USUARIO
    const [message, setMessage] = useState(null);
    // HOOK PARA NAVEGAR ENTRE RUTAS
    const navigate = useNavigate();

    // INCREMENTA LA CANTIDAD DE UN PRODUCTO EN EL CARRITO
    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    };

    // DECREMENTA LA CANTIDAD DE UN PRODUCTO O LO ELIMINA SI SU CANTIDAD ES 1
    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    };

    // CALCULA EL PRECIO TOTAL DEL CARRITO
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // MANEJA EL PROCESO DE CHECKOUT
    const handleCheckout = async () => {
        // VERIFICA SI EL USUARIO ESTÁ AUTENTICADO
        if (!ApiService.isAuthenticated()) {
            // SI NO ESTÁ AUTENTICADO, MUESTRA UN MENSAJE Y REDIRIGE A LOGIN
            setMessage("You need to log in before placing the order.");
            setTimeout(() => {
                setMessage('');
                navigate("/login");
            }, 3000);
            return;
        }

        // PREPARA LOS DATOS DEL PEDIDO
        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems
        };

        try {
            // INTENTA CREAR EL PEDIDO A TRAVÉS DE LA API
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message);

            // SI EL PEDIDO ES EXITOSO, LIMPIA EL CARRITO
            setTimeout(() => {
                setMessage('');
            }, 3000);

            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' });
            }
        } catch (error) {
            // SI HAY UN ERROR, MUESTRA EL MENSAJE DE ERROR
            setMessage(error.response?.data?.message || error.message || 'An error occurred with the order.');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    // RENDERIZA LA PÁGINA DEL CARRITO
    return (
        <div className="cart-page">
            <h1>Cart</h1>
            {/* MUESTRA MENSAJES DE ERROR O INFORMACIÓN */}
            {message && <p className="response-message">{message}</p>}

            {/* SI EL CARRITO ESTÁ VACÍO, MUESTRA UN MENSAJE */}
            {cart.length === 0 ? (
                <p>The cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {/* RENDERIZA CADA PRODUCTO EN EL CARRITO */}
                        {cart.map(item => (
                            <li key={item.id}>
                                {/* IMAGEN DEL PRODUCTO */}
                                <img
                                    src={`data:${item.imageType || "image/jpeg"};base64,${item.image}`}
                                    alt={item.name}
                                />
                                <div>
                                    {/* NOMBRE, DESCRIPCIÓN Y CONTROLES DE CANTIDAD */}
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => decrementItem(item)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => incrementItem(item)}>+</button>
                                    </div>
                                    <span>{item.price.toFixed()}€</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* MUESTRA EL TOTAL Y BOTÓN DE CHECKOUT */}
                    <h2>Total: {totalPrice.toFixed(2)}€</h2>
                    <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;