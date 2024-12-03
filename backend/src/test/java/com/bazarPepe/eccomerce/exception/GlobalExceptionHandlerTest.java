package com.bazarPepe.eccomerce.exception;

import com.bazarPepe.eccomerce.dto.Response;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();

    @Test
    void testHandleAllException() {
        Exception exception = new Exception("Internal Server Error");
        WebRequest mockRequest = mock(WebRequest.class);

        ResponseEntity<Response> responseEntity = globalExceptionHandler.handleAllException(exception, mockRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(500, responseEntity.getBody().getStatus());
        assertEquals("Incorrect data, please try again.", responseEntity.getBody().getMessage());
    }

    @Test
    void testHandleNotFoundException() {
        NotFoundException exception = new NotFoundException("Resource not found");
        WebRequest mockRequest = mock(WebRequest.class);

        ResponseEntity<Response> responseEntity = globalExceptionHandler.handleNotFoundException(exception, mockRequest);

        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(404, responseEntity.getBody().getStatus());
        assertEquals("Resource not found", responseEntity.getBody().getMessage());
    }

    @Test
    void testHandleInvalidCredentialException() {
        InvalidCredentialsException exception = new InvalidCredentialsException("Invalid credentials");
        WebRequest mockRequest = mock(WebRequest.class);

        ResponseEntity<Response> responseEntity = globalExceptionHandler.handleInvalidCredentialException(exception, mockRequest);

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(400, responseEntity.getBody().getStatus());
        assertEquals("Invalid credentials", responseEntity.getBody().getMessage());
    }

    @Test
    void testHandleValidationExceptions() {
        MethodArgumentNotValidException mockException = mock(MethodArgumentNotValidException.class);
        WebRequest mockRequest = mock(WebRequest.class);

        ResponseEntity<Response> responseEntity = globalExceptionHandler.handleValidationExceptions(mockException, mockRequest);

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(400, responseEntity.getBody().getStatus());
        assertEquals("Incorrect data, please try another option.", responseEntity.getBody().getMessage());
    }

    @Test
    void testHandleConstraintViolationException() {
        ConstraintViolationException exception = new ConstraintViolationException("Constraint violation", null);

        ResponseEntity<Response> responseEntity = globalExceptionHandler.handleConstraintViolationException(exception);

        assertEquals(HttpStatus.BAD_REQUEST, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(400, responseEntity.getBody().getStatus());
        assertEquals("Incorrect data, please try another option.", responseEntity.getBody().getMessage());
    }
}
