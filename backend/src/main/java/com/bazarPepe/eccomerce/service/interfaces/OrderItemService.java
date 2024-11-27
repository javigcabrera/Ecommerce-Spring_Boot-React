package com.bazarPepe.eccomerce.service.interfaces;

import com.bazarPepe.eccomerce.dto.OrderRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface OrderItemService {

    Response placeOrder(OrderRequest orderRequest);

    Response updateOrderItemStatus(Long orderItemID, String status);

    Response filterOrderItems(OrderStatus orderStatus, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable);

}
