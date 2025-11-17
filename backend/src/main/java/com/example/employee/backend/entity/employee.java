package com.example.employee.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;
    private String username;
    private String password;
    private Double salary;   // <-- add this
}
