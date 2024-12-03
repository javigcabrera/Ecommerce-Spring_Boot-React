import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/categoryListPage.css";

const CategoryListPage=()=>{
    
    const[categories,setCategories]=useState([]);
    const[error,setError]=useState(null);
    const navigate=useNavigate();

    useEffect(()=>{
        fetchCategories();
    },[]);


    const fetchCategories=async()=>{
        setError(null);  // Resetear error al hacer una nueva búsqueda
        setCategories([]); // Limpiar categorias para evitar visualización incorrecta
        try{
            const response=await ApiService.getAllCategory();
            setCategories(response.categoryList||[])
        }catch(error){
            setError(error.response?.data?.message||error.message||'Categories cannot be retrieved.')
        }
    }

    const handleCategoryClick=(categoryId)=>{
        navigate(`/category/${categoryId}`);
    }

    return (
        <div className="category-container">
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="category-content">
                    <h2>Categories</h2>
                    <ul className="category-grid">
                        {categories.map((category) => (
                            <li key={category.id} className="category-item">
                                <button onClick={() => handleCategoryClick(category.id)}>
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

}

export default CategoryListPage;