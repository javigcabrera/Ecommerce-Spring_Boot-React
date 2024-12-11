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
            setError(error.response?.data?.message||error.message||"It is not possible to load the user information.");
        }
    };

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]:value
        }))
    }

    const handSubmit = async (e) => {
        e.preventDefault();
    
        // Hacer .trim() a todos los valores del objeto 'address'
        const trimmedAddress = {
            street: address.street.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            zipCode: address.zipCode.trim(),
            country: address.country.trim()
        };
    
        // Validar que los campos no estén vacíos ni contengan solo espacios
        for (const key in trimmedAddress) {
            if (trimmedAddress[key] === "") {
                setError(`${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty or only spaces.`);
                return;
            }
        }
    
        // Validar que zipCode solo contenga números y tenga exactamente 5 caracteres
        if (!/^\d+$/.test(trimmedAddress.zipCode)) {
            setError("Zip code must be a valid number.");
            return;
        }
    
        if (trimmedAddress.zipCode.length !== 5) {
            setError("Zip code must be exactly 5 digits.");
            return;
        }
    
        try {
            // Usar 'trimmedAddress' para guardar los datos
            await ApiService.saveAndUpdateAddress(trimmedAddress);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || error.message || "The address could not be registered.");
        }
    };
    
    

    return(
        <div className="address-page">
            <h2>{location.pathname==="/edit-address"?"Edit Address":"Add Address"}</h2>
            {error&&<p className="error-message">{error}</p>}

            <form onSubmit={handSubmit}>
                <label>
                    Street: 
                    <input 
                        type="text" 
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    City: 
                    <input 
                        type="text" 
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    State: 
                    <input 
                        type="text" 
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Zip Code:
                    <input 
                        type="text" 
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <label>
                    Country:
                    <input 
                        type="text" 
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        required                          
                    />
                </label>
                <button type="submit">{location.pathname==="/edit-address"?"Edit Address":"Add Address"}</button>
            </form>
        </div>
    )

}

export default AddressPage;