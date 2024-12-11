import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA REALIZAR PETICIONES A LA API
import '../../style/register.css'; // ESTILOS PARA LA PÁGINA DE REGISTRO

const RegisterPage = () => {

    // ESTADO PARA GESTIONAR LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        email: '',        // CAMPO PARA EL EMAIL
        name: '',         // CAMPO PARA EL NOMBRE
        phoneNumber: '',  // CAMPO PARA EL NÚMERO DE TELÉFONO
        password: ''      // CAMPO PARA LA CONTRASEÑA
    });

    // ESTADO PARA MOSTRAR MENSAJES AL USUARIO
    const [message, setMessage] = useState(null);

    // HOOK PARA NAVEGAR ENTRE PÁGINAS
    const navigate = useNavigate();


    // ACTUALIZA LOS DATOS DEL FORMULARIO CUANDO EL USUARIO ESCRIBE EN LOS CAMPOS
    const handleChange = (e) => {
        const { name, value } = e.target; // OBTIENE EL NOMBRE Y VALOR DEL CAMPO
        setFormData({ ...formData, [name]: value }); // ACTUALIZA EL ESTADO formData
    };

    // ENVÍA EL FORMULARIO AL SERVIDOR CUANDO SE HACE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        // Aplicar .trim() a todos los campos del formulario
        const trimmedFormData = {
            email: formData.email.trim(),
            name: formData.name.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password.trim(),
        };

        // Validar que los campos no estén vacíos
        for (const key in trimmedFormData) {
            if (trimmedFormData[key] === "") {
                setMessage(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty or only spaces.`);
                return;
            }
        }

        // Validar que el campo phoneNumber solo contenga números
        if (!/^\d+$/.test(trimmedFormData.phoneNumber)) {
            setMessage("Phone number must only contain numbers.");
            return;
        }

        // Validar que el phoneNumber tenga exactamente 9 dígitos
        if (trimmedFormData.phoneNumber.length !== 9) {
            setMessage("Phone number must be exactly 9 digits.");
            return;
        }

        try {
            // Enviar los datos procesados al servidor
            const response = await ApiService.registerUser(trimmedFormData);
            if (response.status === 200) {
                setMessage("User registered successfully.");
                // Redirigir al login después de 4 segundos
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
        } catch (error) {
            // Manejo de errores del servidor
            const errorMessage = error.response?.data.message || error.message || "No se ha podido registrar al usuario";

            // Personalizar mensaje si el error es de duplicado
            if (errorMessage.includes("Duplicate entry")) {
                setMessage("The email already exists, please try another one.");
            } else {
                setMessage(errorMessage);
            }
        }
    };



    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-form">
                    <h2>Sign Up</h2>
                    {message && <p className="message">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            id="phoneNumber"
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Sign Up</button>
                        <p className="register-link">
                            Do you already have an account? <a href="/login">Login</a>
                        </p>
                    </form>
                </div>
                <div className="register-image">
                    <img
                        src="/logo.png"
                        alt="Ecommerce"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
