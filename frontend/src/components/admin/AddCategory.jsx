import React, { useState} from "react";
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import '../../style/addCategory.css'; // ESTILOS PARA LA PÁGINA DE AÑADIR CATEGORÍAS

const AddCategory = () => {
    // ESTADO PARA ALMACENAR EL NOMBRE DE LA CATEGORÍA
    const [name, setName] = useState('');
    // ESTADO PARA MOSTRAR MENSAJES AL USUARIO
    const [message, setMessage] = useState(null);
    // HOOK PARA NAVEGAR ENTRE RUTAS
    const navigate = useNavigate();

    // FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
    const handleSubmit = async (e) => {
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            // ENVÍA UNA SOLICITUD A LA API PARA CREAR UNA NUEVA CATEGORÍA
            const response = await ApiService.createCategory({ name });
            if (response.status === 200) { // SI LA RESPUESTA ES EXITOSA
                setMessage(response.message); // MUESTRA EL MENSAJE DE ÉXITO
                setTimeout(() => {
                    setMessage('Se ha añadido correctamente la categoría'); // MENSAJE DE CONFIRMACIÓN
                    navigate("/admin/categories"); // REDIRIGE A LA LISTA DE CATEGORÍAS
                }, 2000);
            }
        } catch (error) {
            // MANEJA LOS ERRORES SI LA SOLICITUD FALLA
            setMessage(error.response?.data?.message || error.message || 'No se ha podido añadir la categoría');
        }
    };

    // RENDERIZA LA PÁGINA PARA AÑADIR UNA NUEVA CATEGORÍA
    return (
        <div className="add-category-page">
            {/* MUESTRA MENSAJES SI EXISTEN */}
            {message && <p className="message">{message}</p>}
            {/* FORMULARIO PARA AÑADIR UNA NUEVA CATEGORÍA */}
            <form onSubmit={handleSubmit} className="category-form">
                <h2>Añadir Categoría</h2>
                {/* CAMPO DE TEXTO PARA EL NOMBRE DE LA CATEGORÍA */}
                <input 
                    type="text"
                    placeholder="Nombre Categoría"
                    value={name} // ESTADO name
                    onChange={(e) => setName(e.target.value)} // ACTUALIZA EL ESTADO CUANDO EL USUARIO ESCRIBE
                />
                {/* BOTÓN PARA ENVIAR EL FORMULARIO */}
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default AddCategory;