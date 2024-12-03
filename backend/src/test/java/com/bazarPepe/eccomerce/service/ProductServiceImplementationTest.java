package com.bazarPepe.eccomerce.service;

import com.bazarPepe.eccomerce.dto.ProductDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Category;
import com.bazarPepe.eccomerce.entity.Product;
import com.bazarPepe.eccomerce.exception.InvalidCredentialsException;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.CategoryRepository;
import com.bazarPepe.eccomerce.repository.ProductRepository;
import com.bazarPepe.eccomerce.service.implementation.ProductServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceImplementationTest {

    @InjectMocks
    private ProductServiceImplementation productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    @Mock
    private MultipartFile mockMultipartFile;

    private Product mockProduct;
    private Category mockCategory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Test Product");
        mockProduct.setDescription("Test Description");
        mockProduct.setPrice(BigDecimal.valueOf(100.00));

        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Test Category");
    }

    @Test
    void testCreateProduct_Success() throws Exception {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(mockMultipartFile.getBytes()).thenReturn(new byte[]{1, 2, 3});
        when(mockMultipartFile.getContentType()).thenReturn("image/png");

        Response response = productService.createProduct(1L, mockMultipartFile, "New Product", "Description", BigDecimal.valueOf(200.00));

        verify(productRepository, times(1)).save(any(Product.class));
        assertEquals(200, response.getStatus());
        assertEquals("Product created successfully.", response.getMessage());
    }

    @Test
    void testCreateProduct_CategoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                productService.createProduct(1L, mockMultipartFile, "New Product", "Description", BigDecimal.valueOf(200.00))
        );
        assertEquals("That category does not exist.", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_ImageIsNull() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));

        InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () ->
                productService.createProduct(1L, null, "New Product", "Description", BigDecimal.valueOf(200.00))
        );
        assertEquals("Image is required.", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_InvalidImageFormat() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(mockMultipartFile.getContentType()).thenReturn("application/pdf");

        InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () ->
                productService.createProduct(1L, mockMultipartFile, "New Product", "Description", BigDecimal.valueOf(200.00))
        );
        assertEquals("The provided file is not a valid image.", exception.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_FullUpdate() throws Exception {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(mockMultipartFile.getBytes()).thenReturn(new byte[]{1, 2, 3});
        when(mockMultipartFile.getContentType()).thenReturn("image/png");

        Response response = productService.updateProduct(1L, 1L, mockMultipartFile, "Updated Product", "Updated Description", BigDecimal.valueOf(150.00));

        verify(productRepository, times(1)).save(mockProduct);
        assertEquals("Updated Product", mockProduct.getName());
        assertEquals("Updated Description", mockProduct.getDescription());
        assertEquals(BigDecimal.valueOf(150.00), mockProduct.getPrice());
        assertEquals(mockCategory, mockProduct.getCategory());
        assertEquals(200, response.getStatus());
        assertEquals("Product updated successfully.", response.getMessage());
    }

    @Test
    void testUpdateProduct_PartialUpdate() throws Exception {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        Response response = productService.updateProduct(1L, null, null, "Partially Updated Product", null, null);

        verify(productRepository, times(1)).save(mockProduct);
        assertEquals("Partially Updated Product", mockProduct.getName());
        assertEquals("Test Description", mockProduct.getDescription());
        assertEquals(BigDecimal.valueOf(100.00), mockProduct.getPrice());
        assertEquals(200, response.getStatus());
        assertEquals("Product updated successfully.", response.getMessage());
    }

    @Test
    void testDeleteProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        Response response = productService.deleteProduct(1L);

        verify(productRepository, times(1)).delete(mockProduct);
        assertEquals(200, response.getStatus());
        assertEquals("The product has been deleted successfully.", response.getMessage());
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                productService.deleteProduct(1L)
        );
        assertEquals("The product was not found.", exception.getMessage());
    }

    @Test
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        when(entityDtoMapper.mapProductToDtoBasic(mockProduct)).thenReturn(productDto);

        Response response = productService.getProductById(1L);

        assertEquals(200, response.getStatus());
        assertEquals(productDto, response.getProduct());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                productService.getProductById(1L)
        );
        assertEquals("The product was not found.", exception.getMessage());
    }

    @Test
    void testGetAllProducts() {
        when(productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))).thenReturn(List.of(mockProduct));
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        when(entityDtoMapper.mapProductToDtoBasic(mockProduct)).thenReturn(productDto);

        Response response = productService.getAllProduct();

        assertEquals(200, response.getStatus());
        assertEquals(1, response.getProductList().size());
    }

    @Test
    void testSearchProduct() {
        when(productRepository.findByNameContainingOrDescriptionContaining("Test", "Test")).thenReturn(List.of(mockProduct));
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        when(entityDtoMapper.mapProductToDtoBasic(mockProduct)).thenReturn(productDto);

        Response response = productService.searchProduct("Test");

        assertEquals(200, response.getStatus());
        assertEquals(1, response.getProductList().size());
    }

    @Test
    void testSearchProduct_NotFound() {
        when(productRepository.findByNameContainingOrDescriptionContaining("Nonexistent", "Nonexistent")).thenReturn(List.of());

        NotFoundException exception = assertThrows(NotFoundException.class, () ->
                productService.searchProduct("Nonexistent")
        );
        assertEquals("No products were found.", exception.getMessage());
    }
}
