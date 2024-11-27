package com.bazarPepe.eccomerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email es obligatorio")
    private String email;

    @NotBlank(message = "Contraseña es obligatoria")
    private String password;

}
