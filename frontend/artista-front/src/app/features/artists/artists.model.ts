export type Artista = {
  id: number;
  nome: string;
  fotoEndereco?: string | null;
  totalAlbuns: number;
};

export type ArtistaCreate = {
  nome: string;
  image: File
};
