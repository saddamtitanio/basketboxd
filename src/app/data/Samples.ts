export interface Player {
  id: string;
  full_name: string;
  jersey_number: number;
  position: string;
  team_id: string;
  image_url?: string;
  pts?: number;
  ast?: number;
  reb?: number;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo_url?: string;
}

export interface Game {
  id: string;
  home_team: Team;
  away_team: Team;
  home_score?: number;
  away_score?: number;
  game_date: string;
  season: string;
  arena: string;
  status: 'live' | 'final' | 'upcoming' | 'halftime' | '1st' | '2nd' | '3rd' | '4th';
  home_players?: Player[];
  away_players?: Player[];
  watchability: number;
  rating: number;
  image_url: string;
  period?: string;
  top_scorer?: string;
}

export const sampleTeams: Team[] = [
  { id: '1', name: 'Lakers', city: 'Los Angeles', abbreviation: 'LAL', logo_url: 'https://example.com/lakers.png' },
  { id: '2', name: 'Warriors', city: 'Golden State', abbreviation: 'GSW', logo_url: 'https://example.com/warriors.png' },
  { id: '3', name: 'Celtics', city: 'Boston', abbreviation: 'BOS', logo_url: 'https://example.com/celtics.png' },
  { id: '4', name: 'Bucks', city: 'Milwaukee', abbreviation: 'MIL', logo_url: 'https://example.com/bucks.png' },
  { id: '5', name: 'Suns', city: 'Phoenix', abbreviation: 'PHX', logo_url: 'https://example.com/suns.png' },
  { id: '6', name: 'Nuggets', city: 'Denver', abbreviation: 'DEN', logo_url: 'https://example.com/nuggets.png' },
];

export const samplePlayers: Player[] = [
  { id: '1', full_name: 'LeBron James', jersey_number: 23, position: 'SF', team_id: '1', image_url: 'https://example.com/lebron.jpg' },
  { id: '2', full_name: 'Stephen Curry', jersey_number: 30, position: 'PG', team_id: '2', image_url: 'https://example.com/curry.jpg' },
  { id: '3', full_name: 'Jayson Tatum', jersey_number: 0, position: 'SF', team_id: '3', image_url: 'https://example.com/tatum.jpg' },
  { id: '4', full_name: 'Giannis Antetokounmpo', jersey_number: 34, position: 'PF', team_id: '4', image_url: 'https://example.com/giannis.jpg' },
  { id: '5', full_name: 'Kevin Durant', jersey_number: 35, position: 'SF', team_id: '5', image_url: 'https://example.com/durant.jpg' },
  { id: '6', full_name: 'Nikola Jokic', jersey_number: 15, position: 'C', team_id: '6', image_url: 'https://example.com/jokic.jpg' },
];

export const sampleGames: Game[] = [
  {
    id: '1',
    home_team: sampleTeams[0], 
    away_team: sampleTeams[1], 
    home_score: 118,
    away_score: 112,
    game_date: '2026-05-09T19:30:00Z',
    season: '2025-26',
    arena: 'Crypto.com Arena',
    status: 'final',
    watchability: 9.5,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    top_scorer: 'LeBron James - 32 PTS'
  },
  {
    id: '2',
    home_team: sampleTeams[3], 
    away_team: sampleTeams[2], 
    home_score: 108,
    away_score: 114,
    game_date: '2026-05-08T20:00:00Z',
    season: '2025-26',
    arena: 'Fiserv Forum',
    status: 'final',
    watchability: 9.0,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1504450758481-7338d3f3b2c8?w=400&h=300&fit=crop',
    top_scorer: 'Jayson Tatum - 28 PTS'
  },
  {
    id: '3',
    home_team: sampleTeams[5], 
    away_team: sampleTeams[4], 
    home_score: 121,
    away_score: 115,
    game_date: '2026-05-07T21:00:00Z',
    season: '2025-26',
    arena: 'Ball Arena',
    status: 'final',
    watchability: 8.8,
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    top_scorer: 'Nikola Jokic - 35 PTS, 12 REB'
  },
  {
    id: '4',
    home_team: sampleTeams[2], 
    away_team: sampleTeams[0], 
    home_score: 45,
    away_score: 42,
    game_date: '2026-05-09T19:30:00Z',
    season: '2025-26',
    arena: 'TD Garden',
    status: 'halftime',
    watchability: 9.8,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=400&h=300&fit=crop',
    period: 'Halftime',
    top_scorer: 'LeBron James - 18 PTS'
  },
  {
    id: '5',
    home_team: sampleTeams[1], 
    away_team: sampleTeams[5], 
    home_score: 98,
    away_score: 95,
    game_date: '2026-05-10T20:30:00Z',
    season: '2025-26',
    arena: 'Chase Center',
    status: '4th',
    watchability: 9.2,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=300&fit=crop',
    period: '4th - 2:34',
    top_scorer: 'Stephen Curry - 28 PTS'
  },
  {
    id: '6',
    home_team: sampleTeams[4], 
    away_team: sampleTeams[3], 
    home_score: 0,
    away_score: 0,
    game_date: '2026-05-11T19:00:00Z',
    season: '2025-26',
    arena: 'Footprint Center',
    status: 'upcoming',
    watchability: 8.5,
    rating: 4.2,
    image_url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=300&fit=crop',
  }
];


export interface Playlist {
  id: string;
  title: string;
  description: string;
  author: string;
  authorUsername: string;
  authorAvatar?: string;
  games: Game[];
  createdAt: string;
  isPublic: boolean;
}

export const samplePlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Must Watch Classics',
    description: 'The greatest basketball games that every fan needs to see at least once in their lifetime.',
    author: 'Basketball Historian',
    authorUsername: 'hoops_history',
    games: [sampleGames[0], sampleGames[1], sampleGames[2]],
    createdAt: '2026-04-15T10:00:00Z',
    isPublic: true,
  },
  {
    id: '2',
    title: '2025 Playoffs Highlights',
    description: 'The most intense and memorable games from last year\'s playoff run.',
    author: 'Playoff P',
    authorUsername: 'postseason_hero',
    games: [sampleGames[3], sampleGames[4]],
    createdAt: '2026-04-20T14:30:00Z',
    isPublic: true,
  },
  {
    id: '3',
    title: 'Underrated Gems',
    description: 'Games that didn\'t get enough attention but are absolute bangers from start to finish.',
    author: 'Deep Cuts',
    authorUsername: 'bball_junkie',
    games: [sampleGames[5], sampleGames[1], sampleGames[4]],
    createdAt: '2026-04-25T09:15:00Z',
    isPublic: true,
  },
];