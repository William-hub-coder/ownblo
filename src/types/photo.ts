export interface Album {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover_url?: string;
  sort_order: number;
  created_at: string;
}

export interface Photo {
  id: string;
  album_id?: string;
  title?: string;
  url: string;
  thumbnail_url?: string;
  camera_model?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  focal_length?: string;
  taken_at?: string;
  width?: number;
  height?: number;
  sort_order: number;
  created_at: string;
}
