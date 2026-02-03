package br.gov.mt.seplag.artists_api.domain.dto;

import java.time.LocalDateTime;

public class ArtistaResponse {

    private Integer id;
    private String nome;
    private String fotoEndereco;
    private LocalDateTime criadoEm;

    private Long totalAlbuns;

    public ArtistaResponse(Integer id, String nome, String fotoEndereco, LocalDateTime criadoEm, Long totalAlbuns) {
        this.id = id;
        this.nome = nome;
        this.fotoEndereco = fotoEndereco;
        this.criadoEm = criadoEm;
        this.totalAlbuns = totalAlbuns;
    }

    public ArtistaResponse(Integer id, String nome, String fotoEndereco, LocalDateTime criadoEm) {
        this(id, nome, fotoEndereco, criadoEm, 0L);
    }

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
    public Long getTotalAlbuns() { return totalAlbuns; }

}