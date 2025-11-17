package com.example.employee.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.employee.backend.entity.employee;

public interface employeerepository extends JpaRepository<employee, Long> {
    Optional<employee> findByUsernameAndPassword(String username, String password);
    employee findByUsername(String username);
}