package com.bazarPepe.eccomerce.specification;

import com.bazarPepe.eccomerce.entity.OrderItem;
import com.bazarPepe.eccomerce.enums.OrderStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderItemSpecificationTest {

    @Mock
    private Root<OrderItem> root;

    @Mock
    private CriteriaBuilder criteriaBuilder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testHasStatus_NullStatus() {
        // Test when status is null
        OrderStatus status = null;

        var spec = OrderItemSpecification.hasStatus(status);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNull(predicate, "Expected predicate to be null for null status");
    }

    @Test
    void testHasStatus_ValidStatus() {
        // Test with a valid status
        OrderStatus status = OrderStatus.PENDING;
        Predicate mockPredicate = mock(Predicate.class);
        when(criteriaBuilder.equal(root.get("status"), status)).thenReturn(mockPredicate);

        var spec = OrderItemSpecification.hasStatus(status);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNotNull(predicate, "Predicate should not be null for valid status");
        assertEquals(mockPredicate, predicate);
        verify(criteriaBuilder, times(1)).equal(root.get("status"), status);
    }

    @Test
    void testCreatedBetween_NullDates() {
        // Test with both dates null
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;

        var spec = OrderItemSpecification.createdBetween(startDate, endDate);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNull(predicate, "Predicate should be null when both dates are null");
    }

    @Test
    void testCreatedBetween_OnlyStartDate() {
        // Test with only start date
        LocalDateTime startDate = LocalDateTime.now().minusDays(1);
        Predicate mockPredicate = mock(Predicate.class);
        when(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate)).thenReturn(mockPredicate);

        var spec = OrderItemSpecification.createdBetween(startDate, null);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNotNull(predicate, "Predicate should not be null when start date is provided");
        assertEquals(mockPredicate, predicate);
        verify(criteriaBuilder, times(1)).greaterThanOrEqualTo(root.get("createdAt"), startDate);
    }

    @Test
    void testCreatedBetween_OnlyEndDate() {
        // Test with only end date
        LocalDateTime endDate = LocalDateTime.now();
        Predicate mockPredicate = mock(Predicate.class);
        when(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate)).thenReturn(mockPredicate);

        var spec = OrderItemSpecification.createdBetween(null, endDate);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNotNull(predicate, "Predicate should not be null when end date is provided");
        assertEquals(mockPredicate, predicate);
        verify(criteriaBuilder, times(1)).lessThanOrEqualTo(root.get("createdAt"), endDate);
    }

    @Test
    void testCreatedBetween_BothDates() {
        // Test with both start and end dates
        LocalDateTime startDate = LocalDateTime.now().minusDays(2);
        LocalDateTime endDate = LocalDateTime.now();
        Predicate mockPredicate = mock(Predicate.class);
        when(criteriaBuilder.between(root.get("createdAt"), startDate, endDate)).thenReturn(mockPredicate);

        var spec = OrderItemSpecification.createdBetween(startDate, endDate);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNotNull(predicate, "Predicate should not be null when both dates are provided");
        assertEquals(mockPredicate, predicate);
        verify(criteriaBuilder, times(1)).between(root.get("createdAt"), startDate, endDate);
    }

    @Test
    void testHasItemId_NullItemId() {
        // Test when itemId is null
        Long itemId = null;

        var spec = OrderItemSpecification.hasItemId(itemId);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNull(predicate, "Predicate should be null when itemId is null");
    }

    @Test
    void testHasItemId_ValidItemId() {
        // Test with a valid itemId
        Long itemId = 1L;
        Predicate mockPredicate = mock(Predicate.class);
        when(criteriaBuilder.equal(root.get("id"), itemId)).thenReturn(mockPredicate);

        var spec = OrderItemSpecification.hasItemId(itemId);
        Predicate predicate = spec.toPredicate(root, null, criteriaBuilder);

        assertNotNull(predicate, "Predicate should not be null for valid itemId");
        assertEquals(mockPredicate, predicate);
        verify(criteriaBuilder, times(1)).equal(root.get("id"), itemId);
    }
}
