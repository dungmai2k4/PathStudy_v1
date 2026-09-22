package com.studypath.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PaymentServiceApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(PaymentServiceApplication.class, args);
    }

    private static void loadDotEnv() {
        java.nio.file.Path[] candidatePaths = new java.nio.file.Path[]{
                java.nio.file.Paths.get(".env"),
                java.nio.file.Paths.get("services/payment-service/.env"),
                java.nio.file.Paths.get("../services/payment-service/.env")
        };
        for (java.nio.file.Path path : candidatePaths) {
            if (java.nio.file.Files.exists(path)) {
                try {
                    java.util.List<String> lines = java.nio.file.Files.readAllLines(path);
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (!trimmed.isEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
                            String[] parts = trimmed.split("=", 2);
                            String key = parts[0].trim();
                            String value = parts[1].trim();
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    break;
                } catch (Exception ignored) {
                }
            }
        }
    }
}
