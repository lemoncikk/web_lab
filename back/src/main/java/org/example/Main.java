package org.example;

import com.fastcgi.FCGIInterface;

import java.nio.charset.StandardCharsets;

public class Main {
    static void main() {
        var fcgiInterface = new FCGIInterface();
        while (true) {
            try {
                if (fcgiInterface.FCGIaccept() < 0) break;
                var content = """
                <html>
                    <head><title>Java FastCGI Hello World</title></head>
                    <body><h1>Hello, World!</h1></body>
                </html>""";
                var httpResponse = """
                Status: 200 OK
                Content-Type: text/html
                Content-Length: %d
                
                %s
                """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
                System.out.println(httpResponse);
                System.out.flush();
            } catch (RuntimeException e) {
                continue;
            }
        }
    }
}
