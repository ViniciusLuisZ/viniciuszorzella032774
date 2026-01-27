package br.gov.mt.seplag.artists_api.controller.v1;


import br.gov.mt.seplag.artists_api.domain.dto.AlbumResponse;
import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.service.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
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
    public Page<Album> getAlbunsByArtista(
            @PathVariable Integer artistaId,
            @PageableDefault(size = 10, sort = "titulo") Pageable pageable
    ) {
        return albumService.getAlbunsByArtista(artistaId, pageable);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        albumService.deletarAlbum(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AlbumResponse criar(
            @RequestPart("titulo") String titulo,
            @RequestPart("artistaId") Integer artistaId,
            @RequestPart("capa") MultipartFile capa
    ) {
        return albumService.criarAlbum(titulo, artistaId, capa);
    }


}
