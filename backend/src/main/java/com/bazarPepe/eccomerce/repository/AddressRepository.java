package com.bazarPepe.eccomerce.repository;

import com.bazarPepe.eccomerce.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
