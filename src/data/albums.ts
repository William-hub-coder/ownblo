import albumsData from "./albums.json";

export interface AlbumPhoto {
  id: string;
  title: string;
  url: string;
  camera?: string;
  aperture?: string;
  shutter?: string;
  iso?: number;
  taken?: string;
}

export interface AlbumData {
  title: string;
  description: string;
  photos: AlbumPhoto[];
}

type AlbumRecord = {
  slug: string;
  title: string;
  description: string;
  photos: AlbumPhoto[];
};

const list = albumsData as AlbumRecord[];
const record: Record<string, AlbumData> = {};
for (const item of list) {
  const { slug, ...data } = item;
  record[slug] = data;
}

export const albumData = record;

export const albumList = list.map(({ slug, title, description, photos }) => ({
  slug,
  title,
  description,
  photoCount: photos.length,
}));
