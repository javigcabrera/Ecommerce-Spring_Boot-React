package com.bazarPepe.eccomerce.service.interfaces;

import com.bazarPepe.eccomerce.dto.CategoryDto;
import com.bazarPepe.eccomerce.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDto categoryRequest);

    Response updateCategory(Long categoryId, CategoryDto categoryRequest);

    Response getAllCategories();

    Response getCategoryById(Long categoryId);

    Response deleteCategory(Long categoryId);

}
