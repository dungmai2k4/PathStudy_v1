package com.studypath.auth.exception;

import com.studypath.common.dto.ErrorResponse;
import com.studypath.common.exception.AppException;
import com.studypath.common.exception.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        ErrorCode code = ex.getErrorCode();
        ErrorResponse body = ErrorResponse.of(code.getCode(), ex.getMessage());
        return ResponseEntity.status(code.getHttpStatus()).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse body = ErrorResponse.of(
                ErrorCode.INVALID_REQUEST.getCode(),
                "Validation failed",
                details
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse body = ErrorResponse.of(
                ErrorCode.UNCATEGORIZED_EXCEPTION.getCode(),
                ex.getMessage() != null ? ex.getMessage() : "Unexpected internal error"
        );
        return ResponseEntity.internalServerError().body(body);
    }
}
