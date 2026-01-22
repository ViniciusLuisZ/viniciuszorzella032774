package br.gov.mt.seplag.artists_api.controller.v1;

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
    public Map<String, String> login(@RequestParam String nome, @RequestParam String senha) {
        String token = jwtService.generateToken(nome);
        return Map.of("token", token);
    }

    @PostMapping("refresh")
    public Map<String, String> refresh(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtService.getUsername(token);
        return Map.of("token", jwtService.generateToken(username));
    }
}
