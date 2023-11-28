package de.adorsys.psd2.sandbox.admin.rest.server.controller;

import de.adorsys.ledgers.middleware.client.rest.ScaVerificationRestClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminEmailVerificationControllerTest {
    private static final String EMAIL = "email";
    private static final String TOKEN = "token";

    @InjectMocks
    private AdminEmailVerificationController emailVerificationController;
    @Mock
    private ScaVerificationRestClient scaVerificationRestClient;


    @Test
    void sendEmailVerification() {
        // Given
        when(scaVerificationRestClient.sendEmailVerification(EMAIL)).thenReturn(ResponseEntity.ok().build());

        // When
        ResponseEntity<Void> response = emailVerificationController.sendEmailVerification(EMAIL);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void confirmVerificationToken() {
        // Given
        when(scaVerificationRestClient.confirmVerificationToken(TOKEN)).thenReturn(ResponseEntity.ok().build());

        // When
        ResponseEntity<Void> response = emailVerificationController.confirmVerificationToken(TOKEN);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
