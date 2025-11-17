package com.example.employee.backend.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.employee.backend.entity.attendance;
import com.example.employee.backend.entity.employee;
import com.example.employee.backend.service.AttendanceService;
import com.example.employee.backend.service.employeeservice;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private employeeservice employeeService;

    // Full attendance
    @GetMapping("/full")
    public List<Map<String, Object>> getFullAttendance(@RequestParam("date") String date) {
        LocalDate attDate = LocalDate.parse(date);
        List<attendance> records = attendanceService.getAttendanceByDate(attDate);
        List<employee> employees = employeeService.getAllEmployees();

        List<Map<String, Object>> result = new ArrayList<>();
        for (employee emp : employees) {
            attendance att = records.stream()
                    .filter(a -> a.getEmployeeId().equals(emp.getId()))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("id", emp.getId());
            map.put("name", emp.getName());
            map.put("department", emp.getDepartment());
            map.put("status", att != null ? att.getStatus() : "Absent");

            result.add(map);
        }
        return result;
    }

    // Mark attendance
    @PostMapping("/mark")
    public attendance markAttendance(@RequestBody Map<String, String> payload) {
        try {
            Long employeeId = Long.parseLong(payload.get("employeeId"));
            LocalDate date = LocalDate.parse(payload.get("date"));
            String status = payload.get("status");

            return attendanceService.markAttendance(employeeId, date, status);

        } catch (Exception e) {
            e.printStackTrace();   // <-- This prints the REAL error in console
            throw e;
        }
    }
}
