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

    @Column(name = "foto_endereco", length = 255)
    private String fotoEndereco;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(
            mappedBy = "artista",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private List<Album> albuns = new ArrayList<>();

    protected Artista() {}

    public Artista(String nome, String fotoEndereco) {
        this.nome = nome;
        this.fotoEndereco = fotoEndereco;
        this.criadoEm = LocalDateTime.now();
    }

    // getters
    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getFotoEndereco() {
        return fotoEndereco;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public List<Album> getAlbuns() {
        return albuns;
    }

    public void atualizarNome(String nome) {
        this.nome = nome;
    }

    public void atualizarFoto(String fotoEndereco) {
        this.fotoEndereco = fotoEndereco;
    }

}