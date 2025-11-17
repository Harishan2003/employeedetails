package com.example.employee.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.employee.backend.entity.attendance;

@Repository
public interface attendanceRepository extends JpaRepository<attendance, Long> {
    List<attendance> findByDate(LocalDate date);
    //attendance findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    Optional<attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
}
