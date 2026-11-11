package org.example;

import com.fastcgi.FCGIInterface;
import org.json.JSONObject;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Properties;

public class Main {
    private static final String URL_PATH = "/fcgi-bin/";
    static void main() {
        var fcgiInterface = new FCGIInterface();
        var startTime = Instant.now();
        while (true) {
            try {
                if (fcgiInterface.FCGIaccept() < 0) break;
                var body = handle(FCGIInterface.request.params);
                body.put("time", LocalDateTime.now());
                body.put("uptime", Duration.between(startTime, Instant.now()).toSeconds());

                var res = new Response(200, ContentType.APPLICATION_JSON);
                res.setBody(body.toString());
                res.write();
            }
            catch (ApiException e) {
                var res = new Response(e.status, ContentType.APPLICATION_JSON);
                var body = new JSONObject();
                if (e.status >= 500) {
                    body.put("error", "Internal server error");
                } else {
                    body.put("error", e.getMessage());
                }
                res.setBody(body.toString());
                res.write();
            }
            catch (RuntimeException e) {
                System.err.print(e.getMessage());
                var res = new Response(500, ContentType.APPLICATION_JSON);
                res.setBody(new JSONObject().put("error", "Internal server error").toString());
                res.write();
            }
        }
    }

    private static HashMap<String, String> parseQuery(String s) {
        var map = new HashMap<String, String>();
        if (s.isEmpty()) return map;
        for (var pair : s.split("&")) {
            var kv = pair.split("=", 2);
            map.put(URLDecoder.decode(kv[0], StandardCharsets.UTF_8),
                    (kv.length > 1) ? URLDecoder.decode(kv[1], StandardCharsets.UTF_8) : "");
        }
        return map;
    }

    private static boolean isHit(Validator.Params p) {
        var x = p.x();
        var y = p.y();
        var r = p.r();
        return (y+((double) 1 /2)*x+r>=0 && y<=0 && x<=0 && x >= -2*r)
                || (y <= r && y>=0 && x <= r/2 && x >= 0)
                || (x*x + y*y <= r*r && x > 0 && y < 0);
    }

    private static JSONObject handle(Properties p) {
        if (!"get".equalsIgnoreCase(p.getProperty("REQUEST_METHOD"))) {
            throw new ApiException("Only GET is allowed", 405);
        }

        if (!URL_PATH.equalsIgnoreCase(p.getProperty("DOCUMENT_URI"))) {
            throw new ApiException("Page not found", 404);
        }

        var q = parseQuery(p.getProperty("QUERY_STRING", ""));
        var params = Validator.parse(q);
        var isHit = isHit(params);
        var body = new JSONObject();
        body.put("isHit", isHit);
        return body;
    }

}
