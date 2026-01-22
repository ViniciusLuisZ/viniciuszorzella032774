package br.gov.mt.seplag.artists_api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artistas")
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(
            mappedBy = "artista",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private List<Album> albuns = new ArrayList<>();

    protected Artista() {}

}