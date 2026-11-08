package org.example;

import com.fastcgi.FCGIInterface;
import org.json.JSONObject;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;

public class Main {
    static void main() {
        var fcgiInterface = new FCGIInterface();
        var startTime = Instant.now();
        while (true) {
            try {
                if (fcgiInterface.FCGIaccept() < 0) break;
                var params = FCGIInterface.request.params;
                var method = params.getProperty("REQUEST_METHOD", "GET");
                var query = parseQuery(params.getProperty("QUERY_STRING", ""));
                var content = new JSONObject();
                content.put("isHit", false);
                content.put("time", LocalDateTime.now());
                content.put("uptime", Duration.between(startTime, Instant.now()).toSeconds());
                respond(200, "application/json", content.toString());
            } catch (RuntimeException e) {
                e.printStackTrace();
                continue;
            }
        }
    }

    static HashMap<String, String> parseQuery(String s) {
        var map = new HashMap<String, String>();
        if (s.isEmpty()) return map;
        for (var pair : s.split("&")) {
            var kv = pair.split("=", 2);
            map.put(URLDecoder.decode(kv[0], StandardCharsets.UTF_8),
                    (kv.length > 1) ? URLDecoder.decode(kv[1], StandardCharsets.UTF_8) : "");
        }
        return map;
    }

    static void respond(int status, String type, String body) {
        var bytes = body.getBytes(StandardCharsets.UTF_8);
        var builder = new StringBuilder();
        builder.append("Status: ").append(status).append("\r\n")
                .append("Content-Type: ").append(type)
                .append("; charset=UTF-8\r\n")
                .append("Content-Length: ").append(bytes.length).append("\r\n\r\n")
                .append(body);
        System.out.print(builder.toString());
        System.out.flush();
    }
}
