package br.gov.mt.seplag.artists_api.service;

import br.gov.mt.seplag.artists_api.domain.dto.ArtistaListRow;
import br.gov.mt.seplag.artists_api.domain.dto.ArtistaResponse;
import br.gov.mt.seplag.artists_api.domain.repository.AlbumRepository;
import br.gov.mt.seplag.artists_api.domain.repository.ArtistaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArtistaServiceTest {

    @Mock
    private ArtistaRepository artistaRepository;

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private MinioStorageService minioStorageService;

    @Test
    void buscarArtistas_semFiltro_deveUsarListarComTotalAlbuns_eMapearPresignedUrl() throws Exception {
        Pageable pageable = PageRequest.of(0, 10);
        LocalDateTime criadoEm = LocalDateTime.now();

        ArtistaListRow row = new Row(1, "Serj Tankian", "artistas/1.png", criadoEm, 3L);

        when(artistaRepository.listarComTotalAlbuns(pageable))
                .thenReturn(new PageImpl<>(List.of(row), pageable, 1));

        when(minioStorageService.generatePresignedUrl("artistas/1.png"))
                .thenReturn("http://minio/presigned/artistas/1.png");

        ArtistaService service = new ArtistaService(artistaRepository, albumRepository, minioStorageService);

        Page<ArtistaResponse> result = service.buscarArtistas(null, pageable);

        assertThat(result.getTotalElements()).isEqualTo(1);
        ArtistaResponse dto = result.getContent().get(0);

        assertThat(dto.getId()).isEqualTo(1);
        assertThat(dto.getNome()).isEqualTo("Serj Tankian");
        assertThat(dto.getFotoEndereco()).isEqualTo("http://minio/presigned/artistas/1.png");
        assertThat(dto.getTotalAlbuns()).isEqualTo(3L);

        verify(artistaRepository, times(1)).listarComTotalAlbuns(pageable);
        verify(artistaRepository, never()).listarComTotalAlbunsFiltrandoNome(any(), any());
        verify(minioStorageService, times(1)).generatePresignedUrl("artistas/1.png");
    }

    @Test
    void buscarArtistas_comFiltro_deveUsarListarComTotalAlbunsFiltrandoNome_eNaoChamarMinio() {
        Pageable pageable = PageRequest.of(0, 10);
        LocalDateTime criadoEm = LocalDateTime.now();

        ArtistaListRow row = new Row(2, "Mike Shinoda", null, criadoEm, 2L);

        when(artistaRepository.listarComTotalAlbunsFiltrandoNome("mike", pageable))
                .thenReturn(new PageImpl<>(List.of(row), pageable, 1));

        ArtistaService service = new ArtistaService(artistaRepository, albumRepository, minioStorageService);

        Page<ArtistaResponse> result = service.buscarArtistas("  mike  ", pageable);

        assertThat(result.getContent()).hasSize(1);
        ArtistaResponse dto = result.getContent().get(0);

        assertThat(dto.getId()).isEqualTo(2);
        assertThat(dto.getFotoEndereco()).isNull();
        assertThat(dto.getTotalAlbuns()).isEqualTo(2L);

        verify(artistaRepository, times(1)).listarComTotalAlbunsFiltrandoNome("mike", pageable);
        verify(artistaRepository, never()).listarComTotalAlbuns(any());
        verifyNoInteractions(minioStorageService);
    }

    private record Row(
            Integer id,
            String nome,
            String fotoEndereco,
            LocalDateTime criadoEm,
            Long totalAlbuns
    ) implements ArtistaListRow {
        @Override public Integer getId() { return id; }
        @Override public String getNome() { return nome; }
        @Override public String getFotoEndereco() { return fotoEndereco; }
        @Override public LocalDateTime getCriadoEm() { return criadoEm; }
        @Override public Long getTotalAlbuns() { return totalAlbuns; }
    }
}
