package org.example;

import java.nio.charset.StandardCharsets;
import java.util.Map;

public class Response {
    private String body;
    private String contentType;
    private int status;
    private final Map<Integer, String> statusMap = Map.of(
            200, "OK",
            400, "Bad Request",
            404, "Not Found",
            405, "Method Not Allowed",
            500, "Internal Server Error"
    );

    public void setBody(String body) {
        this.body = body;
    }

    public String getBody() {
        return body;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentType() {
        return contentType;
    }

    public Response(int status, String type) {
        this.status = status;
        this.contentType = type;
    }

    public Response(int status, String type, String body) {
        this(status, type);
        this.body = body;
    }

    public void write() {
        var bytes = body.getBytes(StandardCharsets.UTF_8);
        String builder =
                "Status: " + status + " " +
                statusMap.getOrDefault(status, "") + "\r\n" +
                "Content-Type: " + contentType + "; charset=UTF-8\r\n" +
                "Content-Length: " + bytes.length + "\r\n\r\n" +
                body;
        System.out.print(builder);
        System.out.flush();
    }
}
