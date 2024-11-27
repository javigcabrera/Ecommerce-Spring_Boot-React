package com.bazarPepe.eccomerce.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResponseTest {

    @Test
    void testResponseBuilder() {
        AddressDto addressDto = new AddressDto();
        UserDto userDto = new UserDto();
        CategoryDto categoryDto = new CategoryDto();
        ProductDto productDto = new ProductDto();
        OrderItemDto orderItemDto = new OrderItemDto();
        OrderDto orderDto = new OrderDto();

        // Usando el builder
        Response response = Response.builder()
                .status(200)
                .message("Success")
                .token("sample-token")
                .role("USER")
                .expirationTime("6 months")
                .totalPage(5)
                .totalElement(100)
                .address(addressDto)
                .user(userDto)
                .userList(List.of(userDto))
                .category(categoryDto)
                .categoryList(List.of(categoryDto))
                .product(productDto)
                .productList(List.of(productDto))
                .orderItem(orderItemDto)
                .orderItemList(List.of(orderItemDto))
                .order(orderDto)
                .orderList(List.of(orderDto))
                .build();

        // Verificaciones explícitas de cada atributo
        assertEquals(200, response.getStatus());
        assertEquals("Success", response.getMessage());
        assertEquals("sample-token", response.getToken());
        assertEquals("USER", response.getRole());
        assertEquals("6 months", response.getExpirationTime());
        assertEquals(5, response.getTotalPage());
        assertEquals(100, response.getTotalElement());
        assertEquals(addressDto, response.getAddress());
        assertEquals(userDto, response.getUser());
        assertEquals(List.of(userDto), response.getUserList());
        assertEquals(categoryDto, response.getCategory());
        assertEquals(List.of(categoryDto), response.getCategoryList());
        assertEquals(productDto, response.getProduct());
        assertEquals(List.of(productDto), response.getProductList());
        assertEquals(orderItemDto, response.getOrderItem());
        assertEquals(List.of(orderItemDto), response.getOrderItemList());
        assertEquals(orderDto, response.getOrder());
        assertEquals(List.of(orderDto), response.getOrderList());
        assertNotNull(response.getTimestamp());
    }

    @Test
    void testResponseConstructorAndDefaultValues() {
        // Prueba de los valores predeterminados y el constructor
        Response response = Response.builder()
                .status(404)
                .message("Not Found")
                .build();

        assertEquals(404, response.getStatus());
        assertEquals("Not Found", response.getMessage());
        assertNotNull(response.getTimestamp());
        assertNull(response.getToken());
        assertNull(response.getRole());
        assertNull(response.getExpirationTime());
        assertEquals(0, response.getTotalPage());
        assertEquals(0, response.getTotalElement());
        assertNull(response.getAddress());
        assertNull(response.getUser());
        assertNull(response.getUserList());
        assertNull(response.getCategory());
        assertNull(response.getCategoryList());
        assertNull(response.getProduct());
        assertNull(response.getProductList());
        assertNull(response.getOrderItem());
        assertNull(response.getOrderItemList());
        assertNull(response.getOrder());
        assertNull(response.getOrderList());
    }

    @Test
    void testResponseTimestampIsImmutable() {
        // Asegura que el timestamp no cambia
        Response response = Response.builder()
                .status(200)
                .message("Immutable Test")
                .build();

        LocalDateTime timestamp = response.getTimestamp();
        assertNotNull(timestamp);

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        assertEquals(timestamp, response.getTimestamp());
    }
}
