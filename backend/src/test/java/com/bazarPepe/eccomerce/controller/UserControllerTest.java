package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        // Preparar datos simulados
        Response mockResponse = Response.builder()
                .status(200)
                .message("Users retrieved successfully")
                .build();

        // Configurar comportamiento del mock
        when(userService.getAllUsers()).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = userController.getAllUsers();

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Users retrieved successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testGetUserInfoAndOrderHistory() {
        // Preparar datos simulados
        Response mockResponse = Response.builder()
                .status(200)
                .message("User info and order history retrieved successfully")
                .build();

        // Configurar comportamiento del mock
        when(userService.getUserInfoAndOrderHistory()).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = userController.getUserInfoAndOrderHistory();

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("User info and order history retrieved successfully", responseEntity.getBody().getMessage());
    }
}
