import React from "react";
import { useNavigate } from "react-router-dom";
import '../../style/adminPage.css'


const AdminPage=()=>{
    const navigate=useNavigate();

    return(
        <div className="admin-page">
            <h1>Bienvenido Admin</h1>
            <button onClick={()=>navigate("/admin/categories")}>Gestionar Categorias</button>
            <button onClick={()=>navigate("/admin/products")}>Gestionar Productos</button>
            <button onClick={()=>navigate("/admin/orders")}>Gestionar Pedidos</button>
        
        </div>
    )
}

export default AdminPage;