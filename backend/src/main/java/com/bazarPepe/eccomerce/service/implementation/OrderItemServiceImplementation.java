package com.bazarPepe.eccomerce.service.implementation;

import com.bazarPepe.eccomerce.dto.OrderItemDto;
import com.bazarPepe.eccomerce.dto.OrderRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.entity.Order;
import com.bazarPepe.eccomerce.entity.OrderItem;
import com.bazarPepe.eccomerce.entity.Product;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.OrderItemRepository;
import com.bazarPepe.eccomerce.repository.OrderRepository;
import com.bazarPepe.eccomerce.repository.ProductRepository;
import com.bazarPepe.eccomerce.service.interfaces.OrderItemService;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import com.bazarPepe.eccomerce.specification.OrderItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImplementation implements OrderItemService {

    //INYECCION DEPENDENCIAS
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    public Response filterOrderItems(OrderStatus orderStatus, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable) {
        Specification<OrderItem>specification=Specification.where(OrderItemSpecification.hasStatus(orderStatus))
                .and(OrderItemSpecification.createdBetween(startDate,endDate))
                .and(OrderItemSpecification.hasItemId(itemId));
        Page<OrderItem>orderItemPage=orderItemRepository.findAll(specification,pageable);
        if(orderItemPage.isEmpty()){
            throw new NotFoundException("The order was not found.");
        }
        List<OrderItemDto>orderItemDtos=orderItemPage.getContent().stream()
                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .orderItemList(orderItemDtos)
                .totalPage(orderItemPage.getTotalPages())
                .totalElement(orderItemPage.getTotalElements())
                .build();
    }

    @Override
    public Response placeOrder(OrderRequest orderRequest) {
        User user=userService.getLoginUser();
        //MAP ORDER REQUEST ITEM TO ORDER ENTITY
        List<OrderItem>orderItems=orderRequest.getItems().stream().map(orderItemRequest -> {
            Product product=productRepository.findById(orderItemRequest.getProductId())
                    .orElseThrow(()->new NotFoundException("The product was not found."));
            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemRequest.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity())));//ESTABLECE EL PRECIO ACORDE A LA CANTIDAD
            orderItem.setStatus(OrderStatus.PENDING);
            orderItem.setUser(user);
            return orderItem;
        }).collect(Collectors.toList());

        //CALCULO PRECIO TOTAL DEL PEDIDO
        BigDecimal totalPrice=orderRequest.getTotalPrice()!=null&&orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO)>0
                ?orderRequest.getTotalPrice()
                :orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        //CREAR LA ENTIDAD ORDER
        Order order=new Order();
        order.setOrderItemList(orderItems);
        order.setTotalPrice(totalPrice);

        //ESTABLECER LA REFERENCIA DE PEDIDO EN CADA PRODUCTO DEL PEDIDO
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        orderRepository.save(order);

        return Response.builder()
                .status(200)
                .message("The order has been completed.")
                .build();
    }

    @Override
    public Response updateOrderItemStatus(Long orderItemID, String status) {
        OrderItem orderItem=orderItemRepository.findById(orderItemID)
                .orElseThrow(()->new NotFoundException("The product from the order could not be found."));
        orderItem.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        orderItemRepository.save(orderItem);

        return Response.builder()
                .status(200)
                .message("The status has been successfully updated.")
                .build();
    }
}
