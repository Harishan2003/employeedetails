package com.example.employee.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.employee.backend.entity.attendance;
import com.example.employee.backend.repository.attendanceRepository;

@Service
public class AttendanceService {

	 @Autowired
	    private attendanceRepository attendanceRepository;

	    public List<attendance> getAttendanceByDate(LocalDate date) {
	        return attendanceRepository.findByDate(date);
	    }

	    public attendance markAttendance(Long employeeId, LocalDate date, String status) {
	        attendance att = attendanceRepository.findByEmployeeIdAndDate(employeeId, date).orElse(null);
	        if (att == null) {
	            att = new attendance();
	            att.setEmployeeId(employeeId);
	            att.setDate(date);
	        }
	        att.setStatus(status);
	        return attendanceRepository.save(att);
	    }
    public attendance getAttendanceByEmployeeAndDate(Long employeeId, LocalDate date) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, date).orElse(null);
    }
}
