package com.bazarPepe.eccomerce.service;

import com.bazarPepe.eccomerce.dto.LoginRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.dto.UserDto;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.UserRole;
import com.bazarPepe.eccomerce.exception.InvalidCredentialsException;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.UserRepository;
import com.bazarPepe.eccomerce.security.JwtUtils;
import com.bazarPepe.eccomerce.service.implementation.UserServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplementationTest {

    @InjectMocks
    private UserServiceImplementation userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private EntityDtoMapper entityDtoMapper;

    @Mock
    private Authentication authentication;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock user setup
        mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRole(UserRole.USER);
    }

    @Test
    void testRegisterUser_UserRoleUser() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setName("Test User");
        userDto.setEmail("test@example.com");
        userDto.setPassword("plainPassword");
        userDto.setPhoneNumber("123456789");

        when(passwordEncoder.encode(userDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(entityDtoMapper.mapUserToDtoBasic(any(User.class))).thenReturn(userDto);

        // Act
        Response response = userService.registerUser(userDto);

        // Assert
        assertEquals(200, response.getStatus());
        assertEquals("User added successfully.", response.getMessage());
        assertNotNull(response.getUser());

        verify(userRepository, times(1)).save(any(User.class));
        verify(entityDtoMapper, times(1)).mapUserToDtoBasic(any(User.class));
    }

    @Test
    void testRegisterUser_UserRoleAdmin() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setRole("admin");
        userDto.setName("Admin User");
        userDto.setEmail("admin@example.com");
        userDto.setPassword("plainPassword");

        when(passwordEncoder.encode(userDto.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(entityDtoMapper.mapUserToDtoBasic(any(User.class))).thenReturn(userDto);

        // Act
        Response response = userService.registerUser(userDto);

        // Assert
        assertEquals(200, response.getStatus());
        assertEquals("User added successfully.", response.getMessage());
        assertNotNull(response.getUser());

        verify(userRepository, times(1)).save(any(User.class));
        verify(entityDtoMapper, times(1)).mapUserToDtoBasic(any(User.class));
    }

    @Test
    void testLoginUser_Success() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("plainPassword");

        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), mockUser.getPassword())).thenReturn(true);
        when(jwtUtils.generateToken(mockUser)).thenReturn("mockedToken");

        // Act
        Response response = userService.loginUser(loginRequest);

        // Assert
        assertEquals(200, response.getStatus());
        assertEquals("Login successful", response.getMessage());
        assertEquals("mockedToken", response.getToken());

        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), mockUser.getPassword());
        verify(jwtUtils, times(1)).generateToken(mockUser);
    }

    @Test
    void testLoginUser_UserNotFound() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");

        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        NotFoundException exception = assertThrows(NotFoundException.class, () -> userService.loginUser(loginRequest));
        assertEquals("The email was not found.", exception.getMessage());

        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
    }

    @Test
    void testLoginUser_InvalidPassword() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongPassword");

        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), mockUser.getPassword())).thenReturn(false);

        // Act & Assert
        InvalidCredentialsException exception = assertThrows(InvalidCredentialsException.class, () -> userService.loginUser(loginRequest));
        assertEquals("The password is incorrect.", exception.getMessage());

        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), mockUser.getPassword());
    }

    @Test
    void testGetAllUsers_Success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(mockUser));
        when(entityDtoMapper.mapUserToDtoBasic(mockUser)).thenReturn(new UserDto());

        // Act
        Response response = userService.getAllUsers();

        // Assert
        assertEquals(200, response.getStatus());
        assertNotNull(response.getUserList());

        verify(userRepository, times(1)).findAll();
        verify(entityDtoMapper, times(1)).mapUserToDtoBasic(mockUser);
    }

    @Test
    void testGetAllUsers_Exception() {
        // Arrange
        when(userRepository.findAll()).thenThrow(new RuntimeException("Database error"));

        // Act
        Response response = userService.getAllUsers();

        // Assert
        assertEquals(500, response.getStatus());
        assertTrue(response.getMessage().contains("Error retrieving the user list: "));

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetLoginUser_Success() {
        // Arrange
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

        // Act
        User user = userService.getLoginUser();

        // Assert
        assertNotNull(user);
        assertEquals("test@example.com", user.getEmail());

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testGetLoginUser_NotFound() {
        // Arrange
        when(authentication.getName()).thenReturn("nonexistent@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, userService::getLoginUser);
        assertEquals("The user was not found.", exception.getMessage());

        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void testGetUserInfoAndOrderHistory_Success() {
        // Arrange
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(entityDtoMapper.mapUsertoDtoPlusAddressAndOrderHistory(mockUser)).thenReturn(new UserDto());

        // Act
        Response response = userService.getUserInfoAndOrderHistory();

        // Assert
        assertEquals(200, response.getStatus());
        assertNotNull(response.getUser());

        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(entityDtoMapper, times(1)).mapUsertoDtoPlusAddressAndOrderHistory(mockUser);
    }
}
