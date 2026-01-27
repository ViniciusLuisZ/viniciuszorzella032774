package br.gov.mt.seplag.artists_api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "albuns")
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(name = "capa_endereco", length = 255)
    private String capaEndereco;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artista_id", nullable = false)
    private Artista artista;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected Album() {}


    public Album(String titulo, String capaEndereco, Artista artista) {
        this.titulo = titulo;
        this.capaEndereco = capaEndereco;
        this.artista = artista;
        this.criadoEm = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getCapaEndereco() {
        return capaEndereco;
    }

    public Artista getArtista() {
        return artista;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

}