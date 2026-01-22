package br.gov.mt.seplag.artists_api.controller.v1;

import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.service.ArtistaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/artistas")
public class ArtistaController {

    private final ArtistaService artistaService;

    public ArtistaController(ArtistaService artistaService) {
        this.artistaService = artistaService;
    }

    @GetMapping
    public Page<Artista> getAllArtistas(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable
    ) {
        return artistaService.getAllArtistas(pageable);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        artistaService.deletarArtista(id);
    }

}
