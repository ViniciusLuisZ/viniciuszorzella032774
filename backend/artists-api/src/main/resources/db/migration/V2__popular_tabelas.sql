-- =========================
-- artistas (20)
-- =========================
INSERT INTO artistas (nome) VALUES
                               ('Serj Tankian'),
                               ('Mike Shinoda'),
                               ('Michel Teló'),
                               ('Guns N’ Roses'),
                               ('Linkin Park'),
                               ('Metallica'),
                               ('Red Hot Chili Peppers'),
                               ('Foo Fighters'),
                               ('Pearl Jam'),
                               ('Nirvana'),
                               ('Eminem'),
                               ('Drake'),
                               ('Coldplay'),
                               ('Imagine Dragons'),
                               ('Queen'),
                               ('U2'),
                               ('Pink Floyd'),
                               ('AC/DC'),
                               ('Iron Maiden'),
                               ('Bon Jovi')
    ON CONFLICT DO NOTHING;

-- =========================
-- ALBUNS
-- =========================

-- Serj Tankian
INSERT INTO albuns (titulo, artista_id)
SELECT 'Harakiri', id FROM artistas WHERE nome = 'Serj Tankian'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Black Blooms', id FROM artistas WHERE nome = 'Serj Tankian'
    ON CONFLICT DO NOTHING;

-- Mike Shinoda
INSERT INTO albuns (titulo, artista_id)
SELECT 'Post Traumatic', id FROM artistas WHERE nome = 'Mike Shinoda'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Rising Tied', id FROM artistas WHERE nome = 'Mike Shinoda'
    ON CONFLICT DO NOTHING;

-- Michel Teló
INSERT INTO albuns (titulo, artista_id)
SELECT 'Bem Sertanejo', id FROM artistas WHERE nome = 'Michel Teló'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Bem Sertanejo - O Show (Ao Vivo)', id FROM artistas WHERE nome = 'Michel Teló'
    ON CONFLICT DO NOTHING;

-- Guns N’ Roses
INSERT INTO albuns (titulo, artista_id)
SELECT 'Use Your Illusion I', id FROM artistas WHERE nome = 'Guns N’ Roses'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Use Your Illusion II', id FROM artistas WHERE nome = 'Guns N’ Roses'
    ON CONFLICT DO NOTHING;

-- Linkin Park
INSERT INTO albuns (titulo, artista_id)
SELECT 'Hybrid Theory', id FROM artistas WHERE nome = 'Linkin Park'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Meteora', id FROM artistas WHERE nome = 'Linkin Park'
    ON CONFLICT DO NOTHING;

-- Metallica
INSERT INTO albuns (titulo, artista_id)
SELECT 'Master of Puppets', id FROM artistas WHERE nome = 'Metallica'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Ride the Lightning', id FROM artistas WHERE nome = 'Metallica'
    ON CONFLICT DO NOTHING;

-- Red Hot Chili Peppers
INSERT INTO albuns (titulo, artista_id)
SELECT 'Californication', id FROM artistas WHERE nome = 'Red Hot Chili Peppers'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'By the Way', id FROM artistas WHERE nome = 'Red Hot Chili Peppers'
    ON CONFLICT DO NOTHING;

-- Foo Fighters
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Colour and the Shape', id FROM artistas WHERE nome = 'Foo Fighters'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Echoes, Silence, Patience & Grace', id FROM artistas WHERE nome = 'Foo Fighters'
    ON CONFLICT DO NOTHING;

-- Pearl Jam
INSERT INTO albuns (titulo, artista_id)
SELECT 'Ten', id FROM artistas WHERE nome = 'Pearl Jam'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Vs.', id FROM artistas WHERE nome = 'Pearl Jam'
    ON CONFLICT DO NOTHING;

-- Nirvana
INSERT INTO albuns (titulo, artista_id)
SELECT 'Nevermind', id FROM artistas WHERE nome = 'Nirvana'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'In Utero', id FROM artistas WHERE nome = 'Nirvana'
    ON CONFLICT DO NOTHING;

-- Eminem
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Marshall Mathers LP', id FROM artistas WHERE nome = 'Eminem'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Eminem Show', id FROM artistas WHERE nome = 'Eminem'
    ON CONFLICT DO NOTHING;

-- Drake
INSERT INTO albuns (titulo, artista_id)
SELECT 'Scorpion', id FROM artistas WHERE nome = 'Drake'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Certified Lover Boy', id FROM artistas WHERE nome = 'Drake'
    ON CONFLICT DO NOTHING;

-- Coldplay
INSERT INTO albuns (titulo, artista_id)
SELECT 'Parachutes', id FROM artistas WHERE nome = 'Coldplay'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'A Rush of Blood to the Head', id FROM artistas WHERE nome = 'Coldplay'
    ON CONFLICT DO NOTHING;

-- Imagine Dragons
INSERT INTO albuns (titulo, artista_id)
SELECT 'Night Visions', id FROM artistas WHERE nome = 'Imagine Dragons'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Evolve', id FROM artistas WHERE nome = 'Imagine Dragons'
    ON CONFLICT DO NOTHING;

-- Queen
INSERT INTO albuns (titulo, artista_id)
SELECT 'A Night at the Opera', id FROM artistas WHERE nome = 'Queen'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'News of the World', id FROM artistas WHERE nome = 'Queen'
    ON CONFLICT DO NOTHING;

-- U2
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Joshua Tree', id FROM artistas WHERE nome = 'U2'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Achtung Baby', id FROM artistas WHERE nome = 'U2'
    ON CONFLICT DO NOTHING;

-- Pink Floyd
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Dark Side of the Moon', id FROM artistas WHERE nome = 'Pink Floyd'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Wish You Were Here', id FROM artistas WHERE nome = 'Pink Floyd'
    ON CONFLICT DO NOTHING;

-- AC/DC
INSERT INTO albuns (titulo, artista_id)
SELECT 'Back in Black', id FROM artistas WHERE nome = 'AC/DC'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Highway to Hell', id FROM artistas WHERE nome = 'AC/DC'
    ON CONFLICT DO NOTHING;

-- Iron Maiden
INSERT INTO albuns (titulo, artista_id)
SELECT 'The Number of the Beast', id FROM artistas WHERE nome = 'Iron Maiden'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'Powerslave', id FROM artistas WHERE nome = 'Iron Maiden'
    ON CONFLICT DO NOTHING;

-- Bon Jovi
INSERT INTO albuns (titulo, artista_id)
SELECT 'Slippery When Wet', id FROM artistas WHERE nome = 'Bon Jovi'
    ON CONFLICT DO NOTHING;
INSERT INTO albuns (titulo, artista_id)
SELECT 'New Jersey', id FROM artistas WHERE nome = 'Bon Jovi'
    ON CONFLICT DO NOTHING;
