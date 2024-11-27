import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

//COMPONENTE NAVBAR PARA LA BARRA DE NAVEGACION
const Navbar=()=>{

    //ESTADO LOCAL PARA EL VALOR DEL CAMPO DE BUSQUEDA
    const [searchValue,setSearchValue]=useState("");
    //HOOK PARA LA NAVEGACION ENTRE RUTAS
    const navigate=useNavigate();

    //VERIFICAMOS SI EL USUARIO ES ADMIN
    const isAdmin=ApiService.isAdmin();
    //VERIFICAMOS SI EL USUARIO ESTA AUTENTIFICADO
    const isAuthenticated=ApiService.isAuthenticated();

    //MANEJA EL CAMBIO DE TEXTO EN EL CAMPO DE BUSQUEDA
    const handleSearchChange=(e)=>{
        setSearchValue(e.target.value)
    }

    //MANEJA EL ENVIO DEL FORMULARIO
    const handleSearchSubmit=async(e)=>{
        e.preventDefault();//EVITA QUE EL REFRESCO DE LA PAGINA
        navigate(`/?search=${searchValue}`) //NAVEGA A LA RUTA CON EL VALOR DE LA BUSQUEDA
    }

    //MANEJA EL CIERRE DE SESION DEL USUARIO
    const handleLogout=()=>{
        const confirm=window.confirm("Estas seguro de que quieres cerrar sesion?");
        if(confirm){
            ApiService.logout();
            setTimeout(()=>{
                navigate('/login')
            },500);
        }
    }

    // Limpia la barra de búsqueda al hacer clic en el logo
    const handleHomeClick = () => {
        setSearchValue(""); // Limpia la barra de búsqueda
        navigate("/");      // Navega al Home
    };

    //ESTRUCTURA BARRA DE NAVEGACION
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                 {/* LOGO QUE REDIRIGE A LA PÁGINA PRINCIPAL */}
                 <img 
                    src="/logo_horizontal.png" 
                    alt="Bazar Pepe" 
                    onClick={handleHomeClick} 
                    style={{ cursor: "pointer" }} // Asegura que el cursor muestre que es clicable
                />
            </div>
            {/* FORMULARIO DE BÚSQUEDA */}
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input type="text" 
                       placeholder="Busca productos" 
                       value={searchValue} 
                       onChange={handleSearchChange}
                />
                <button type="submit">Search</button>
            </form>

            {/* LINKS DE NAVEGACIÓN */}
            <div className="navbar-link">
                <NavLink to="/" onClick={handleHomeClick}>Home</NavLink>
                <NavLink to="/categories">Categorias</NavLink>
                { isAuthenticated && <NavLink to="/profile">Mi Perfil</NavLink>}
                { isAdmin && <NavLink to="/admin">Admin</NavLink>}
                { !isAuthenticated && <NavLink to="/login">Login</NavLink>}
                { isAuthenticated && <NavLink onClick={handleLogout}>Logout</NavLink>}
                <NavLink to="/cart">Carrito</NavLink>
            </div>


        </nav>
    );
};

export default Navbar;