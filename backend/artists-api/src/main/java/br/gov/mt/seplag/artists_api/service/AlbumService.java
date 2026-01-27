package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.dto.AlbumResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import br.gov.mt.seplag.artists_api.domain.repository.ArtistaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistaRepository artistaRepository;
    private final MinioStorageService minioStorageService;

    @Autowired
    public AlbumService(AlbumRepository albumRepository, ArtistaRepository artistaRepository, MinioStorageService minioStorageService) {
        this.albumRepository = albumRepository;
        this.artistaRepository = artistaRepository;
        this.minioStorageService = minioStorageService;
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


    @Transactional
    public AlbumResponse criarAlbum(String titulo, Integer artistaId, MultipartFile capa) {

        Artista artista = artistaRepository.findById(artistaId)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));

        String capaEndereco;
        try {
            capaEndereco = minioStorageService.upload(capa, "albuns");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar capa do álbum", e);
        }

        Album album = new Album(titulo, capaEndereco, artista);

        Album salvo = albumRepository.save(album);

        String capaUrl;
        try {
            capaUrl = minioStorageService.generatePresignedUrl(salvo.getCapaEndereco());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar URL da capa", e);
        }

        return new AlbumResponse(
                salvo.getId(),
                salvo.getTitulo(),
                capaUrl,
                salvo.getCriadoEm()
        );
    }



}
