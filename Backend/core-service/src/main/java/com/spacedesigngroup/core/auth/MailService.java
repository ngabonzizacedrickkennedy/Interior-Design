package com.spacedesigngroup.core.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendOtpEmail(String toEmail, String fullName, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Your Space Design Group verification code");
        message.setText(
                "Hi " + fullName + ",\n\n" +
                "Your verification code is: " + otp + "\n\n" +
                "Enter this code to finish signing in. It expires in 10 minutes.\n\n" +
                "If you did not request this, you can ignore this email.\n\n" +
                "— Space Design Group"
        );
        mailSender.send(message);
    }

    public void sendManagerWelcomeEmail(String toEmail, String fullName, String password) {
        String loginLink = frontendUrl + "/portal/login";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Your Space Design Group manager account");
        message.setText(
                "Hi " + fullName + ",\n\n" +
                "An administrator has created a Project Manager account for you on Space Design Group.\n\n" +
                "Login URL: " + loginLink + "\n" +
                "Email: " + toEmail + "\n" +
                "Password: " + password + "\n\n" +
                "Please sign in and change your password as soon as possible.\n\n" +
                "— Space Design Group"
        );
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        String resetLink = frontendUrl + "/portal/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Reset your Space Design Group password");
        message.setText(
                "Hi " + fullName + ",\n\n" +
                "We received a request to reset your password. Click the link below to choose a new one:\n\n" +
                resetLink + "\n\n" +
                "This link expires in 30 minutes. If you did not request this, you can ignore this email.\n\n" +
                "— Space Design Group"
        );
        mailSender.send(message);
    }
}
