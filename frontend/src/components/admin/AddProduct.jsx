import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import '../../style/addProduct.css'; // ESTILOS PARA LA PÁGINA DE AÑADIR PRODUCTO
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API

const AddProduct = () => {
    // ESTADOS PARA ALMACENAR LOS DATOS DEL PRODUCTO
    const [image, setImage] = useState(null); // IMAGEN DEL PRODUCTO
    const [categories, setCategories] = useState([]); // LISTA DE CATEGORÍAS DISPONIBLES
    const [categoryId, setCategoryId] = useState(''); // CATEGORÍA SELECCIONADA
    const [name, setName] = useState(''); // NOMBRE DEL PRODUCTO
    const [description, setDescription] = useState(''); // DESCRIPCIÓN DEL PRODUCTO
    const [message, setMessage] = useState(''); // MENSAJE PARA EL USUARIO
    const [price, setPrice] = useState(''); // PRECIO DEL PRODUCTO

    const navigate = useNavigate(); // HOOK PARA REDIRECCIONAR A OTRAS PÁGINAS

    // useEffect PARA CARGAR LAS CATEGORÍAS DISPONIBLES CUANDO SE MONTA EL COMPONENTE
    useEffect(() => {
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList)); // OBTIENE LA LISTA DE CATEGORÍAS
    }, []);

    // FUNCIÓN PARA MANEJAR EL CAMBIO DE LA IMAGEN
    const handleImage = (e) => {
        setImage(e.target.files[0]); // GUARDA EL ARCHIVO SELECCIONADO EN EL ESTADO
    };

    // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
    const handleSubmit = async (e) => {
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            // CREA UN OBJETO FormData PARA ENVIAR LOS DATOS DEL FORMULARIO
            const formData = new FormData();
            formData.append('image', image); // AGREGA LA IMAGEN
            formData.append('categoryId', categoryId); // AGREGA EL ID DE LA CATEGORÍA
            formData.append('name', name); // AGREGA EL NOMBRE DEL PRODUCTO
            formData.append('description', description); // AGREGA LA DESCRIPCIÓN
            formData.append('price', price); // AGREGA EL PRECIO

            // ENVÍA EL FORMULARIO A LA API PARA AÑADIR EL PRODUCTO
            const response = await ApiService.addProduct(formData);
            if (response.status === 200) { // SI LA RESPUESTA ES EXITOSA
                setMessage(response.message); // MUESTRA EL MENSAJE DE ÉXITO
                setTimeout(() => {
                    setMessage(''); // LIMPIA EL MENSAJE
                    navigate('/admin/products'); // REDIRIGE A LA LISTA DE PRODUCTOS
                }, 3000);
            }
        } catch (error) {
            // MANEJA LOS ERRORES SI LA PETICIÓN FALLA
            setMessage(error.response?.data?.message || error.message || 'The product could not be added.');
        }
    };

    // RENDERIZA EL FORMULARIO PARA AÑADIR UN PRODUCTO
    return (
        <div>
            <form onSubmit={handleSubmit} className="product-form">
                <h2>Add Product</h2>
                {/* MUESTRA MENSAJES SI EXISTEN */}
                {message && <div className="message">{message}</div>}
                
                {/* CAMPO PARA SUBIR UNA IMAGEN */}
                <input type="file" onChange={handleImage} />
                
                {/* SELECT PARA ELEGIR UNA CATEGORÍA */}
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select the category</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                </select>
                
                {/* CAMPO PARA EL NOMBRE DEL PRODUCTO */}
                <input 
                    type="text" 
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                />
                
                {/* CAMPO PARA LA DESCRIPCIÓN DEL PRODUCTO */}
                <textarea 
                    placeholder="Product Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                />
                
                {/* CAMPO PARA EL PRECIO DEL PRODUCTO */}
                <input 
                    type="number" 
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} 
                />
                
                {/* BOTÓN PARA ENVIAR EL FORMULARIO */}
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddProduct;