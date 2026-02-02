package br.gov.mt.seplag.artists_api.controller.v1;

import br.gov.mt.seplag.artists_api.domain.dto.LoginRequest;
import br.gov.mt.seplag.artists_api.security.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {



    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        String accessToken = jwtService.generateToken(
                request.nome(),
                "ACCESS",
                300_000 // 5 min
        );

        String refreshToken = jwtService.generateToken(
                request.nome(),
                "REFRESH",
                1_800_000 // 30 min
        );

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
    }

    @PostMapping("refresh")
    public Map<String, String> refresh(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);

        if (!jwtService.isRefreshToken(token)) {
            throw new RuntimeException("Token inválido para refresh");
        }

        String username = jwtService.getUsername(token);

        String newAccessToken = jwtService.generateToken(
                username,
                "ACCESS",
                300_000
        );

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", token
        );
    }



}
