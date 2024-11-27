import React, { useState,useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import ApiService from "../../service/ApiService"; // SERVICIO PARA REALIZAR PETICIONES A LA API
import '../../style/address.css'; // ESTILOS PARA LA PÁGINA DE MI PERFIL

const AddressPage=()=>{
    const [address,setAddress]=useState({
        street:'',
        city:'',
        state:'',
        zipCode:'',
        country:''
    });

    const [error,setError]=useState(null);
    const navigate=useNavigate();
    const location=useLocation();

    useEffect(()=>{
        if(location.pathname==="/edit-address"){
            fetchUserInfo();
        }
        
    },[location.pathname]);

    const fetchUserInfo=async()=>{
        try {
            const response=await ApiService.getLoggedInUserInfo();
            if(response.user.address){
                setAddress(response.user.address);
            }
        } catch (error) {
            setError(error.response?.data?.message||error.message||"No es posible cargar la informacion del usuario");
        }
    };

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]:value
        }))
    }

    const handSubmit=async(e)=>{
        e.preventDefault();
        try {
            await ApiService.saveAndUpdateAddress(address);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message||error.message||"No se ha podido registrar la direccion");
        }
    }

    return(
        <div className="address-page">
            <h2>{location.pathname==="/edit-address"?"Editar Direccion":"Añadir direccion"}</h2>
            {error&&<p className="error-message">{error}</p>}

            <form onSubmit={handSubmit}>
                <label>
                    Calle: 
                    <input 
                        type="text" 
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Ciudad: 
                    <input 
                        type="text" 
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Provincia: 
                    <input 
                        type="text" 
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Codigo Postal:
                    <input 
                        type="text" 
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Pais:
                    <input 
                        type="text" 
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <button type="submit">{location.pathname==="/edit-address"?"Editar Direccion":"Añadir direccion"}</button>
            </form>
        </div>
    )

}

export default AddressPage;