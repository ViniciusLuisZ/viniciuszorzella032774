package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.dto.AlbumResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import br.gov.mt.seplag.artists_api.domain.repository.ArtistaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(AlbumService.class);

    @Autowired
    public AlbumService(AlbumRepository albumRepository, ArtistaRepository artistaRepository, MinioStorageService minioStorageService) {
        this.albumRepository = albumRepository;
        this.artistaRepository = artistaRepository;
        this.minioStorageService = minioStorageService;
    }


    @Transactional(readOnly = true)
    public AlbumResponse buscarPorId(Integer albumId) {

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));

        String capaUrl = null;

        if (album.getCapaEndereco() != null && !album.getCapaEndereco().isBlank()) {
            try {
                capaUrl = minioStorageService.generatePresignedUrl(album.getCapaEndereco());
            } catch (Exception e) {
                log.warn("Falha ao gerar URL da capa do álbum {}", albumId, e);
            }
        }

        return new AlbumResponse(
                album.getId(),
                album.getTitulo(),
                capaUrl,
                album.getCriadoEm()
        );
    }


    @Transactional
    public void deletarAlbum(Integer albumId) {

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));

        String capaEndereco = album.getCapaEndereco();

        albumRepository.delete(album);

        if (capaEndereco != null && !capaEndereco.isBlank()) {
            try {
                minioStorageService.delete(capaEndereco);
            } catch (Exception e) {
                log.warn(
                        "Falha ao remover capa do álbum {} no MinIO",
                        albumId,
                        e
                );
            }
        }
    }



    public Page<AlbumResponse> buscarAlbunsPorArtista(
            Integer artistaId,
            Pageable pageable
    ) {

        return albumRepository.findByArtistaId(artistaId, pageable)
                .map(album -> {

                    String capaUrl = null;

                    if (album.getCapaEndereco() != null) {
                        try {
                            capaUrl = minioStorageService.generatePresignedUrl(
                                    album.getCapaEndereco()
                            );
                        } catch (Exception e) {
                            capaUrl = null;
                        }
                    }

                    return new AlbumResponse(
                            album.getId(),
                            album.getTitulo(),
                            capaUrl,
                            album.getCriadoEm()
                    );
                });
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


    @Transactional
    public AlbumResponse atualizarAlbum(
            Integer albumId,
            String titulo,
            MultipartFile capa
    ) {

        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));

        album.atualizarTitulo(titulo);

        String capaAntiga = album.getCapaEndereco();

        if (capa != null && !capa.isEmpty()) {
            try {
                String novoEndereco = minioStorageService.upload(
                        capa,
                        "albuns/" + album.getArtista().getId()
                );

                album.atualizarCapa(novoEndereco);

                if (capaAntiga != null && !capaAntiga.isBlank()) {
                    try {
                        minioStorageService.delete(capaAntiga);
                    } catch (Exception e) {
                        log.warn("Falha ao remover capa antiga do álbum {}", albumId, e);
                    }
                }

            } catch (Exception e) {
                throw new RuntimeException("Erro ao atualizar capa do álbum", e);
            }
        }

        Album salvo = albumRepository.save(album);

        String capaUrl = null;
        if (salvo.getCapaEndereco() != null) {
            try {
                capaUrl = minioStorageService.generatePresignedUrl(
                        salvo.getCapaEndereco()
                );
            } catch (Exception e) {
                log.warn("Falha ao gerar URL da capa do álbum {}", albumId, e);
            }
        }

        return new AlbumResponse(
                salvo.getId(),
                salvo.getTitulo(),
                capaUrl,
                salvo.getCriadoEm()
        );
    }



}
