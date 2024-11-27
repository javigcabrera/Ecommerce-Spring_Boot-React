package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.CategoryDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.service.interfaces.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateCategory() {
        // Datos simulados
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName("Electronics");

        Response mockResponse = Response.builder()
                .status(201)
                .message("Category created successfully")
                .build();

        // Configurar mock
        when(categoryService.createCategory(any(CategoryDto.class))).thenReturn(mockResponse);

        // Ejecutar método
        ResponseEntity<Response> responseEntity = categoryController.createCategory(categoryDto);

        // Verificar resultados
        assertEquals(201, responseEntity.getBody().getStatus());
        assertEquals("Category created successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetAllCategories() {
        // Datos simulados
        CategoryDto category1 = new CategoryDto();
        category1.setName("Electronics");
        CategoryDto category2 = new CategoryDto();
        category2.setName("Books");

        List<CategoryDto> categories = Arrays.asList(category1, category2);

        Response mockResponse = Response.builder()
                .status(200)
                .message("Categories retrieved successfully")
                .categoryList(categories)
                .build();

        // Configurar mock
        when(categoryService.getAllCategories()).thenReturn(mockResponse);

        // Ejecutar método
        ResponseEntity<Response> responseEntity = categoryController.getAllCategories();

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals(2, responseEntity.getBody().getCategoryList().size());
    }

    @Test
    void testUpdateCategory() {
        // Datos simulados
        Long categoryId = 1L;
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName("Updated Electronics");

        Response mockResponse = Response.builder()
                .status(200)
                .message("Category updated successfully")
                .build();

        // Configurar mock
        when(categoryService.updateCategory(anyLong(), any(CategoryDto.class))).thenReturn(mockResponse);

        // Ejecutar método
        ResponseEntity<Response> responseEntity = categoryController.updateCategory(categoryId, categoryDto);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Category updated successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testDeleteCategory() {
        // Datos simulados
        Long categoryId = 1L;

        Response mockResponse = Response.builder()
                .status(200)
                .message("Category deleted successfully")
                .build();

        // Configurar mock
        when(categoryService.deleteCategory(anyLong())).thenReturn(mockResponse);

        // Ejecutar método
        ResponseEntity<Response> responseEntity = categoryController.deleteCategory(categoryId);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Category deleted successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetCategoryById() {
        // Datos simulados
        Long categoryId = 1L;
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName("Electronics");

        Response mockResponse = Response.builder()
                .status(200)
                .message("Category retrieved successfully")
                .category(categoryDto)
                .build();

        // Configurar mock
        when(categoryService.getCategoryById(anyLong())).thenReturn(mockResponse);

        // Ejecutar método
        ResponseEntity<Response> responseEntity = categoryController.getCategoryById(categoryId);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Category retrieved successfully", responseEntity.getBody().getMessage());
        assertEquals("Electronics", responseEntity.getBody().getCategory().getName());
    }
}
