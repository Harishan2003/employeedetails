package com.example.employee.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.employee.backend.dto.LoginResponse;
import com.example.employee.backend.entity.employee;
import com.example.employee.backend.repository.employeerepository;
@Service
public class employeeservice {
    @Autowired
    private employeerepository employeeRepository;

    public employee createEmployee(employee employee) {
        return employeeRepository.save(employee);
    }

    public List<employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public employee updateEmployee(Long id, employee updatedEmployee) {
        return employeeRepository.findById(id)
                .map(emp -> {
                    emp.setName(updatedEmployee.getName());
                    emp.setDepartment(updatedEmployee.getDepartment());
                    emp.setSalary(updatedEmployee.getSalary());
                    return employeeRepository.save(emp);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id " + id));
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
    @Autowired
    private employeerepository repo;
    public LoginResponse login(String username, String password) {

        LoginResponse response = new LoginResponse();

        Optional<employee> emp = repo.findByUsernameAndPassword(username, password);


        if (emp.isPresent()) {
            response.setSuccess(true);
            response.setMessage("Login successful");
        } else {
            response.setSuccess(false);
            response.setMessage("Invalid username or password");
        }
        return response;
    }
    public employee getEmployeeByUsername(String username) {
        return employeeRepository.findByUsername(username);
    }
}
