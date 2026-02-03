package br.gov.mt.seplag.artists_api.domain.repository;

import br.gov.mt.seplag.artists_api.domain.dto.ArtistaListRow;
import br.gov.mt.seplag.artists_api.domain.entity.Artista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArtistaRepository extends JpaRepository<Artista, Integer> {
    @Query("""
        select 
          a.id as id,
          a.nome as nome,
          a.fotoEndereco as fotoEndereco,
          a.criadoEm as criadoEm,
          count(al.id) as totalAlbuns
        from Artista a
        left join Album al on al.artista.id = a.id
        group by a.id, a.nome, a.fotoEndereco, a.criadoEm
    """)
    Page<ArtistaListRow> listarComTotalAlbuns(Pageable pageable);

    @Query("""
        select 
          a.id as id,
          a.nome as nome,
          a.fotoEndereco as fotoEndereco,
          a.criadoEm as criadoEm,
          count(al.id) as totalAlbuns
        from Artista a
        left join Album al on al.artista.id = a.id
        where lower(a.nome) like lower(concat('%', :nome, '%'))
        group by a.id, a.nome, a.fotoEndereco, a.criadoEm
    """)
    Page<ArtistaListRow> listarComTotalAlbunsFiltrandoNome(@Param("nome") String nome, Pageable pageable);
}