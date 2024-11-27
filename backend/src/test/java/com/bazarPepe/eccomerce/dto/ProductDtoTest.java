package com.bazarPepe.eccomerce.dto;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class ProductDtoTest {

    @Test
    void testNoArgsConstructor() {
        ProductDto productDto = new ProductDto();

        assertNull(productDto.getId());
        assertNull(productDto.getName());
        assertNull(productDto.getDescription());
        assertNull(productDto.getPrice());
        assertNull(productDto.getImage());
        assertNull(productDto.getCategory());
    }

    @Test
    void testAllArgsConstructor() {
        CategoryDto categoryDto = new CategoryDto();
        ProductDto productDto = new ProductDto(1L, "Product Name", "Description", BigDecimal.valueOf(100), "ImageData", categoryDto);

        assertEquals(1L, productDto.getId());
        assertEquals("Product Name", productDto.getName());
        assertEquals("Description", productDto.getDescription());
        assertEquals(BigDecimal.valueOf(100), productDto.getPrice());
        assertEquals("ImageData", productDto.getImage());
        assertEquals(categoryDto, productDto.getCategory());
    }

    @Test
    void testConstructorWithImageBytes() {
        byte[] imageBytes = "TestImage".getBytes();
        ProductDto productDto = new ProductDto(1L, "Product Name", "Description", BigDecimal.valueOf(100), imageBytes);

        assertEquals(1L, productDto.getId());
        assertEquals("Product Name", productDto.getName());
        assertEquals("Description", productDto.getDescription());
        assertEquals(BigDecimal.valueOf(100), productDto.getPrice());
        assertEquals(Base64.getEncoder().encodeToString(imageBytes), productDto.getImage());
        assertNull(productDto.getCategory());
    }

    @Test
    void testSettersAndGetters() {
        byte[] imageBytes = "TestImage".getBytes();
        CategoryDto categoryDto = new CategoryDto();

        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setName("Product Name");
        productDto.setDescription("Description");
        productDto.setPrice(BigDecimal.valueOf(100));
        productDto.setImage(Base64.getEncoder().encodeToString(imageBytes));
        productDto.setCategory(categoryDto);

        assertEquals(1L, productDto.getId());
        assertEquals("Product Name", productDto.getName());
        assertEquals("Description", productDto.getDescription());
        assertEquals(BigDecimal.valueOf(100), productDto.getPrice());
        assertEquals(Base64.getEncoder().encodeToString(imageBytes), productDto.getImage());
        assertEquals(categoryDto, productDto.getCategory());
    }

    @Test
    void testSetNullValues() {
        ProductDto productDto = new ProductDto();

        productDto.setId(null);
        productDto.setName(null);
        productDto.setDescription(null);
        productDto.setPrice(null);
        productDto.setImage(null);
        productDto.setCategory(null);

        assertNull(productDto.getId());
        assertNull(productDto.getName());
        assertNull(productDto.getDescription());
        assertNull(productDto.getPrice());
        assertNull(productDto.getImage());
        assertNull(productDto.getCategory());
    }

    @Test
    void testImageEncodingWithNull() {
        ProductDto productDto = new ProductDto(1L, "Product Name", "Description", BigDecimal.valueOf(100), (byte[]) null);

        assertNull(productDto.getImage());
    }

    @Test
    void testToString() {
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setName("Test Product");

        String toStringResult = productDto.toString();
        assertTrue(toStringResult.contains("id=1"));
        assertTrue(toStringResult.contains("name=Test Product"));
    }

    @Test
    void testEqualsAndHashCode() {
        ProductDto product1 = new ProductDto(1L, "Product", "Description", BigDecimal.valueOf(100), (byte[]) null);
        ProductDto product2 = new ProductDto(1L, "Product", "Description", BigDecimal.valueOf(100), (byte[]) null);

        assertEquals(product1, product2);
        assertEquals(product1.hashCode(), product2.hashCode());
    }

    @Test
    void testNotEquals() {
        ProductDto product1 = new ProductDto(1L, "Product", "Description", BigDecimal.valueOf(100), (byte[]) null);
        ProductDto product2 = new ProductDto(2L, "Other Product", "Other Description", BigDecimal.valueOf(200), (byte[]) null);

        assertNotEquals(product1, product2);
    }
}
