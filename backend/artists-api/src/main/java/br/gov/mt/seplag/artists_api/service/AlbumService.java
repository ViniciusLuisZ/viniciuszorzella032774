package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;

    @Autowired
    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    public void deletarAlbum(Integer albumId) {

        if (!albumRepository.existsById(albumId)) {
            throw new EntityNotFoundException("Álbum não encontrado");
        }

        albumRepository.deleteById(albumId);
    }

    public Page<Album> getAlbunsByArtista(Integer artistaId, Pageable pageable) {
        return albumRepository.findByArtistaId(artistaId, pageable);
    }

}
