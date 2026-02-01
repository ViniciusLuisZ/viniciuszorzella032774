export type Artista = {
  id: number;
  nome: string;
  fotoEndereco?: string | null;
};

export type ArtistaCreate = {
  nome: string;
  image: File
};
