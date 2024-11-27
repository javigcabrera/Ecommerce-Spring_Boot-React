package com.bazarPepe.eccomerce.mapper;

import com.bazarPepe.eccomerce.dto.*;
import com.bazarPepe.eccomerce.entity.*;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import com.bazarPepe.eccomerce.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class EntityDtoMapperTest {

    private EntityDtoMapper mapper;

    @BeforeEach
    void setUp() {
        // Instancia del mapper antes de cada prueba
        mapper = new EntityDtoMapper();
    }

    @Test
    void testMapUserToDtoBasic() {
        // Preparar una entidad User con todos los valores necesarios
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("123456789");
        user.setRole(UserRole.USER); // Evitar valores nulos

        // Llamar al método mapUserToDtoBasic
        UserDto userDto = mapper.mapUserToDtoBasic(user);

        // Verificar que los valores del DTO coincidan con los de la entidad
        assertEquals(1L, userDto.getId());
        assertEquals("John Doe", userDto.getName());
        assertEquals("john.doe@example.com", userDto.getEmail());
        assertEquals("123456789", userDto.getPhoneNumber());
        assertEquals("USER", userDto.getRole());
    }

    @Test
    void testMapAddressToDtoBasic() {
        // Preparar una entidad Address
        Address address = new Address();
        address.setId(1L);
        address.setCity("City");
        address.setStreet("Street");
        address.setState("State");
        address.setCountry("Country");
        address.setZipCode("12345");

        // Llamar al método mapAddressToDtoBasic
        AddressDto addressDto = mapper.mapAddressToDtoBasic(address);

        // Verificar que los valores del DTO coincidan con los de la entidad
        assertEquals(1L, addressDto.getId());
        assertEquals("City", addressDto.getCity());
        assertEquals("Street", addressDto.getStreet());
        assertEquals("State", addressDto.getState());
        assertEquals("Country", addressDto.getCountry());
        assertEquals("12345", addressDto.getZipCode());
    }

    @Test
    void testMapOrderItemToDtoPlusProductAndUser() {
        // Preparar entidad Product
        Product product = new Product();
        product.setId(1L);
        product.setName("Product Name");

        // Preparar entidad User
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setRole(UserRole.USER); // Evitar valores nulos

        // Preparar entidad OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setId(1L);
        orderItem.setProduct(product);
        orderItem.setUser(user);
        orderItem.setStatus(OrderStatus.PENDING); // Evitar valores nulos

        // Llamar al método mapOrderItemToDtoPlusProductAndUser
        OrderItemDto orderItemDto = mapper.mapOrderItemToDtoPlusProductAndUser(orderItem);

        // Verificar que los valores del DTO coincidan con los de las entidades
        assertEquals(1L, orderItemDto.getId());
        assertNotNull(orderItemDto.getProduct());
        assertEquals("Product Name", orderItemDto.getProduct().getName());
        assertNotNull(orderItemDto.getUser());
        assertEquals("John Doe", orderItemDto.getUser().getName());
        assertEquals("PENDING", orderItemDto.getStatus());
    }

    @Test
    void testMapUserToDtoPlusAddressAndOrderHistory() {
        // Preparar entidad Address
        Address address = new Address();
        address.setId(1L);
        address.setCity("City");

        // Preparar entidad OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setId(1L);
        orderItem.setStatus(OrderStatus.CONFIRMED); // Evitar valores nulos

        // Preparar entidad User
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setRole(UserRole.USER); // Evitar valores nulos
        user.setAddress(address);
        user.setOrderItemList(Collections.singletonList(orderItem)); // Historial de pedidos

        // Llamar al método mapUsertoDtoPlusAddressAndOrderHistory
        UserDto userDto = mapper.mapUsertoDtoPlusAddressAndOrderHistory(user);

        // Verificar que los valores del DTO coincidan con los de las entidades
        assertEquals(1L, userDto.getId());
        assertEquals("City", userDto.getAddress().getCity());
        assertNotNull(userDto.getOrderItemList());
        assertEquals(1, userDto.getOrderItemList().size());
        assertEquals("CONFIRMED", userDto.getOrderItemList().get(0).getStatus());
    }
}
