package br.gov.mt.seplag.artists_api.controller.v1;

import br.gov.mt.seplag.artists_api.domain.dto.ArtistaResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import br.gov.mt.seplag.artists_api.service.ArtistaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/artistas")
public class ArtistaController {

    private final ArtistaService artistaService;

    public ArtistaController(ArtistaService artistaService) {
        this.artistaService = artistaService;
    }

    @GetMapping
    public ResponseEntity<Page<ArtistaResponse>> listar(
            @RequestParam(required = false) String nome,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                artistaService.buscarArtistas(nome, pageable)
        );
    }


    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        artistaService.deletarArtista(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArtistaResponse> update(
            @PathVariable Integer id,
            @RequestPart("name") String name,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(
                artistaService.atualizarArtista(id, name, image)
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArtistaResponse> create(
            @RequestPart("name") String name,
            @RequestPart("image") MultipartFile image
    ) {
        return ResponseEntity.ok(
                artistaService.criarArtista(name, image)
        );
    }

}
