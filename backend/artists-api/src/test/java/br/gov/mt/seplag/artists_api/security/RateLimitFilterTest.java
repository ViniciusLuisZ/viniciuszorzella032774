package br.gov.mt.seplag.artists_api.security;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RateLimitFilterTest {

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void devePermitir10ReqPorMinuto_eNegarAPartirDa11() throws Exception {
        RateLimitFilter filter = new RateLimitFilter();
        FilterChain chain = mock(FilterChain.class);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/v1/artistas");
        MockHttpServletResponse res = new MockHttpServletResponse();

        var auth = new UsernamePasswordAuthenticationToken("usuário", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // 10 ok
        for (int i = 0; i < 10; i++) {
            filter.doFilter(req, res, chain);
        }

        verify(chain, times(10)).doFilter(any(), any());

        // 11a deve bloquear
        MockHttpServletResponse res11 = new MockHttpServletResponse();
        filter.doFilter(req, res11, chain);

        assertThat(res11.getStatus()).isEqualTo(429);
    }
}
