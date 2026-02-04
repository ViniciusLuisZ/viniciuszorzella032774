package br.gov.mt.seplag.artists_api.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    @Test
    void deveGerarTokenValido_eExtrairUsername() {
        String token = jwtService.generateToken("usuário", "ACCESS", 60_000);

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.getUsername(token)).isEqualTo("usuário");
        assertThat(jwtService.isAccessToken(token)).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isFalse();
    }

    @Test
    void refreshToken_deveSerIdentificadoCorretamente() {
        String token = jwtService.generateToken("usuário", "REFRESH", 60_000);

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isTrue();
        assertThat(jwtService.isAccessToken(token)).isFalse();
    }
}
