package com.bazarPepe.eccomerce.service;

import com.bazarPepe.eccomerce.dto.AddressDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Address;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.repository.AddressRepository;
import com.bazarPepe.eccomerce.service.implementation.AddressServiceImplementation;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AddressServiceImplementationTest {

    @InjectMocks
    private AddressServiceImplementation addressService;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserService userService;

    private User mockUser;
    private Address mockAddress;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configurar usuario y dirección simulados
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");

        mockAddress = new Address();
        mockAddress.setId(1L);
        mockAddress.setStreet("Old Street");
        mockAddress.setCity("Old City");
        mockAddress.setState("Old State");
        mockAddress.setZipCode("12345");
        mockAddress.setCountry("Old Country");
        mockUser.setAddress(mockAddress);
    }

    @Test
    void testSaveAndUpdateAddress_NewAddress() {
        // Simular comportamiento de `getLoginUser`
        when(userService.getLoginUser()).thenReturn(mockUser);
        mockUser.setAddress(null); // El usuario no tiene dirección inicialmente

        // Crear DTO con nuevos valores
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet("New Street");
        addressDto.setCity("New City");
        addressDto.setCountry("Testland");

        // Ejecutar método
        Response response = addressService.saveAndUpdateAddress(addressDto);

        // Verificar que se creó una nueva dirección
        verify(addressRepository, times(1)).save(any(Address.class));

        // Validar que la nueva dirección tenga los valores correctos
        assertEquals("New Street", mockUser.getAddress().getStreet());
        assertEquals("New City", mockUser.getAddress().getCity());
        assertEquals("Testland", mockUser.getAddress().getCountry());

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Address updated successfully.", response.getMessage());
    }

    @Test
    void testSaveAndUpdateAddress_UpdateExistingAddress() {
        // Configurar usuario con una dirección ya existente
        when(userService.getLoginUser()).thenReturn(mockUser);

        // Crear DTO con valores actualizados
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet("Updated Street");
        addressDto.setCity("Updated City");

        // Ejecutar método
        Response response = addressService.saveAndUpdateAddress(addressDto);

        // Verificar que la dirección se actualizó correctamente
        verify(addressRepository, times(1)).save(mockAddress);

        // Validar que solo se actualizaron los campos proporcionados
        assertEquals("Updated Street", mockAddress.getStreet());
        assertEquals("Updated City", mockAddress.getCity());
        assertEquals("Old State", mockAddress.getState()); // No cambiado
        assertEquals("12345", mockAddress.getZipCode()); // No cambiado
        assertEquals("Old Country", mockAddress.getCountry()); // No cambiado

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Address updated successfully.", response.getMessage());
    }

    @Test
    void testSaveAndUpdateAddress_NullFields() {
        // Configurar usuario con una dirección ya existente
        when(userService.getLoginUser()).thenReturn(mockUser);

        // Crear DTO con valores nulos
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet(null);
        addressDto.setCity(null);

        // Ejecutar método
        Response response = addressService.saveAndUpdateAddress(addressDto);

        // Verificar que la dirección no cambió
        verify(addressRepository, times(1)).save(mockAddress);

        // Validar que no se actualizaron los campos existentes
        assertEquals("Old Street", mockAddress.getStreet());
        assertEquals("Old City", mockAddress.getCity());
        assertEquals("Old State", mockAddress.getState());
        assertEquals("12345", mockAddress.getZipCode());
        assertEquals("Old Country", mockAddress.getCountry());

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Address updated successfully.", response.getMessage());
    }

    @Test
    void testSaveAndUpdateAddress_EmptyDto() {
        // Configurar usuario con una dirección ya existente
        when(userService.getLoginUser()).thenReturn(mockUser);

        // Crear un DTO vacío
        AddressDto addressDto = new AddressDto();

        // Ejecutar método
        Response response = addressService.saveAndUpdateAddress(addressDto);

        // Verificar que la dirección no cambió
        verify(addressRepository, times(1)).save(mockAddress);

        // Validar que no se actualizaron los campos existentes
        assertEquals("Old Street", mockAddress.getStreet());
        assertEquals("Old City", mockAddress.getCity());
        assertEquals("Old State", mockAddress.getState());
        assertEquals("12345", mockAddress.getZipCode());
        assertEquals("Old Country", mockAddress.getCountry());

        // Validar respuesta
        assertEquals(200, response.getStatus());
        assertEquals("Address updated successfully.", response.getMessage());
    }
}
