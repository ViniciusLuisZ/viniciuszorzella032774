package br.gov.mt.seplag.artists_api.domain.dto;

import java.time.LocalDateTime;

public class AlbumResponse {

    private Integer id;
    private String titulo;
    private String capaUrl;
    private LocalDateTime criadoEm;

    public AlbumResponse(Integer id, String titulo, String capaUrl, LocalDateTime criadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.capaUrl = capaUrl;
        this.criadoEm = criadoEm;
    }

    public Integer getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getCapaUrl() {
        return capaUrl;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}