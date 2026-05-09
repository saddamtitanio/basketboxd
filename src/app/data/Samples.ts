// --- Interfaces ---
export interface Player {
  id: string; full_name: string; jersey_number: number; position: string; team_id: string; image_url?: string;
  minutes?: number; pts?: number; reb?: number; ast?: number; stl?: number; blk?: number;
  fga?: number; fgm?: number; three_fga?: number; three_fgm?: number; fta?: number; ftm?: number; fg_percent?: number;
}

export interface Team { id: string; name: string; city: string; abbreviation: string; logo_url?: string; }

export interface Game {
  id: string; home_team: Team; away_team: Team; home_score?: number; away_score?: number;
  game_date: string; season: string; arena: string;
  status: 'live' | 'final' | 'upcoming' | 'halftime' | '1st' | '2nd' | '3rd' | '4th';
  home_players?: Player[]; away_players?: Player[];
  mvp_votes?: { [playerId: string]: number };
  watchability: number; rating: number; image_url: string; period?: string; top_scorer?: string;
}

// --- Sample Teams ---
export const sampleTeams: Team[] = [
  { id: '1', name: 'Lakers', city: 'Los Angeles', abbreviation: 'LAL', logo_url: 'https://loodibee.com/wp-content/uploads/nba-los-angeles-lakers-logo.png' },
  { id: '2', name: 'Warriors', city: 'Golden State', abbreviation: 'GSW', logo_url: 'https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo.png' },
  { id: '3', name: 'Celtics', city: 'Boston', abbreviation: 'BOS', logo_url: 'https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo.png' },
  { id: '4', name: 'Bucks', city: 'Milwaukee', abbreviation: 'MIL', logo_url: 'https://loodibee.com/wp-content/uploads/nba-milwaukee-bucks-logo.png' },
  { id: '5', name: 'Suns', city: 'Phoenix', abbreviation: 'PHX', logo_url: 'https://loodibee.com/wp-content/uploads/nba-phoenix-suns-logo.png' },
  { id: '6', name: 'Nuggets', city: 'Denver', abbreviation: 'DEN', logo_url: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg' },
];

const imgBase = "https://cdn.nba.com/headshots/nba/latest/1040x760/";

// --- Sample Games ---
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
    id: '4', home_team: sampleTeams[2], away_team: sampleTeams[0], home_score: 55, away_score: 58,
    game_date: '2026-05-09T22:00:00Z', arena: 'TD Garden', status: 'halftime', watchability: 9.8, rating: 4.9,
    season: '2025-26', image_url: 'https://cdn.nba.com/manage/2025/01/lebron-celtics-012325.jpg',
    period: 'Halftime', top_scorer: 'Luka Dončić - 22 PTS',
    home_players: [
      { id: 'tat4', full_name: 'Jayson Tatum', jersey_number: 0, position: 'SF', team_id: '3', image_url: `${imgBase}1628369.png`, minutes: 18, pts: 15, reb: 4, ast: 3, stl: 1, blk: 0, fga: 10, fgm: 6, three_fga: 4, three_fgm: 2, fta: 2, ftm: 1, fg_percent: 60 },
      { id: 'bro4', full_name: 'Jaylen Brown', jersey_number: 7, position: 'SG', team_id: '3', image_url: `${imgBase}1627759.png`, minutes: 17, pts: 12, reb: 2, ast: 2, stl: 1, blk: 0, fga: 9, fgm: 5, three_fga: 3, three_fgm: 1, fta: 2, ftm: 1, fg_percent: 55 },
      { id: 'hor4', full_name: 'Al Horford', jersey_number: 42, position: 'C', team_id: '3', image_url: `${imgBase}201143.png`, minutes: 12, pts: 6, reb: 4, ast: 2, stl: 1, blk: 1, fga: 4, fgm: 2, three_fga: 2, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'kp4', full_name: 'Kristaps Porzingis', jersey_number: 8, position: 'C', team_id: '3', image_url: `${imgBase}204001.png`, minutes: 15, pts: 10, reb: 5, ast: 1, stl: 0, blk: 2, fga: 7, fgm: 4, three_fga: 2, three_fgm: 1, fta: 2, ftm: 1, fg_percent: 57 },
      { id: 'whi4', full_name: 'Derrick White', jersey_number: 9, position: 'PG', team_id: '3', image_url: `${imgBase}1628401.png`, minutes: 16, pts: 7, reb: 2, ast: 4, stl: 2, blk: 1, fga: 5, fgm: 3, three_fga: 3, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 60 },
      { id: 'hol4', full_name: 'Jrue Holiday', jersey_number: 4, position: 'PG', team_id: '3', image_url: `${imgBase}201950.png`, minutes: 16, pts: 5, reb: 3, ast: 4, stl: 2, blk: 0, fga: 4, fgm: 2, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'pri4', full_name: 'Payton Pritchard', jersey_number: 11, position: 'PG', team_id: '3', image_url: `${imgBase}1630202.png`, minutes: 8, pts: 0, reb: 1, ast: 1, stl: 0, blk: 0, fga: 2, fgm: 0, three_fga: 2, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 0 },
      { id: 'hau4', full_name: 'Sam Hauser', jersey_number: 30, position: 'SF', team_id: '3', image_url: `${imgBase}1630573.png`, minutes: 8, pts: 0, reb: 1, ast: 0, stl: 0, blk: 0, fga: 2, fgm: 0, three_fga: 2, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 0 },
    ],
    away_players: [
      { id: 'luk4', full_name: 'Luka Dončić', jersey_number: 77, position: 'PG', team_id: '1', image_url: `${imgBase}1629029.png`, minutes: 18, pts: 22, reb: 6, ast: 7, stl: 1, blk: 0, fga: 14, fgm: 8, three_fga: 5, three_fgm: 3, fta: 4, ftm: 3, fg_percent: 57 },
      { id: 'leb4', full_name: 'LeBron James', jersey_number: 23, position: 'SF', team_id: '1', image_url: `${imgBase}2544.png`, minutes: 17, pts: 12, reb: 4, ast: 5, stl: 1, blk: 1, fga: 8, fgm: 5, three_fga: 2, three_fgm: 1, fta: 2, ftm: 1, fg_percent: 63 },
      { id: 'reav4', full_name: 'Austin Reaves', jersey_number: 15, position: 'SG', team_id: '1', image_url: `${imgBase}1630559.png`, minutes: 15, pts: 10, reb: 2, ast: 3, stl: 1, blk: 0, fga: 7, fgm: 4, three_fga: 3, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 57 },
      { id: 'rui4', full_name: 'Rui Hachimura', jersey_number: 28, position: 'PF', team_id: '1', image_url: `${imgBase}1629060.png`, minutes: 14, pts: 8, reb: 3, ast: 1, stl: 0, blk: 1, fga: 6, fgm: 4, three_fga: 1, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 66 },
      { id: 'bro4_l', full_name: 'Bronny James', jersey_number: 9, position: 'SG', team_id: '1', image_url: `https://cdn.nba.com/headshots/nba/latest/1040x760/1642355.png`, minutes: 9, pts: 4, reb: 1, ast: 2, stl: 1, blk: 0, fga: 3, fgm: 2, three_fga: 1, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 66 },
      { id: 'van4', full_name: 'Jarred Vanderbilt', jersey_number: 2, position: 'PF', team_id: '1', image_url: `${imgBase}1629020.png`, minutes: 12, pts: 2, reb: 5, ast: 1, stl: 2, blk: 1, fga: 2, fgm: 1, three_fga: 0, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'vin4', full_name: 'Gabe Vincent', jersey_number: 7, position: 'PG', team_id: '1', image_url: `${imgBase}1629731.png`, minutes: 10, pts: 0, reb: 0, ast: 2, stl: 1, blk: 0, fga: 2, fgm: 0, three_fga: 2, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 0 },
      { id: 'woo4', full_name: 'Christian Wood', jersey_number: 35, position: 'C', team_id: '1', image_url: `${imgBase}1626174.png`, minutes: 8, pts: 0, reb: 2, ast: 0, stl: 0, blk: 1, fga: 1, fgm: 0, three_fga: 1, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 0 },
    ]
  },

  // GAME 5: WARRIORS VS NUGGETS (LIVE 4TH)
  {
    id: '5', home_team: sampleTeams[1], away_team: sampleTeams[5], home_score: 102, away_score: 98,
    game_date: '2026-05-10T20:30:00Z', arena: 'Chase Center', status: '4th', period: '4th - 1:45', watchability: 9.6, rating: 4.7,
    season: '2025-26', image_url: 'https://cdn.nba.com/manage/2025/10/curry-nite-meta-102325.jpg',
    top_scorer: 'Stephen Curry - 32 PTS',
    home_players: [
      { id: 'cur5', full_name: 'Stephen Curry', jersey_number: 30, position: 'PG', team_id: '2', image_url: `${imgBase}201939.png`, minutes: 34, pts: 32, reb: 4, ast: 6, stl: 1, blk: 0, fga: 20, fgm: 11, three_fga: 12, three_fgm: 7, fta: 4, ftm: 3, fg_percent: 55 },
      { id: 'but5', full_name: 'Jimmy Butler', jersey_number: 22, position: 'SF', team_id: '2', image_url: `${imgBase}202710.png`, minutes: 32, pts: 20, reb: 7, ast: 5, stl: 3, blk: 1, fga: 14, fgm: 8, three_fga: 2, three_fgm: 1, fta: 4, ftm: 3, fg_percent: 57 },
      { id: 'dre5', full_name: 'Draymond Green', jersey_number: 23, position: 'PF', team_id: '2', image_url: `${imgBase}203110.png`, minutes: 30, pts: 7, reb: 9, ast: 10, stl: 2, blk: 2, fga: 5, fgm: 3, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 60 },
      { id: 'kum5', full_name: 'Jonathan Kuminga', jersey_number: 0, position: 'PF', team_id: '2', image_url: `${imgBase}1630591.png`, minutes: 28, pts: 14, reb: 5, ast: 2, stl: 1, blk: 1, fga: 10, fgm: 6, three_fga: 1, three_fgm: 0, fta: 3, ftm: 2, fg_percent: 60 },
      { id: 'pod5', full_name: 'Brandin Podziemski', jersey_number: 2, position: 'SG', team_id: '2', image_url: `${imgBase}1641716.png`, minutes: 24, pts: 11, reb: 6, ast: 4, stl: 1, blk: 0, fga: 8, fgm: 4, three_fga: 4, three_fgm: 2, fta: 1, ftm: 1, fg_percent: 50 },
      { id: 'loo5', full_name: 'Kevon Looney', jersey_number: 5, position: 'C', team_id: '2', image_url: `${imgBase}1626172.png`, minutes: 18, pts: 4, reb: 8, ast: 1, stl: 0, blk: 1, fga: 3, fgm: 2, three_fga: 0, three_fgm: 0, fta: 1, ftm: 0, fg_percent: 66 },
      { id: 'moo5', full_name: 'Moses Moody', jersey_number: 4, position: 'SF', team_id: '2', image_url: `${imgBase}1630541.png`, minutes: 15, pts: 9, reb: 2, ast: 1, stl: 1, blk: 0, fga: 6, fgm: 3, three_fga: 3, three_fgm: 2, fta: 1, ftm: 1, fg_percent: 50 },
      { id: 'pay5', full_name: 'Gary Payton II', jersey_number: 8, position: 'PG', team_id: '2', image_url: `${imgBase}1627780.png`, minutes: 12, pts: 5, reb: 1, ast: 1, stl: 2, blk: 1, fga: 4, fgm: 2, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 50 },
    ],
    away_players: [
      { id: 'jok5', full_name: 'Nikola Jokić', jersey_number: 15, position: 'C', team_id: '6', image_url: `${imgBase}203999.png`, minutes: 35, pts: 28, reb: 12, ast: 9, stl: 2, blk: 1, fga: 19, fgm: 11, three_fga: 2, three_fgm: 0, fta: 7, ftm: 6, fg_percent: 57 },
      { id: 'mur5', full_name: 'Jamal Murray', jersey_number: 27, position: 'PG', team_id: '6', image_url: `https://cdn.nba.com/headshots/nba/latest/1040x760/1627750.png`, minutes: 33, pts: 18, reb: 3, ast: 6, stl: 1, blk: 0, fga: 15, fgm: 7, three_fga: 6, three_fgm: 3, fta: 2, ftm: 1, fg_percent: 46 },
      { id: 'mpj5', full_name: 'Michael Porter Jr.', jersey_number: 1, position: 'SF', team_id: '6', image_url: `${imgBase}1629008.png`, minutes: 30, pts: 16, reb: 6, ast: 1, stl: 1, blk: 1, fga: 12, fgm: 6, three_fga: 5, three_fgm: 3, fta: 1, ftm: 1, fg_percent: 50 },
      { id: 'gor5', full_name: 'Aaron Gordon', jersey_number: 50, position: 'PF', team_id: '6', image_url: `${imgBase}203932.png`, minutes: 30, pts: 12, reb: 7, ast: 2, stl: 1, blk: 1, fga: 8, fgm: 5, three_fga: 1, three_fgm: 0, fta: 3, ftm: 2, fg_percent: 62 },
      { id: 'wes5', full_name: 'Russell Westbrook', jersey_number: 4, position: 'PG', team_id: '6', image_url: `${imgBase}201566.png`, minutes: 20, pts: 8, reb: 4, ast: 5, stl: 1, blk: 0, fga: 7, fgm: 4, three_fga: 1, three_fgm: 0, fta: 1, ftm: 0, fg_percent: 57 },
      { id: 'bra5', full_name: 'Christian Braun', jersey_number: 0, position: 'SG', team_id: '6', image_url: `${imgBase}1631128.png`, minutes: 22, pts: 7, reb: 3, ast: 1, stl: 1, blk: 0, fga: 6, fgm: 3, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'wat5', full_name: 'Peyton Watson', jersey_number: 8, position: 'PF', team_id: '6', image_url: `${imgBase}1631212.png`, minutes: 16, pts: 5, reb: 4, ast: 0, stl: 1, blk: 2, fga: 4, fgm: 2, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'str5', full_name: 'Julian Strawther', jersey_number: 5, position: 'SG', team_id: '6', image_url: `${imgBase}1641734.png`, minutes: 12, pts: 4, reb: 1, ast: 1, stl: 0, blk: 0, fga: 4, fgm: 2, three_fga: 2, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 50 },
    ]
  },
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