package br.gov.mt.seplag.artists_api.controller.v1;


import br.gov.mt.seplag.artists_api.domain.dto.AlbumResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.service.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/albuns")
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }



    @GetMapping("/{artistaId}/artistas")
    public Page<AlbumResponse> getAlbunsByArtista(
            @PathVariable Integer artistaId,
            @PageableDefault(size = 10, sort = "titulo") Pageable pageable
    ) {
        return albumService.buscarAlbunsPorArtista(artistaId, pageable);
    }

    @GetMapping("/{id}")
    public AlbumResponse buscarPorId(@PathVariable Integer id) {
        return albumService.buscarPorId(id);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Integer id) {
        albumService.deletarAlbum(id);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public AlbumResponse atualizar(
            @PathVariable Integer id,
            @RequestPart("titulo") String titulo,
            @RequestPart(value = "capa", required = false) MultipartFile capa
    ) {
        return albumService.atualizarAlbum(id, titulo, capa);
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AlbumResponse> criar(
            @RequestParam("titulo") String titulo,
            @RequestParam("artistaId") Integer artistaId,
            @RequestPart("capa") MultipartFile capa
    ) {
        return ResponseEntity.ok(albumService.criarAlbum(titulo, artistaId, capa));
    }


}
