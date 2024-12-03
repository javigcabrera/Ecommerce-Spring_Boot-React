package com.bazarPepe.eccomerce.service.implementation;

import com.bazarPepe.eccomerce.dto.CategoryDto;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Category;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.CategoryRepository;
import com.bazarPepe.eccomerce.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImplementation implements CategoryService {

    //INYECCION DE DEPENDENCIAS
    private final CategoryRepository categoryRepository;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    public Response createCategory(CategoryDto categoryRequest) {
        Category category=new Category();
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
        return Response.builder()
                .status(200)
                .message("Category created successfully.")
                .build();
    }

    @Override
    public Response updateCategory(Long categoryId, CategoryDto categoryRequest) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(()->new NotFoundException("No se ha encontrado esa categoria"));
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
        return Response.builder()
                .status(200)
                .message("Successfully updated.")
                .build();
    }

    @Override
    public Response getAllCategories() {
        List<Category>categories=categoryRepository.findAll();
        List<CategoryDto>categoryDtosList=categories.stream()
                .map(entityDtoMapper::mapCategoryToDtoBasic)
                .collect(Collectors.toList());
        return Response.builder()
                .status(200)
                .categoryList(categoryDtosList)
                .build();
    }

    @Override
    public Response getCategoryById(Long categoryId) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(()->new NotFoundException("No se ha encontrado la categoria"));
        CategoryDto categoryDto=entityDtoMapper.mapCategoryToDtoBasic(category);
        return Response.builder()
                .status(200)
                .category(categoryDto)
                .build();
    }

    @Override
    public Response deleteCategory(Long categoryId) {
        Category category=categoryRepository.findById(categoryId).orElseThrow(()->new NotFoundException("No se ha encontrado esa categoria"));
        categoryRepository.delete(category);
        return Response.builder()
                .status(200)
                .message("The category has been successfully deleted.")
                .build();
    }
}
