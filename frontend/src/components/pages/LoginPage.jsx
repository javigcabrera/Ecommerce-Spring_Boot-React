import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA REALIZAR PETICIONES A LA API
import '../../style/login.css'; // ESTILOS PARA LA PÁGINA DE LOGIN

const LoginPage = () => {
    // ESTADO PARA GESTIONAR LOS DATOS DEL FORMULARIO
    const [formData, setFormData] = useState({
        email: '',        // CAMPO PARA EL EMAIL
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
        e.preventDefault(); // PREVIENE EL REFRESCO AUTOMÁTICO DE LA PÁGINA
        try {
            // ENVÍA LOS DATOS DEL FORMULARIO A LA API PARA INICIAR SESIÓN
            const response = await ApiService.loginUser(formData);
            if (response.status === 200) {
                setMessage("You have logged in successfully.");
                
                // GUARDA EL TOKEN Y EL ROL DEL USUARIO EN LOCALSTORAGE
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                
                // REDIRIGE A LA PÁGINA DE PERFIL DESPUÉS DE 4 SEGUNDOS
                setTimeout(() => {
                    navigate("/profile");
                }, 4000);
            }
        } catch (error) {
            // SI HAY UN ERROR, MUESTRA EL MENSAJE AL USUARIO
            setMessage(error.response?.data.message || error.message || "Login failed.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-image">
                    <img 
                        src="/logo.png" 
                        alt="Ecommerce" 
                    />
                </div>
                <div className="login-form">
                    <h2>Log In</h2>
                    {message && <p className="login-message">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Access</button>
                        <p className="login-register-link">
                        Don't have an account? <a href="/register">Sign up here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
