package com.bazarPepe.eccomerce.service.implementation;

import com.bazarPepe.eccomerce.dto.AddressDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Address;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.repository.AddressRepository;
import com.bazarPepe.eccomerce.service.interfaces.AddressService;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressServiceImplementation implements AddressService {


    //INYECCION DE DEPENDENCIAS
    private final AddressRepository addressRepository;
    private final UserService userService;

    @Override
    public Response saveAndUpdateAddress(AddressDto addressDto) {

        // OBTIENE EL USUARIO
        User user = userService.getLoginUser();

        // OBTIENE LA DIRECCIÓN ASOCIADA AL USUARIO
        Address address = user.getAddress();

        // SI NO TIENE DIRECCIÓN, CREA UNA NUEVA Y LA ASOCIA AL USUARIO
        if (address == null) {
            address = new Address();
            address.setUser(user);
            user.setAddress(address); // ASOCIAR LA DIRECCIÓN AL USUARIO
        }

        // ACTUALIZA LOS CAMPOS DE DIRECCIÓN SOLO SI HAY VALORES NO NULOS EN AddressDto
        if (addressDto.getStreet() != null) {
            address.setStreet(addressDto.getStreet());
        }
        if (addressDto.getCity() != null) {
            address.setCity(addressDto.getCity());
        }
        if (addressDto.getState() != null) {
            address.setState(addressDto.getState());
        }
        if (addressDto.getZipCode() != null) {
            address.setZipCode(addressDto.getZipCode());
        }
        if (addressDto.getCountry() != null) {
            address.setCountry(addressDto.getCountry());
        }

        // GUARDA LA DIRECCIÓN ACTUALIZADA EN EL REPOSITORIO
        addressRepository.save(address);

        // MENSAJE DE CONFIRMACIÓN
        String message = "Address updated successfully.";

        // RETORNA UNA RESPUESTA EXITOSA CON EL ESTADO Y MENSAJE
        return Response.builder()
                .status(200)
                .message(message)
                .build();
    }

}
