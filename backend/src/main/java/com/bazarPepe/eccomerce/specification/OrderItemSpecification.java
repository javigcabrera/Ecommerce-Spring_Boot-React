package com.bazarPepe.eccomerce.specification;

import com.bazarPepe.eccomerce.entity.OrderItem;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class OrderItemSpecification {

    //ESPECIFICACION PARA FILTRAR ORDER ITEMS POR STATUS
    public static Specification<OrderItem>hasStatus(OrderStatus status){
        return ((root,query,criteriaBuilder)->
                status!=null?criteriaBuilder.equal(root.get("status"),status):null);

    }

    //ESPECIFICACION PARA FILTRAR ORDER ITEMS POR RANGO DE DATOS
    public static Specification<OrderItem>createdBetween(LocalDateTime startDate,LocalDateTime endDate){
        return ((root, query, criteriaBuilder) -> {
            if (startDate!=null&&endDate!=null){
                return criteriaBuilder.between(root.get("createdAt"),startDate,endDate);
            }else if(startDate!=null){
                return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"),startDate);
            }else if (endDate!=null){
                return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"),endDate);
            }else{
                return null;
            }
        });
    }
    //GENERAR ESPECIFICACION PARA FILTRAR LOS ORDERITEMS POR ITEM ID
    public static Specification<OrderItem>hasItemId(Long itemId){
        return ((root, query, criteriaBuilder) ->
                itemId!=null?criteriaBuilder.equal(root.get("id"),itemId):null);
    }



}
