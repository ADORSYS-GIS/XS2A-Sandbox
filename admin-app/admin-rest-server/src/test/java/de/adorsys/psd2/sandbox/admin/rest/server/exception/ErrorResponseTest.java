package de.adorsys.psd2.sandbox.admin.rest.server.exception;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ErrorResponseTest {
    private static final String CODE = "code";
    private static final String MESSAGE = "message";
    private static final String DATE_TIME = "dateTime";
    private final ErrorResponse errorResponse = new ErrorResponse();

    @Test
    void buildContent() {
        //When
        Map<String, String> actual = errorResponse.buildContent(500, "error message");

        //Then
        assertEquals("error message", actual.get(MESSAGE));
        assertEquals("500", actual.get(CODE));
        assertNotNull(actual.get(DATE_TIME));
    }
}
