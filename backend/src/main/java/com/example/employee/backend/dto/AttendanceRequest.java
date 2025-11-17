package com.example.employee.backend.dto;

import lombok.Data;

@Data
public class AttendanceRequest {
    private Long employeeId;
    private String date;
    private String status;
}
