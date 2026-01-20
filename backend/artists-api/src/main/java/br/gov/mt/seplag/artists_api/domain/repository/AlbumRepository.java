package br.gov.mt.seplag.artists_api.domain.repository;

import br.gov.mt.seplag.artists_api.domain.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Integer> {
    Page<Album> findByArtistaId(Integer artistaId, Pageable pageable);
}