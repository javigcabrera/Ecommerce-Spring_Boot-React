package com.bazarPepe.eccomerce.service;

import com.bazarPepe.eccomerce.dto.CategoryDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Category;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.CategoryRepository;
import com.bazarPepe.eccomerce.service.implementation.CategoryServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceImplementationTest {

    @InjectMocks
    private CategoryServiceImplementation categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    private Category mockCategory;
    private CategoryDto mockCategoryDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configurar objetos simulados
        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Electronics");

        mockCategoryDto = new CategoryDto();
        mockCategoryDto.setName("Electronics");
    }

    @Test
    void testCreateCategory() {
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        // Ejecutar método
        Response response = categoryService.createCategory(mockCategoryDto);

        // Verificar interacciones
        verify(categoryRepository, times(1)).save(any(Category.class));

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Category created successfully.", response.getMessage());
    }

    @Test
    void testUpdateCategory_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);

        // Crear DTO actualizado
        CategoryDto updatedCategoryDto = new CategoryDto();
        updatedCategoryDto.setName("Updated Electronics");

        // Ejecutar método
        Response response = categoryService.updateCategory(1L, updatedCategoryDto);

        // Verificar interacciones
        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).save(mockCategory);

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Successfully updated.", response.getMessage());
        assertEquals("Updated Electronics", mockCategory.getName());
    }

    @Test
    void testUpdateCategory_NotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Crear DTO
        CategoryDto updatedCategoryDto = new CategoryDto();
        updatedCategoryDto.setName("Updated Electronics");

        // Ejecutar método y verificar excepción
        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                categoryService.updateCategory(1L, updatedCategoryDto));

        assertEquals("No se ha encontrado esa categoria", exception.getMessage());
        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void testGetAllCategories() {
        List<Category> categories = new ArrayList<>();
        categories.add(mockCategory);
        when(categoryRepository.findAll()).thenReturn(categories);

        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName("Electronics");
        when(entityDtoMapper.mapCategoryToDtoBasic(mockCategory)).thenReturn(categoryDto);

        // Ejecutar método
        Response response = categoryService.getAllCategories();

        // Verificar interacciones
        verify(categoryRepository, times(1)).findAll();
        verify(entityDtoMapper, times(1)).mapCategoryToDtoBasic(mockCategory);

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertNotNull(response.getCategoryList());
        assertEquals(1, response.getCategoryList().size());
        assertEquals("Electronics", response.getCategoryList().get(0).getName());
    }

    @Test
    void testGetCategoryById_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(entityDtoMapper.mapCategoryToDtoBasic(mockCategory)).thenReturn(mockCategoryDto);

        // Ejecutar método
        Response response = categoryService.getCategoryById(1L);

        // Verificar interacciones
        verify(categoryRepository, times(1)).findById(1L);
        verify(entityDtoMapper, times(1)).mapCategoryToDtoBasic(mockCategory);

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertNotNull(response.getCategory());
        assertEquals("Electronics", response.getCategory().getName());
    }

    @Test
    void testGetCategoryById_NotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Ejecutar método y verificar excepción
        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                categoryService.getCategoryById(1L));

        assertEquals("No se ha encontrado la categoria", exception.getMessage());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void testDeleteCategory_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        doNothing().when(categoryRepository).delete(mockCategory);

        // Ejecutar método
        Response response = categoryService.deleteCategory(1L);

        // Verificar interacciones
        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).delete(mockCategory);

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("The category has been successfully deleted.", response.getMessage());
    }

    @Test
    void testDeleteCategory_NotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Ejecutar método y verificar excepción
        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                categoryService.deleteCategory(1L));

        assertEquals("No se ha encontrado esa categoria", exception.getMessage());
        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, never()).delete(any(Category.class));
    }
}
