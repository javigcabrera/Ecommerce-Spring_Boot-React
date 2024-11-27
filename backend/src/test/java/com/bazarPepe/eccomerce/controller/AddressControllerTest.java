package com.bazarPepe.eccomerce.controller;

import com.bazarPepe.eccomerce.dto.AddressDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.service.interfaces.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AddressControllerTest {

    @Mock
    private AddressService addressService;

    @InjectMocks
    private AddressController addressController;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAndUpdateAddress(){
        // Preparar datos de entrada y salida simulados
        AddressDto addressDto = new AddressDto();
        addressDto.setStreet("123 Calle Falsa");
        addressDto.setCity("Springfield");

        Response mockResponse = Response.builder()
                .status(200)
                .message("Address saved successfully")
                .address(addressDto)
                .build();

        // Configurar comportamiento del mock
        when(addressService.saveAndUpdateAddress(any(AddressDto.class))).thenReturn(mockResponse);

        // Ejecutar el método
        ResponseEntity<Response> responseEntity = addressController.saveAndUpdateAddress(addressDto);

        // Verificar resultados
        assertEquals(200, responseEntity.getBody().getStatus());
        assertEquals("Address saved successfully", responseEntity.getBody().getMessage());
        assertEquals("123 Calle Falsa", responseEntity.getBody().getAddress().getStreet());
        assertEquals("Springfield", responseEntity.getBody().getAddress().getCity());
    }

}
