export type Team = {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo_url?: string;
};

export type Game = {
  id: string;
  home_team: Team;
  away_team: Team;
  home_score?: number;
  away_score?: number;
  game_date: string;
  season: string;
  arena: string;
  status: string;
  image_url?: string;
  rating?: number | null;
  review_count?: number | null;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorUsername: string;
  games: any[];
  createdAt: string;
  isPublic: boolean;
};