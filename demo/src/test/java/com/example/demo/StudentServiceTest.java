
package com.example.demo;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class StudentServiceTest {

    @Autowired
    private StudentService service;

    @Test
    void testAddStudent() {
        Student s = new Student();
        s.setName("Test");
        s.setEmail("test@test.com");
        s.setDepartment("CSE");
        s.setStudentYear(3);

        Student saved = service.addStudent(s);

        assertNotNull(saved.getId());
    }
}
