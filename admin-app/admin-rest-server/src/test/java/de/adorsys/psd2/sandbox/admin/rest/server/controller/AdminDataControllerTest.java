package de.adorsys.psd2.sandbox.admin.rest.server.controller;

import de.adorsys.psd2.sandbox.admin.rest.server.service.IbanGenerationService;
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
class AdminDataControllerTest {
    private static final String TPP_ID = "AT_666";
    private static final String IBAN = "DE32760700240271232100";

    @InjectMocks
    private AdminDataController adminDataController;
    @Mock
    private IbanGenerationService ibanGenerationService;

    @Test
    void generateIban() {
        // Given
        when(ibanGenerationService.generateNextIban(TPP_ID)).thenReturn(IBAN);

        // When
        ResponseEntity<String> response = adminDataController.generateIban(TPP_ID);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(IBAN, response.getBody());
    }
}
