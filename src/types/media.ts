export interface MediaFile {
  id: string;
  filename: string;
  storedName: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  type: "image" | "video" | "document" | "code";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  tags: string[];
  projectId?: string;
  articleId?: string;
  albumId?: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaStore {
  files: MediaFile[];
}

export interface MediaListResponse {
  files: MediaFile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface MediaFilter {
  type?: string;
  search?: string;
  sort?: "date" | "size" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
