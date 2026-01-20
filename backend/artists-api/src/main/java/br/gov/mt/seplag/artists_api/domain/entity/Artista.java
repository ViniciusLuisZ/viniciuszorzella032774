package br.gov.mt.seplag.artists_api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "artistas")
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected Artista() {}

}