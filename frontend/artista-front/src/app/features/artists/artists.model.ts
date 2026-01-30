export type Artista = {
  id: number;
  nome: string;
  fotoUrl?: string | null;
};

export type Album = {
  id: number;
  titulo: string;
  capaUrl?: string | null;
};

export type ArtistaCreate = {
  nome: string;
  image: File
};

export type ArtistaUpdate = {
  nome: string;
};
