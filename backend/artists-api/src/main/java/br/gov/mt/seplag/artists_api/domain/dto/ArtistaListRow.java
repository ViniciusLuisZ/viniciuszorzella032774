package br.gov.mt.seplag.artists_api.domain.dto;

import java.time.LocalDateTime;

public interface ArtistaListRow {
    Integer getId();
    String getNome();
    String getFotoEndereco();
    LocalDateTime getCriadoEm();
    Long getTotalAlbuns();
}
