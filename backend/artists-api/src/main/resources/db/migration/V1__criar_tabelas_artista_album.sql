CREATE TABLE artistas (
                          id SERIAL PRIMARY KEY,
                          nome VARCHAR(200) NOT NULL,
                          foto VARCHAR(255),
                          criado_em TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE albuns (
                       id SERIAL PRIMARY KEY,
                       titulo VARCHAR(200) NOT NULL,
                       capa VARCHAR(255),
                       artista_id INTEGER NOT NULL,
                       criado_em TIMESTAMP NOT NULL DEFAULT now(),
                       CONSTRAINT fk_album_artista FOREIGN KEY (artista_id) REFERENCES artistas(id)
);
