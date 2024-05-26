export interface NewsArticle {
  author: string;
  created_at: string;
  created_at_i: string;
  num_comments: string;
  objectID: string;
  points: string;
  story_id: string;
  title: string;
  updated_at: string;
  url: string;
}

export interface ApiResponse {
  hits: NewsArticle[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
  processingTimeMS: number;
}
