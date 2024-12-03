package com.bazarPepe.eccomerce.service;

import com.bazarPepe.eccomerce.dto.*;
import com.bazarPepe.eccomerce.entity.Order;
import com.bazarPepe.eccomerce.entity.OrderItem;
import com.bazarPepe.eccomerce.entity.Product;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.OrderItemRepository;
import com.bazarPepe.eccomerce.repository.OrderRepository;
import com.bazarPepe.eccomerce.repository.ProductRepository;
import com.bazarPepe.eccomerce.service.implementation.OrderItemServiceImplementation;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import com.bazarPepe.eccomerce.specification.OrderItemSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class OrderItemServiceImplementationTest {

    @InjectMocks
    private OrderItemServiceImplementation orderItemService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserService userService;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    private User mockUser;
    private Product mockProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configuración de usuario y producto simulados
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");

        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Test Product");
        mockProduct.setPrice(BigDecimal.valueOf(100.00));
    }

    @Test
    void testPlaceOrder_Success() {
        // Configuración del usuario y producto simulados
        when(userService.getLoginUser()).thenReturn(mockUser);
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        // Crear OrderItemRequest
        OrderItemRequest orderItemRequest = new OrderItemRequest();
        orderItemRequest.setProductId(1L);
        orderItemRequest.setQuantity(2);

        // Crear lista de OrderItemRequest y añadir al OrderRequest
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setItems(List.of(orderItemRequest));
        orderRequest.setTotalPrice(BigDecimal.valueOf(200.00));

        // Ejecutar el método bajo prueba
        Response response = orderItemService.placeOrder(orderRequest);

        // Verificaciones
        verify(orderRepository, times(1)).save(any(Order.class));
        assertEquals(200, response.getStatus());
        assertEquals("The order has been completed.", response.getMessage());
    }

    @Test
    void testPlaceOrder_ProductNotFound() {
        // Configuración de excepción al buscar el producto
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // Crear OrderItemRequest
        OrderItemRequest orderItemRequest = new OrderItemRequest();
        orderItemRequest.setProductId(1L);
        orderItemRequest.setQuantity(2);

        // Crear OrderRequest
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setItems(List.of(orderItemRequest));

        // Verificar que lanza excepción NotFoundException
        assertThrows(NotFoundException.class, () -> orderItemService.placeOrder(orderRequest));

        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void testFilterOrderItems_Success() {
        // Configuración de datos simulados
        OrderItem mockOrderItem = new OrderItem();
        mockOrderItem.setId(1L);
        mockOrderItem.setStatus(OrderStatus.PENDING);

        Page<OrderItem> mockPage = new PageImpl<>(List.of(mockOrderItem));
        when(orderItemRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(1L);
        orderItemDto.setStatus("PENDING");

        when(entityDtoMapper.mapOrderItemToDtoPlusProductAndUser(mockOrderItem)).thenReturn(orderItemDto);

        // Ejecutar el método bajo prueba
        Response response = orderItemService.filterOrderItems(
                OrderStatus.PENDING,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now(),
                1L,
                Pageable.unpaged()
        );

        // Verificaciones
        assertEquals(200, response.getStatus());
        assertEquals(1, response.getOrderItemList().size());
        verify(orderItemRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testFilterOrderItems_NotFound() {
        // Configuración de datos simulados
        Page<OrderItem> mockPage = Page.empty();
        when(orderItemRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Verificar que lanza excepción NotFoundException
        assertThrows(NotFoundException.class, () -> orderItemService.filterOrderItems(
                OrderStatus.PENDING,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now(),
                1L,
                Pageable.unpaged()
        ));

        verify(orderItemRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testUpdateOrderItemStatus_Success() {
        // Configuración de datos simulados
        OrderItem mockOrderItem = new OrderItem();
        mockOrderItem.setId(1L);
        mockOrderItem.setStatus(OrderStatus.PENDING);

        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(mockOrderItem));

        // Ejecutar el método bajo prueba
        Response response = orderItemService.updateOrderItemStatus(1L, "CONFIRMED");

        // Verificaciones
        verify(orderItemRepository, times(1)).save(mockOrderItem);
        assertEquals(OrderStatus.CONFIRMED, mockOrderItem.getStatus());
        assertEquals(200, response.getStatus());
        assertEquals("The status has been successfully updated.", response.getMessage());
    }

    @Test
    void testUpdateOrderItemStatus_NotFound() {
        // Configuración de excepción al buscar el pedido
        when(orderItemRepository.findById(1L)).thenReturn(Optional.empty());

        // Verificar que lanza excepción NotFoundException
        assertThrows(NotFoundException.class, () -> orderItemService.updateOrderItemStatus(1L, "CONFIRMED"));

        verify(orderItemRepository, never()).save(any(OrderItem.class));
    }
}
