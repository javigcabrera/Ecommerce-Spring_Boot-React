package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.LoginRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.dto.UserDto;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        // Preparar datos de entrada y salida simulados
        UserDto registrationRequest = new UserDto();
        registrationRequest.setName("John Doe");
        registrationRequest.setEmail("john.doe@example.com");
        registrationRequest.setPassword("password123");

        Response mockResponse = Response.builder()
                .status(201)
                .message("User registered successfully")
                .build();

        // Configurar comportamiento del mock
        when(userService.registerUser(any(UserDto.class))).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = authController.registerUser(registrationRequest);

        // Verificar resultados
        assertEquals(201, responseEntity.getBody().getStatus());
        assertEquals("User registered successfully", responseEntity.getBody().getMessage());
    }

    @Test
    void testLoginUser() {
        // Preparar datos de entrada y salida simulados
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@example.com");
        loginRequest.setPassword("password123");

        Response mockResponse = Response.builder()
                .status(200)
                .message("Login successful")
                .token("fake-jwt-token")
                .build();

        // Configurar comportamiento del mock
        when(userService.loginUser(any(LoginRequest.class))).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = authController.loginUser(loginRequest);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Login successful", responseEntity.getBody().getMessage());
        assertEquals("fake-jwt-token", responseEntity.getBody().getToken());
    }
}
