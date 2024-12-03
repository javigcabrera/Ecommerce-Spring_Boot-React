package com.bazarPepe.eccomerce.security;

import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.UserRole;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {

    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customUserDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    void testLoadUserByUsername_UserExists() {
        // Crear un usuario simulado
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setRole(UserRole.ADMIN);

        // Configurar el mock del repositorio
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Llamar al método
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("test@example.com");

        // Verificar el resultado
        assertNotNull(userDetails);
        assertEquals("test@example.com", userDetails.getUsername());
        assertEquals("password123", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN")));

        // Verificar que el repositorio fue llamado
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        // Configurar el mock del repositorio para devolver un Optional vacío
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Llamar al método y verificar que lanza NotFoundException
        Exception exception = assertThrows(NotFoundException.class, () ->
                customUserDetailsService.loadUserByUsername("notfound@example.com"));

        assertEquals("User/Email does not exist.", exception.getMessage());

        // Verificar que el repositorio fue llamado
        verify(userRepository, times(1)).findByEmail("notfound@example.com");
    }
}
