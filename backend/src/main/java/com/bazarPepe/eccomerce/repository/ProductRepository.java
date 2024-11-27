package com.bazarPepe.eccomerce.repository;

import com.bazarPepe.eccomerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    //PARA BUSCAR SEGUN LA CATEGORIA
    List<Product>findByCategoryId(Long categoryId);

    //PARA BUSCAR FILTRANDO POR EL NOMBRE O LA DESCRIPCION, EJEMPLO CA ENCONTRARIA CAMISA
    List<Product>findByNameContainingOrDescriptionContaining(String name,String description);

}
