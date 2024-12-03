package com.bazarPepe.eccomerce.service.implementation;

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
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    public Response registerUser(UserDto registrationRequest) {
        // ASIGNA UN ROL POR DEFECTO AL USUARIO COMO 'USER'
        UserRole role = UserRole.USER;

        // SI EL ROL PROPORCIONADO EN EL REGISTRO ES 'ADMIN', CAMBIA EL ROL A 'ADMIN'
        if (registrationRequest.getRole() != null && registrationRequest.getRole().equalsIgnoreCase("admin")) {
            role = UserRole.ADMIN;
        }

        // CREA UNA INSTANCIA DE 'User' A PARTIR DE LOS DATOS PROPORCIONADOS EN 'registrationRequest'
        // SE UTILIZA UN PATRÓN BUILDER PARA CONSTRUIR EL OBJETO
        User user = User.builder()
                .name(registrationRequest.getName()) // ESTABLECE EL NOMBRE DEL USUARIO
                .email(registrationRequest.getEmail()) // ESTABLECE EL EMAIL
                .password(passwordEncoder.encode(registrationRequest.getPassword())) // ENCRIPTA LA CONTRASEÑA
                .phoneNumber(registrationRequest.getPhoneNumber()) // ESTABLECE EL NÚMERO DE TELÉFONO
                .role(role) // ASIGNA EL ROL DEL USUARIO
                .build(); // CONSTRUYE EL OBJETO 'User'

        // GUARDA EL USUARIO EN LA BASE DE DATOS USANDO EL REPOSITORIO
        User savedUser = userRepository.save(user);

        // IMPRIME LOS DATOS DEL USUARIO GUARDADO (PARA DEPURACIÓN)
        System.out.println(savedUser);

        // CONVIERTE EL USUARIO GUARDADO A 'UserDto' USANDO UN MAPPER PARA DEVOLVER UNA VERSIÓN BÁSICA DEL USUARIO
        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);

        // CREA UNA RESPUESTA EXITOSA CON UN MENSAJE Y LOS DATOS DEL USUARIO
        return Response.builder()
                .status(200) // ESTABLECE EL ESTADO DE LA RESPUESTA COMO '200 OK'
                .message("User added successfully.") // MENSAJE DE ÉXITO
                .user(userDto) // INCLUYE LOS DATOS DEL USUARIO EN LA RESPUESTA
                .build(); // CONSTRUYE EL OBJETO 'Response'
    }


    @Override
    public Response loginUser(LoginRequest loginRequest) {

        //BUSCA EL USUARIO POR EMAIL, LANZA EXCEPCION SI NO LO ENCUENTRA
        User user=userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()->new NotFoundException("The email was not found."));

        //COMPRUEBA SI ES LA CONTRASEÑA CORRECTA, SINO LANZA EXCEPCION
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("The password is incorrect.");
        }

        //GENERA EL TOKEN JWT Y CREA LA RESPUESTA DE EXITO
        String token= jwtUtils.generateToken(user);
        return Response.builder()
                .status(200)
                .message("Login successful")
                .token(token)
                .expirationTime("6 month")
                .role(user.getRole().name())
                .build();

    }

    @Override
    public Response getAllUsers() {
        try {
            //OBTIENE TODOS LOS USUARIOS Y LOS MAPEAS A UserDto
            List<User> users = userRepository.findAll();
            List<UserDto> userDtos = users.stream()
                    .map(entityDtoMapper::mapUserToDtoBasic)
                    .toList();

            //SI TODO SALE BIEN, DEVUELVE UNA RESPUESTA EXITOSA
            return Response.builder()
                    .status(200)
                    .message("Success")
                    .userList(userDtos)
                    .build();

        } catch (Exception exception) {
            //SI OCURRE ALGÚN ERROR, DEVUELVE UNA RESPUESTA DE ERROR
            return Response.builder()
                    .status(500)
                    .message("Error retrieving the user list: " + exception.getMessage())
                    .build();
        }
    }

    @Override
    public User getLoginUser() {
        //OBTIENE LA AUTENTIFICACION DEL USUARIO DEL CONTEXTO DE SEGURIDAD
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        //EXTRAE EL EMAIL DEL USUARIO AUTENTIFICADO
        String email=authentication.getName();

        //LOGUEA EL EMAIL PARA REGISTROS DE SEGUIMIENTO
        log.info("User email is: " +email);

        //SE BUSCA EL USUARIO POR EL EMAIL, SI NO SE ENCUENTRA LANZA EXCEPCION
        return userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("The user was not found."));
    }

    @Override
    public Response getUserInfoAndOrderHistory() {

        //OBTIENE EL USUARIO AUTENTIFICADO
        User user=getLoginUser();

        //MAPEO A USERDTO AÑADIENDO ADDRESS Y ORDER HISTORY
        UserDto userDto=entityDtoMapper.mapUsertoDtoPlusAddressAndOrderHistory(user);

        //CONSTRUYE UNA RESPUESTA EXITOSA
        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }
}
