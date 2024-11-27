package com.bazarPepe.eccomerce.service.interfaces;

import com.bazarPepe.eccomerce.dto.Response;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public interface ProductService {

    Response createProduct(Long categoryId, MultipartFile image, String name, String description, BigDecimal price);

    Response updateProduct(Long productId, Long categoryId, MultipartFile image, String name, String description, BigDecimal price);

    Response deleteProduct(Long productId);

    Response getProductById(Long productId);

    Response getAllProduct();

    Response getProductsByCategory(Long categoryId);

    Response searchProduct(String searchValue);
}
