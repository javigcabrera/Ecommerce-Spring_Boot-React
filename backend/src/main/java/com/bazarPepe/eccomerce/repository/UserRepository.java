package com.bazarPepe.eccomerce.repository;

import com.bazarPepe.eccomerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //BUSCAR POR EMAIL
    Optional<User>findByEmail(String email);
}
