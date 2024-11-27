import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";


export const ProtectedRoute=({element:Component})=>{
    //SE OBTIENE LA UBICACION DEL USUARIO
    const location=useLocation();

    //SE VERIFICA SE ESTA AUTENTIFICADO
    return ApiService.isAuthenticated()?(
        //SI LO ESTA RENDERIZA EL COMPONENTE
        Component
    ):(
        //SI NO LO ESTA SE REDIRIGE AL LOGIN Y SE GUARDA SU UBICACION PARA REDIRECCIONAR DESPUES DEL LOGIN
        <Navigate to="/login" replace state={{from: location}}></Navigate>
    );
};

export const AdminRoute=({element:Component})=>{
    //SE OBTIENE LA UBICACION DEL USUARIO
    const location=useLocation();

    //SE VERIFICA SI ES ADMIN
    return ApiService.isAdmin()?(
        //SI LO ESTA RENDERIZA EL COMPONENTE
        Component
    ):(
        //SI NO SE CUMPLE SE REDIRIGE AL LOGIN Y SE GUARDA SU UBICACION PARA REDIRECCIONAR DESPUES DEL LOGIN
        <Navigate to="/login" replace state={{from: location}}></Navigate>
    );
};