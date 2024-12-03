import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // HOOKS PARA NAVEGACIÓN Y OBTENER PARÁMETROS DE LA URL
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import '../../style/addProduct.css'; // ESTILOS PARA LA PÁGINA DE EDITAR PRODUCTOS

const EditProduct = () => {
    const { productId } = useParams(); // OBTIENE EL ID DEL PRODUCTO DESDE LA URL
    const [image, setImage] = useState(null); // ARCHIVO DE IMAGEN SELECCIONADO
    const [categories, setCategories] = useState([]); // LISTA DE CATEGORÍAS DISPONIBLES
    const [categoryId, setCategoryId] = useState(''); // ID DE LA CATEGORÍA SELECCIONADA
    const [name, setName] = useState(''); // NOMBRE DEL PRODUCTO
    const [description, setDescription] = useState(''); // DESCRIPCIÓN DEL PRODUCTO
    const [message, setMessage] = useState(''); // MENSAJE PARA EL USUARIO
    const [price, setPrice] = useState(''); // PRECIO DEL PRODUCTO
    const [imageUrl, setImageUrl] = useState(null); // URL PARA MOSTRAR LA IMAGEN EXISTENTE
    const navigate = useNavigate(); // HOOK PARA NAVEGAR ENTRE RUTAS

    useEffect(() => {
        // OBTIENE LA LISTA DE CATEGORÍAS DISPONIBLES
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));

        if (productId) {
            // OBTIENE LOS DETALLES DEL PRODUCTO SI EXISTE UN ID
            ApiService.getProductById(productId).then((response) => {
                const { name, description, price, categoryId, image } = response.product;
                setName(name); // ESTABLECE EL NOMBRE DEL PRODUCTO
                setDescription(description); // ESTABLECE LA DESCRIPCIÓN
                setPrice(price); // ESTABLECE EL PRECIO
                setCategoryId(categoryId); // ESTABLECE EL ID DE LA CATEGORÍA

                // GENERA UNA URL PARA MOSTRAR LA IMAGEN EXISTENTE
                if (image) {
                    setImageUrl(`data:image/jpeg;base64,${image}`);
                }
            });
        }
    }, [productId]);

    // ACTUALIZA EL ESTADO DE LA IMAGEN CUANDO EL USUARIO SELECCIONA UN ARCHIVO
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // ESTABLECE EL ARCHIVO EN EL ESTADO
        setImageUrl(URL.createObjectURL(e.target.files[0])); // CREA UNA URL TEMPORAL PARA MOSTRAR LA IMAGEN
    };

    // FUNCIÓN PARA ENVIAR EL FORMULARIO DE ACTUALIZACIÓN
    const handleSubmit = async (e) => {
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            const formData = new FormData(); // CREA UN OBJETO FormData PARA ENVIAR DATOS
            if (image) {
                formData.append('image', image); // AÑADE LA IMAGEN SI EXISTE
            }
            formData.append('categoryId', categoryId); // AÑADE EL ID DE LA CATEGORÍA
            formData.append('name', name); // AÑADE EL NOMBRE DEL PRODUCTO
            formData.append('description', description); // AÑADE LA DESCRIPCIÓN
            formData.append('price', price); // AÑADE EL PRECIO

            // LLAMA A LA API PARA ACTUALIZAR EL PRODUCTO
            const response = await ApiService.updateProduct(productId, formData);

            if (response) {
                setMessage('Product updated successfully.'); // MUESTRA MENSAJE DE ÉXITO
                setTimeout(() => {
                    setMessage(''); // LIMPIA EL MENSAJE
                    navigate('/admin/products'); // REDIRIGE A LA LISTA DE PRODUCTOS
                }, 3000);
            }
        } catch (error) {
            // MUESTRA UN MENSAJE DE ERROR SI FALLA LA ACTUALIZACIÓN
            setMessage(
                error.response?.data?.message || error.message || 'The product could not be updated.'
            );
        }
    };

    // RENDERIZA EL FORMULARIO PARA EDITAR EL PRODUCTO
    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2>Edit Product</h2>
            {/* MUESTRA MENSAJES SI EXISTEN */}
            {message && <div className="message">{message}</div>}

            {/* CAMPO PARA SELECCIONAR UNA IMAGEN */}
            <input type="file" onChange={handleImageChange} />
            {/* MUESTRA LA IMAGEN EXISTENTE O LA SELECCIONADA */}
            {imageUrl && <img src={imageUrl} alt={name} style={{ width: '150px', height: '150px' }} />}

            {/* SELECT PARA ELEGIR UNA CATEGORÍA */}
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((category) => (
                    <option value={category.id} key={category.id}>{category.name}</option>
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
                placeholder="Description"
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
            <button type="submit">Update</button>
        </form>
    );
};

export default EditProduct;