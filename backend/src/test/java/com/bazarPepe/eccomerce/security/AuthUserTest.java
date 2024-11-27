package com.bazarPepe.eccomerce.security;

import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class AuthUserTest {

    private AuthUser authUser;
    private User user;

    @BeforeEach
    void setUp() {
        // Crear un objeto User para pruebas
        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setRole(UserRole.ADMIN);

        // Crear AuthUser con el objeto User
        authUser = AuthUser.builder().user(user).build();
    }

    @Test
    void testGetAuthorities() {
        // Obtener las autoridades del usuario
        Collection<?> authorities = authUser.getAuthorities();

        // Verificar que las autoridades sean correctas
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority("ADMIN")));
    }

    @Test
    void testGetPassword() {
        // Verificar que el password sea el esperado
        assertEquals("password123", authUser.getPassword());
    }

    @Test
    void testGetUsername() {
        // Verificar que el username sea el esperado
        assertEquals("test@example.com", authUser.getUsername());
    }

    @Test
    void testIsAccountNonExpired() {
        // Verificar que la cuenta no haya expirado
        assertTrue(authUser.isAccountNonExpired());
    }

    @Test
    void testIsAccountNonLocked() {
        // Verificar que la cuenta no esté bloqueada
        assertTrue(authUser.isAccountNonLocked());
    }

    @Test
    void testIsCredentialsNonExpired() {
        // Verificar que las credenciales no hayan expirado
        assertTrue(authUser.isCredentialsNonExpired());
    }

    @Test
    void testIsEnabled() {
        // Verificar que el usuario esté habilitado
        assertTrue(authUser.isEnabled());
    }
}
