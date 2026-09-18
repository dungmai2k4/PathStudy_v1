package com.studypath.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(500, "ERR_INTERNAL", "Internal server error"),
    INVALID_REQUEST(400, "ERR_INVALID_REQUEST", "Invalid request parameters"),
    UNAUTHENTICATED(401, "ERR_UNAUTHENTICATED", "Authentication required"),
    UNAUTHORIZED(403, "ERR_UNAUTHORIZED", "Access denied"),
    ACCOUNT_DISABLED(403, "ERR_ACCOUNT_DISABLED", "Account has been disabled"),
    RESOURCE_NOT_FOUND(404, "ERR_NOT_FOUND", "Resource not found"),
    USER_NOT_FOUND(404, "ERR_USER_NOT_FOUND", "User not found"),
    USER_ALREADY_EXISTS(409, "ERR_USER_EXISTS", "Username or email already exists"),
    INVALID_CREDENTIALS(401, "ERR_INVALID_CREDENTIALS", "Invalid username or password");

    private final int httpStatus;
    private final String code;
    private final String defaultMessage;

    ErrorCode(int httpStatus, String code, String defaultMessage) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.defaultMessage = defaultMessage;
    }
}
