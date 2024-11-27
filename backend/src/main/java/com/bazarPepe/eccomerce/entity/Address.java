package com.bazarPepe.eccomerce.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    @OneToOne(mappedBy = "address", fetch = FetchType.LAZY)
    private User user;

    @Column(name="created_at")
    private final LocalDateTime createdAt=LocalDateTime.now();

}
