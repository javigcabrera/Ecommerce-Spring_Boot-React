import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService"; // SERVICIO PARA HACER PETICIONES A LA API
import { useNavigate } from "react-router-dom"; // HOOK PARA NAVEGACIÓN ENTRE RUTAS
import '../../style/adminCategory.css'; // ESTILOS PARA LA PÁGINA DE ADMINISTRACIÓN DE CATEGORÍAS

const AdminCategoryPage = () => {
    // ESTADO PARA ALMACENAR LAS CATEGORÍAS
    const [categories, setCategories] = useState([]);
    // HOOK PARA NAVEGACIÓN ENTRE PÁGINAS
    const navigate = useNavigate();

    // useEffect PARA CARGAR LAS CATEGORÍAS CUANDO EL COMPONENTE SE MONTA
    useEffect(() => {
        fetchCategories(); // LLAMA A LA FUNCIÓN PARA OBTENER LAS CATEGORÍAS
    }, []);

    // FUNCIÓN PARA OBTENER TODAS LAS CATEGORÍAS DESDE LA API
    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory(); // LLAMA AL MÉTODO PARA OBTENER CATEGORÍAS
            setCategories(response.categoryList || []); // GUARDA LAS CATEGORÍAS EN EL ESTADO
        } catch (error) {
            // GESTIONA LOS ERRORES SI FALLA LA PETICIÓN
            console.log("An error occurred while loading the list of categories", error);
        }
    };

    // FUNCIÓN PARA REDIRIGIR A LA PÁGINA DE EDICIÓN DE UNA CATEGORÍA
    const handleEdit = async (id) => {
        navigate(`/admin/edit-category/${id}`); // NAVEGA A LA RUTA DE EDICIÓN CON EL ID DE LA CATEGORÍA
    };

    // FUNCIÓN PARA ELIMINAR UNA CATEGORÍA
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?"); // CONFIRMA LA ACCIÓN
        if (confirmed) {
            try {
                await ApiService.deleteCategory(id); // LLAMA AL MÉTODO PARA ELIMINAR LA CATEGORÍA
                fetchCategories(); // ACTUALIZA LA LISTA DE CATEGORÍAS
            } catch (error) {
                // GESTIONA LOS ERRORES SI FALLA LA ELIMINACIÓN
                console.log("An error occurred while deleting the category.");
            }
        }
    };

    // RENDERIZA LA PÁGINA DE ADMINISTRACIÓN DE CATEGORÍAS
    return (
        <div className="admin-category-page">
            <div className="admin-category-list">
                <h2>Categories</h2>
                {/* BOTÓN PARA AÑADIR UNA NUEVA CATEGORÍA */}
                <button onClick={() => navigate('/admin/add-category')}>Add Category</button>
                {/* LISTA DE CATEGORÍAS */}
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <span>{category.name}</span>
                            <div className="admin-bt">
                                {/* BOTÓN PARA EDITAR UNA CATEGORÍA */}
                                <button className="admin-btn-edit" onClick={() => handleEdit(category.id)}>Edit</button>
                                {/* BOTÓN PARA BORRAR UNA CATEGORÍA */}
                                <button onClick={() => handleDelete(category.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminCategoryPage;