package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.OrderRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import com.bazarPepe.eccomerce.service.interfaces.OrderItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class OrderItemControllerTest {

    @Mock
    private OrderItemService orderItemService;

    @InjectMocks
    private OrderItemController orderItemController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPlaceOrder() {
        // Preparar datos de entrada y salida simulados
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setTotalPrice(null); // Puedes personalizar los datos según sea necesario

        Response mockResponse = Response.builder()
                .status(201)
                .message("Order placed successfully")
                .build();

        // Configurar comportamiento del mock
        when(orderItemService.placeOrder(any(OrderRequest.class))).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = orderItemController.placeOrder(orderRequest);

        // Verificar resultados
        assertEquals(201, responseEntity.getBody().getStatus());
        assertEquals("Order placed successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testUpdateOrderItemStatus() {
        // Preparar datos de entrada y salida simulados
        Long orderItemId = 1L;
        String status = "DELIVERED";

        Response mockResponse = Response.builder()
                .status(200)
                .message("Order item status updated successfully")
                .build();

        // Configurar comportamiento del mock
        when(orderItemService.updateOrderItemStatus(anyLong(), anyString())).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = orderItemController.updateOrderItemStatus(orderItemId, status);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Order item status updated successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testFilterOrderItems() {
        // Preparar datos de entrada y salida simulados
        LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(2023, 12, 31, 23, 59);
        String status = "PENDING";
        Long itemId = 1L;
        int page = 0;
        int size = 10;
        Pageable pageable = PageRequest.of(page, size);

        Response mockResponse = Response.builder()
                .status(200)
                .message("Order items filtered successfully")
                .build();

        // Configurar comportamiento del mock
        when(orderItemService.filterOrderItems(
                any(OrderStatus.class),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                anyLong(),
                any(Pageable.class)
        )).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = orderItemController.filterOrderItems(
                startDate, endDate, status, itemId, page, size
        );

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Order items filtered successfully", responseEntity.getBody().getMessage());
    }
}
