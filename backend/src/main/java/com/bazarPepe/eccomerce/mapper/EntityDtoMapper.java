package com.bazarPepe.eccomerce.mapper;

import com.bazarPepe.eccomerce.dto.*;
import com.bazarPepe.eccomerce.entity.*;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    //ENTITY USER TO USER DTO BASIC
    public UserDto mapUserToDtoBasic(User user){
        UserDto userDto=new UserDto();
        userDto.setId(user.getId());
        userDto.setPhoneNumber((user.getPhoneNumber()));
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        userDto.setName(user.getName());
        return userDto;
    }

    //ENTITY ADDRESS TO ADDRESS DTO BASIC
    public AddressDto mapAddressToDtoBasic(Address address){
        AddressDto addressDto=new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCity(address.getCity());
        addressDto.setStreet(address.getStreet());
        addressDto.setState(address.getState());
        addressDto.setCountry(address.getCountry());
        addressDto.setZipCode(address.getZipCode());
        return addressDto;
    }

    //ENTITY CATEGORY TO CATEGORY DTO BASIC
    public CategoryDto mapCategoryToDtoBasic(Category category){
        CategoryDto categoryDto=new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }

    //ENTITY ORDERITEM TO ORDERITEM DTO BASIC
    public OrderItemDto mapOrderItemToDtoBasic(OrderItem orderItem){
        OrderItemDto orderItemDto=new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setQuantity(orderItem.getQuantity());
        orderItemDto.setPrice(orderItem.getPrice());
        orderItemDto.setStatus(orderItem.getStatus().name());
        orderItemDto.setCreatedAt(orderItem.getCreatedAt());
        return orderItemDto;
    }

    //ENTITY PRODUCT TO PRODUCT DTO BASIC
    public ProductDto mapProductToDtoBasic(Product product){
        ProductDto productDto=new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        // Convertir la imagen a Base64 y asignarla a productDto
        productDto.setImage(product.getImage() != null ?
                Base64.getEncoder().encodeToString(product.getImage()) : null);

        return productDto;
    }

    //ADD ADDRESS TO USER DTO
    public UserDto mapUserToDtoPlusAddress(User user){
        UserDto userDto=mapUserToDtoBasic(user);
        if (user.getAddress()!=null){
            AddressDto addressDto=mapAddressToDtoBasic(user.getAddress());
            userDto.setAddress(addressDto);
        }
        return userDto;
    }

    //ADD PRODUCT TO ORDERITEM DTO
    public OrderItemDto mapOrderItemToDtoPlusProduct(OrderItem orderItem){
        OrderItemDto orderItemDto=mapOrderItemToDtoBasic(orderItem);
        if(orderItem.getProduct()!=null){
            ProductDto productDto=mapProductToDtoBasic(orderItem.getProduct());
            orderItemDto.setProduct(productDto);
        }
        return orderItemDto;
    }

    //ADD USER,PRODUCT TO ORDERITEM DTO
    public OrderItemDto mapOrderItemToDtoPlusProductAndUser(OrderItem orderItem){
        OrderItemDto orderItemDto=mapOrderItemToDtoPlusProduct(orderItem);
        if(orderItem.getUser()!=null){
            UserDto userDto=mapUserToDtoPlusAddress(orderItem.getUser());
            orderItemDto.setUser(userDto);
        }
        return orderItemDto;
    }

    //ADD ADDRESS, ORDER ITEMS HISTORY TO USER DTO
    public UserDto mapUsertoDtoPlusAddressAndOrderHistory(User user){
        UserDto userDto=mapUserToDtoPlusAddress(user);
        if (user.getOrderItemList()!=null && !user.getOrderItemList().isEmpty()){
            userDto.setOrderItemList(user.getOrderItemList()
                    .stream()
                    .map(this::mapOrderItemToDtoPlusProduct)
                    .collect(Collectors.toList()));
        }
        return userDto;
    }



}
