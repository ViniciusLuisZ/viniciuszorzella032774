package br.gov.mt.seplag.artists_api.domain.dto;

import org.springframework.web.multipart.MultipartFile;

public class ArtistaCreateRequest {

    private String nome;
    private MultipartFile foto;

    public String getNome() {
        return nome;
    }

    public MultipartFile getFoto() {
        return foto;
    }
}