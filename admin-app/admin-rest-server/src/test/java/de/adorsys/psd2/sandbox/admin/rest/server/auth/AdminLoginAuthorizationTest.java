package de.adorsys.psd2.sandbox.admin.rest.server.auth;

import de.adorsys.ledgers.middleware.api.domain.um.AccessTokenTO;
import de.adorsys.ledgers.middleware.api.domain.um.BearerTokenTO;
import de.adorsys.ledgers.middleware.api.domain.um.UserRoleTO;
import de.adorsys.psd2.sandbox.admin.rest.api.resource.AdminBaseRestApi;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdminLoginAuthorizationTest {
    private final AdminLoginAuthorization adminLoginAuthorization =  new AdminLoginAuthorization();

    @Test
    void canLogin_true() {
        //When
        boolean actual = adminLoginAuthorization.canLogin(getBearerTokenObject(UserRoleTO.SYSTEM));

        //Then
        assertTrue(actual);
    }

    @Test
    void canLogin_false() {
        //When
        boolean actual = adminLoginAuthorization.canLogin(getBearerTokenObject(UserRoleTO.STAFF));

        //Then
        assertFalse(actual);
    }

    private BearerTokenTO getBearerTokenObject(UserRoleTO userRole) {
        BearerTokenTO bearerTokenTO =  new BearerTokenTO();
        AccessTokenTO accessTokenTO = new AccessTokenTO();
        accessTokenTO.setRole(userRole);
        bearerTokenTO.setAccessTokenObject(accessTokenTO);
        return bearerTokenTO;
    }
}
