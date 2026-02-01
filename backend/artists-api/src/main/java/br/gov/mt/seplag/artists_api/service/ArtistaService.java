package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.dto.ArtistaResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.domain.repository.ArtistaRepository;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class ArtistaService {

    private final ArtistaRepository artistaRepository;
    private final AlbumRepository albumRepository;
    private final MinioStorageService minioStorageService;

    @Autowired
    public ArtistaService(ArtistaRepository artistaRepository, AlbumRepository albumRepository, MinioStorageService minioStorageService) {
        this.artistaRepository = artistaRepository;
        this.albumRepository = albumRepository;
        this.minioStorageService = minioStorageService;
    }

    public Page<ArtistaResponse> buscarArtistas(Pageable pageable) {

        return artistaRepository.findAll(pageable)
                .map(artista -> {

                    String fotoUrl = null;

                    if (artista.getFotoEndereco() != null) {
                        try {
                            fotoUrl = minioStorageService.generatePresignedUrl(
                                    artista.getFotoEndereco()
                            );
                        } catch (Exception e) {
                            fotoUrl = null;
                        }
                    }

                    return new ArtistaResponse(
                            artista.getId(),
                            artista.getNome(),
                            fotoUrl,
                            artista.getCriadoEm()
                    );
                });
    }


    public Page<Artista> getAllArtistas(Pageable pageable) {
        return artistaRepository.findAll(pageable);
    }

    @Transactional
    public void deletarArtista(Integer artistaId) {

        Artista artista = artistaRepository.findById(artistaId)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));

        var albuns = albumRepository.findAllByArtistaId(artistaId); // veja nota abaixo
        for (Album album : albuns) {
            String capa = album.getCapaEndereco();
            if (capa != null && !capa.isBlank()) {
                try {
                    minioStorageService.delete(capa);
                } catch (Exception e) {
                    // não derruba a exclusão por causa do storage
                    // ideal: log.warn(...)
                }
            }
        }

        String foto = artista.getFotoEndereco();
        if (foto != null && !foto.isBlank()) {
            try {
                minioStorageService.delete(foto);
            } catch (Exception e) {
                // ideal: log.warn(...)
            }
        }

        artistaRepository.delete(artista);
    }

    public ArtistaResponse atualizarArtista(
            Integer id,
            String nome,
            MultipartFile image
    ) {

        try {
            Artista artista = artistaRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));

            artista.atualizarNome(nome);

            if (image != null && !image.isEmpty()) {

                String fotoAntiga = artista.getFotoEndereco();

                String novaFoto = minioStorageService.upload(
                        image,
                        "artistas"
                );

                artista.atualizarFoto(novaFoto);

                if (fotoAntiga != null && !fotoAntiga.isBlank()) {
                    minioStorageService.delete(fotoAntiga);
                }
            }

            Artista salvo = artistaRepository.save(artista);

            return new ArtistaResponse(
                    salvo.getId(),
                    salvo.getNome(),
                    salvo.getFotoEndereco(),
                    salvo.getCriadoEm()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar artista", e);
        }
    }


    public ArtistaResponse criarArtista(String nome, MultipartFile image) {

        try {
            String fotoEndereco = minioStorageService.upload(image, "artistas");

            Artista artista = new Artista(nome, fotoEndereco);
            Artista salvo = artistaRepository.save(artista);

            return new ArtistaResponse(
                    salvo.getId(),
                    salvo.getNome(),
                    salvo.getFotoEndereco(),
                    salvo.getCriadoEm()
            );

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem do artista", e);
        }
    }



}
