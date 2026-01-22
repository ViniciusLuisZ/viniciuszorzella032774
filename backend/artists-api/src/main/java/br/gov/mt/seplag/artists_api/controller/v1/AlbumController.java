package br.gov.mt.seplag.artists_api.controller.v1;


import br.gov.mt.seplag.artists_api.domain.entity.Album;
import br.gov.mt.seplag.artists_api.service.AlbumService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

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

}
