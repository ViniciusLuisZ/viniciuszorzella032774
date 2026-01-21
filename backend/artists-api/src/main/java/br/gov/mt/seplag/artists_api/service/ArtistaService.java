package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.domain.repository.ArtistaRepository;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ArtistaService {

    private final ArtistaRepository artistaRepository;
    private final AlbumRepository albumRepository;

    @Autowired
    public ArtistaService(ArtistaRepository artistaRepository, AlbumRepository albumRepository) {
        this.artistaRepository = artistaRepository;
        this.albumRepository = albumRepository;
    }

    public Page<Artista> getAllArtistas(Pageable pageable) {
        return artistaRepository.findAll(pageable);
    }

    public Page<Album> getAlbunsByArtista(Integer artistaId, Pageable pageable) {
        return albumRepository.findByArtistaId(artistaId, pageable);
    }

}
