package com.bazarPepe.eccomerce.repository;

import com.bazarPepe.eccomerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
