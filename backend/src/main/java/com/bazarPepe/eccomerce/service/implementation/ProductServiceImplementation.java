package com.bazarPepe.eccomerce.service.implementation;

import com.bazarPepe.eccomerce.dto.ProductDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Category;
import com.bazarPepe.eccomerce.entity.Product;
import com.bazarPepe.eccomerce.exception.InvalidCredentialsException;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.CategoryRepository;
import com.bazarPepe.eccomerce.repository.ProductRepository;
import com.bazarPepe.eccomerce.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImplementation implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final EntityDtoMapper entityDtoMapper;

    @Override
    public Response createProduct(Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("No existe esa categoría"));

        // Validar que el archivo es una imagen
        if (image == null || image.isEmpty()) {
            throw new InvalidCredentialsException("La imagen es obligatoria");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidCredentialsException("El archivo proporcionado no es una imagen válida");
        }

        try {
            Product product = new Product();
            product.setCategory(category);
            product.setPrice(price);
            product.setName(name);
            product.setDescription(description);
            product.setImage(image.getBytes());
            productRepository.save(product);

            return Response.builder()
                    .status(200)
                    .message("Producto creado con éxito")
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar la imagen", e);
        }
    }

    @Override
    public Response updateProduct(Long productId, Long categoryId, MultipartFile image, String name, String description, BigDecimal price) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("No se ha encontrado el producto"));

        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new NotFoundException("No existe esa categoría"));
        }

        byte[] productImage = null;
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new InvalidCredentialsException("El archivo proporcionado no es una imagen válida");
            }

            try {
                productImage = image.getBytes();
            } catch (Exception e) {
                throw new RuntimeException("Error procesando la imagen", e);
            }
        }

        if (category != null) {
            product.setCategory(category);
        }
        if (name != null) {
            product.setName(name);
        }
        if (price != null) {
            product.setPrice(price);
        }
        if (description != null && !description.isEmpty()) {
            product.setDescription(description);
        }
        if (productImage != null) {
            product.setImage(productImage);
        }

        productRepository.save(product);

        return Response.builder()
                .status(200)
                .message("Producto actualizado correctamente")
                .build();
    }

    @Override
    public Response deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("No se ha encontrado el producto"));
        productRepository.delete(product);
        return Response.builder()
                .status(200)
                .message("Se ha eliminado el producto correctamente")
                .build();
    }

    @Override
    public Response getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("No se ha encontrado el producto"));
        ProductDto productDto = entityDtoMapper.mapProductToDtoBasic(product);
        return Response.builder()
                .status(200)
                .product(productDto)
                .build();
    }

    @Override
    public Response getAllProduct() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .collect(Collectors.toList());
        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

    @Override
    public Response getProductsByCategory(Long categoryId) {
        List<Product> productsByCategory = productRepository.findByCategoryId(categoryId);
        if (productsByCategory == null || productsByCategory.isEmpty()) {
            throw new NotFoundException("No se han encontrado productos para esta categoría");
        }
        List<ProductDto> productDtoList = productsByCategory.stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

    @Override
    public Response searchProduct(String searchValue) {
        List<Product> products = productRepository.findByNameContainingOrDescriptionContaining(searchValue, searchValue);
        if (products.isEmpty()) {
            throw new NotFoundException("No se han encontrado productos");
        }
        List<ProductDto> productDtoList = products.stream()
                .map(entityDtoMapper::mapProductToDtoBasic)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }
}
