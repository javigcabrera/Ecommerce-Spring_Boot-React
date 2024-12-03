import React from "react";
import { Link } from "react-router-dom";
import {useCart} from '../context/CartContext';
import '../../style/productList.css';

//COMPONENTE PARA RENDERIZAR LA LISTA DE PRODUCTOS
const ProductList=({products})=>{
    //OBTENEMOS EL CARRITO LA FUNCION DISPATCH DEL CONTEXTO DEL CARRITO
    const {cart,dispatch}=useCart();

    //AGREGAMOS UN PRODUCTO AL CARRITO
    const addToCart=(product)=>{
        dispatch({type:'ADD_ITEM',payload:product});
    }
    //INCREMENTAMOS LA CANTIDAD DE UN PRODUCTO EN EL CARRITO
    const incrementItem=(product)=>{
        dispatch({type:'INCREMENT_ITEM',payload:product})
    }
    //SE DECREMENTA LA CANTIDAD O LA ELIMINA SI LA CANTIDAD ES 1
    const decrementItem=(product)=>{
        const cartItem=cart.find(item=>item.id===product.id);
        if(cartItem&&cartItem.quantity>1){
            dispatch({type:'DECREMENT_ITEM',payload:product})
        }else{
            dispatch({type:'REMOVE_ITEM',payload:product})
        }
    }

    return(
        <div className="product-list">
            {products.map((product,index)=>{
                //ENCUENTRA SI EL PRODUCTO ESTA EN EL CARRITO
                const cartItem=cart.find(item=>item.id===product.id);

                // Construir la URL Base64
                const imageUrl = `data:image/jpeg;base64,${product.image}`;

                return (
                    <div className="product-item" key={index}>
                        {/* ENLACE AL DETALLE DEL PRODUCTO */}
                        <Link to={`/product/${product.id}`}>
                            <img src={imageUrl} alt="{product.name}" className="product-image" />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <span>{product.price.toFixed(2)}€</span>
                        </Link>
                         {/* BOTONES DE CONTROL DE CANTIDAD Y AGREGAR AL CARRITO */}
                        {cartItem?(
                            <div className="quantity-controls">
                                <button onClick={()=> decrementItem(product)}> - </button>
                                <span>{cartItem.quantity}</span>
                                <button onClick={()=> incrementItem(product)}> + </button>
                            </div>
                        ):(
                            <button onClick={()=>addToCart(product)}>Add to cart</button>
                        )}
                    </div>
                )
            })}
        </div>
    )
};

export default ProductList;