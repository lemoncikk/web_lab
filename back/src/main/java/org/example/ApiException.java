package org.example;

public class ApiException extends RuntimeException {
    public final int status;
    public ApiException(String message, int status) {
        this.status = status;
        super(message);
    }
}
