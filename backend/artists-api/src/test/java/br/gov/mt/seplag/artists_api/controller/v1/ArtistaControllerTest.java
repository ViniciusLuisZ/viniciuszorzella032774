package br.gov.mt.seplag.artists_api.controller.v1;

import br.gov.mt.seplag.artists_api.domain.dto.ArtistaResponse;
import br.gov.mt.seplag.artists_api.service.ArtistaService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ArtistaController.class)
@AutoConfigureMockMvc(addFilters = false)
class ArtistaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ArtistaService artistaService;

    @Test
    void listar_deveRetornarPaginaComTotalAlbuns() throws Exception {
        LocalDateTime criadoEm = LocalDateTime.now();

        var dto = new ArtistaResponse(
                1,
                "Serj Tankian",
                "http://minio/presigned/artistas/1.png",
                criadoEm,
                3L
        );

        var pageable = PageRequest.of(0, 10);

        Mockito.when(artistaService.buscarArtistas(eq("serj"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(dto), pageable, 1));

        mockMvc.perform(get("/api/v1/artistas")
                        .param("nome", "serj")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].nome").value("Serj Tankian"))
                .andExpect(jsonPath("$.content[0].totalAlbuns").value(3));
    }
}
