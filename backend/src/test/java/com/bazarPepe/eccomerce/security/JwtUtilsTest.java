package com.bazarPepe.eccomerce.security;

import com.bazarPepe.eccomerce.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.spec.SecretKeySpec;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private static final String SECRET_KEY = "abcdefghijklmnopqrstuvwxyz1234567890abcd";

    @BeforeEach
    void setUp() throws Exception {
        jwtUtils = new JwtUtils();

        // Configurar el valor de 'secreteJwtString' mediante reflexión
        Field secretKeyField = JwtUtils.class.getDeclaredField("secreteJwtString");
        secretKeyField.setAccessible(true);
        secretKeyField.set(jwtUtils, SECRET_KEY);

        // Invocar el método privado 'init' mediante reflexión
        Method initMethod = JwtUtils.class.getDeclaredMethod("init");
        initMethod.setAccessible(true);
        initMethod.invoke(jwtUtils);
    }


    @Test
    void testGenerateToken() {
        // Crear un usuario
        User user = new User();
        user.setEmail("test@example.com");

        // Generar token
        String token = jwtUtils.generateToken(user);

        // Validaciones
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetUsernameFromToken() {
        // Generar un token válido
        String token = jwtUtils.generateToken("test@example.com");

        // Extraer el username
        String username = jwtUtils.getUsernameFromToken(token);

        // Validaciones
        assertEquals("test@example.com", username);
    }

    @Test
    void testIsTokenValid_ValidToken() {
        // Configurar UserDetails simulado
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        Mockito.when(userDetails.getUsername()).thenReturn("test@example.com");

        // Generar token
        String token = jwtUtils.generateToken("test@example.com");

        // Validar el token
        assertTrue(jwtUtils.isTokenValid(token, userDetails));
    }

    @Test
    void testIsTokenValid_InvalidToken() {
        // Configurar UserDetails simulado
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        Mockito.when(userDetails.getUsername()).thenReturn("test@example.com");

        // Token inválido
        String invalidToken = "invalid.token";

        // Validaciones
        assertThrows(MalformedJwtException.class, () -> jwtUtils.getUsernameFromToken(invalidToken));
    }

    @Test
    void testIsTokenExpired() {
        // Crear un token expirado
        String expiredToken = jwtUtils.generateToken("test@example.com");
        Date expiredDate = new Date(System.currentTimeMillis() - 1000L);

        String expiredTokenModified = io.jsonwebtoken.Jwts.builder()
                .setSubject("test@example.com")
                .setIssuedAt(new Date(System.currentTimeMillis() - 2000L))
                .setExpiration(expiredDate)
                .signWith(new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256"))
                .compact();

        // Verificar si el token está expirado
        assertThrows(ExpiredJwtException.class, () -> jwtUtils.getUsernameFromToken(expiredTokenModified));
    }

    @Test
    void testGenerateTokenWithUser() {
        // Crear un usuario
        User user = new User();
        user.setEmail("testuser@example.com");

        // Generar token
        String token = jwtUtils.generateToken(user);

        // Validar token
        assertNotNull(token);
        String username = jwtUtils.getUsernameFromToken(token);
        assertEquals("testuser@example.com", username);
    }

    @Test
    void testInvalidTokenSignature() {
        // Crear un token manipulado
        String token = jwtUtils.generateToken("test@example.com");
        String manipulatedToken = token.substring(0, token.length() - 1) + "x";

        // Validar que lanza una excepción de firma inválida
        assertThrows(SignatureException.class, () -> jwtUtils.getUsernameFromToken(manipulatedToken));
    }
}
