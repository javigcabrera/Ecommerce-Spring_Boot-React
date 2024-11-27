package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.exception.InvalidCredentialsException;
import com.bazarPepe.eccomerce.service.interfaces.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct() {
        // Preparar datos de entrada y salida simulados
        Long categoryId = 1L;
        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", "image/jpeg", "test image".getBytes());
        String name = "Product Name";
        String description = "Product Description";
        BigDecimal price = BigDecimal.valueOf(100);

        Response mockResponse = Response.builder()
                .status(201)
                .message("Product created successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.createProduct(anyLong(), any(), any(), any(), any())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.createProduct(categoryId, image, name, description, price);

        // Verificar resultados
        assertEquals(201, responseEntity.getBody().getStatus());
        assertEquals("Product created successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testCreateProductWithInvalidData() {
        // Datos inválidos
        Long categoryId = null;
        MockMultipartFile image = new MockMultipartFile("image", "image.jpg", "image/jpeg", new byte[0]);
        String name = "";
        String description = "";
        BigDecimal price = null;

        // Ejecutar y verificar excepción
        assertThrows(InvalidCredentialsException.class, () ->
                productController.createProduct(categoryId, image, name, description, price));
    }

    @Test
    void testUpdateProduct() {
        // Preparar datos de entrada y salida simulados
        Long productId = 1L;
        Long categoryId = 2L;
        MockMultipartFile image = new MockMultipartFile("image", "updated.jpg", "image/jpeg", "updated image".getBytes());
        String name = "Updated Name";
        String description = "Updated Description";
        BigDecimal price = BigDecimal.valueOf(200);

        Response mockResponse = Response.builder()
                .status(200)
                .message("Product updated successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.updateProduct(anyLong(), anyLong(), any(), any(), any(), any())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.updateProduct(productId, categoryId, image, name, description, price);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Product updated successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testDeleteProduct() {
        // Preparar datos simulados
        Long productId = 1L;

        Response mockResponse = Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.deleteProduct(anyLong())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.deleteProduct(productId);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Product deleted successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetProductById() {
        // Preparar datos simulados
        Long productId = 1L;

        Response mockResponse = Response.builder()
                .status(200)
                .message("Product retrieved successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.getProductById(anyLong())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.getProductById(productId);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Product retrieved successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetAllProduct() {
        // Preparar datos simulados
        Response mockResponse = Response.builder()
                .status(200)
                .message("All products retrieved successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.getAllProduct()).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.getAllProduct();

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("All products retrieved successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetProductsByCategory() {
        // Preparar datos simulados
        Long categoryId = 1L;

        Response mockResponse = Response.builder()
                .status(200)
                .message("Products retrieved by category successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.getProductsByCategory(anyLong())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.getProductsByCategory(categoryId);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Products retrieved by category successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testSearchForProduct() {
        // Preparar datos simulados
        String searchValue = "Laptop";

        Response mockResponse = Response.builder()
                .status(200)
                .message("Products found successfully")
                .build();

        // Configurar comportamiento del mock
        when(productService.searchProduct(any())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = productController.searchForProduct(searchValue);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Products found successfully", responseEntity.getBody().getMessage());
    }
}
