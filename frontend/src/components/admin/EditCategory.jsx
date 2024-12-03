import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import { useNavigate, useParams } from "react-router-dom"; // HOOKS PARA NAVEGACIÓN Y OBTENER PARÁMETROS DE LA URL
import '../../style/addCategory.css'; // ESTILOS PARA LA PÁGINA DE EDITAR CATEGORÍA

const EditCategory = () => {
    // OBTIENE EL ID DE LA CATEGORÍA DESDE LOS PARÁMETROS DE LA URL
    const { categoryId } = useParams();
    // ESTADO PARA ALMACENAR EL NOMBRE DE LA CATEGORÍA
    const [name, setName] = useState('');
    // ESTADO PARA MOSTRAR MENSAJES AL USUARIO
    const [message, setMessage] = useState('');
    // HOOK PARA NAVEGAR ENTRE RUTAS
    const navigate = useNavigate();

    // useEffect PARA CARGAR LOS DETALLES DE LA CATEGORÍA AL MONTAR EL COMPONENTE O CAMBIAR categoryId
    useEffect(() => {
        fetchCategory(categoryId); // LLAMA A LA FUNCIÓN PARA OBTENER LOS DETALLES DE LA CATEGORÍA
    }, [categoryId]);

    // FUNCIÓN PARA OBTENER LOS DETALLES DE LA CATEGORÍA DESDE LA API
    const fetchCategory = async () => {
        try {
            const response = await ApiService.getCategoryById(categoryId); // OBTIENE LA CATEGORÍA POR ID
            setName(response.category.name); // ESTABLECE EL NOMBRE DE LA CATEGORÍA EN EL ESTADO
        } catch (error) {
            // MUESTRA UN MENSAJE DE ERROR SI FALLA LA PETICIÓN
            setMessage(error.response?.data?.message || error.message || "Error loading the category.");
            setTimeout(() => {
                setMessage(''); // LIMPIA EL MENSAJE DE ERROR DESPUÉS DE 3 SEGUNDOS
            }, 3000);
        }
    };

    // FUNCIÓN PARA ACTUALIZAR LA CATEGORÍA CUANDO SE ENVÍA EL FORMULARIO
    const handleSubmit = async (e) => {
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            const response = await ApiService.updateCategory(categoryId, { name }); // ENVÍA LA ACTUALIZACIÓN A LA API
            if (response.status === 200) { // SI LA ACTUALIZACIÓN FUE EXITOSA
                setMessage(response.message); // MUESTRA EL MENSAJE DE ÉXITO
                setTimeout(() => {
                    setMessage(''); // LIMPIA EL MENSAJE DE ÉXITO
                    navigate("/admin/categories"); // REDIRIGE A LA LISTA DE CATEGORÍAS
                }, 3000);
            }
        } catch (error) {
            // MUESTRA UN MENSAJE DE ERROR SI FALLA LA ACTUALIZACIÓN
            setMessage(error.response?.data?.message || error.message || "Error updating the category.");
        }
    };

    // RENDERIZA EL FORMULARIO PARA EDITAR UNA CATEGORÍA
    return (
        <div className="add-category-page">
            {/* MUESTRA MENSAJES SI EXISTEN */}
            {message && <p className="message">{message}</p>}
            {/* FORMULARIO PARA EDITAR LA CATEGORÍA */}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Edit Category</h2>
                {/* CAMPO DE TEXTO PARA EDITAR EL NOMBRE DE LA CATEGORÍA */}
                <input 
                    type="text"
                    placeholder="Category Name"
                    value={name} // ESTADO name
                    onChange={(e) => setName(e.target.value)} // ACTUALIZA EL ESTADO CUANDO EL USUARIO ESCRIBE
                />
                {/* BOTÓN PARA ENVIAR EL FORMULARIO */}
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditCategory;