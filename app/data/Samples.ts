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
  // GAME 1: LAKERS VS WARRIORS (FINAL)
  {
    id: '1', home_team: sampleTeams[0], away_team: sampleTeams[1], home_score: 124, away_score: 118,
    game_date: '2026-05-09T19:30:00Z', season: '2025-26', arena: 'Crypto.com Arena',
    status: 'final', watchability: 9.9, rating: 5.0, image_url: 'https://cdn.nba.com/manage/2025/10/GettyImages-2240350502.jpg',
    top_scorer: 'Luka Dončić - 42 PTS',
    home_players: [
      { id: 'luk1', full_name: 'Luka Dončić', jersey_number: 77, position: 'PG', team_id: '1', image_url: `${imgBase}1629029.png`, minutes: 38, pts: 42, reb: 11, ast: 13, stl: 2, blk: 0, fga: 26, fgm: 15, three_fga: 10, three_fgm: 5, fta: 8, ftm: 7, fg_percent: 57 },
      { id: 'leb1', full_name: 'LeBron James', jersey_number: 23, position: 'SF', team_id: '1', image_url: `${imgBase}2544.png`, minutes: 34, pts: 22, reb: 7, ast: 8, stl: 1, blk: 1, fga: 16, fgm: 9, three_fga: 5, three_fgm: 2, fta: 4, ftm: 2, fg_percent: 56 },
      { id: 'bro1', full_name: 'Bronny James', jersey_number: 9, position: 'SG', team_id: '1', image_url: `https://cdn.nba.com/headshots/nba/latest/1040x760/1642355.png`, minutes: 18, pts: 8, reb: 2, ast: 3, stl: 2, blk: 0, fga: 6, fgm: 3, three_fga: 4, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'reav1', full_name: 'Austin Reaves', jersey_number: 15, position: 'SG', team_id: '1', image_url: `${imgBase}1630559.png`, minutes: 30, pts: 18, reb: 4, ast: 5, stl: 1, blk: 0, fga: 12, fgm: 6, three_fga: 5, three_fgm: 3, fta: 4, ftm: 3, fg_percent: 50 },
      { id: 'rui1', full_name: 'Rui Hachimura', jersey_number: 28, position: 'PF', team_id: '1', image_url: `${imgBase}1629060.png`, minutes: 28, pts: 14, reb: 6, ast: 1, stl: 0, blk: 1, fga: 10, fgm: 6, three_fga: 3, three_fgm: 1, fta: 2, ftm: 1, fg_percent: 60 },
      { id: 'van1', full_name: 'Jarred Vanderbilt', jersey_number: 2, position: 'PF', team_id: '1', image_url: `${imgBase}1629020.png`, minutes: 22, pts: 6, reb: 9, ast: 1, stl: 3, blk: 1, fga: 4, fgm: 3, three_fga: 0, three_fgm: 0, fta: 1, ftm: 0, fg_percent: 75 },
      { id: 'vin1', full_name: 'Gabe Vincent', jersey_number: 7, position: 'PG', team_id: '1', image_url: `${imgBase}1629731.png`, minutes: 16, pts: 7, reb: 1, ast: 3, stl: 1, blk: 0, fga: 6, fgm: 2, three_fga: 4, three_fgm: 2, fta: 2, ftm: 1, fg_percent: 33 },
      { id: 'woo1', full_name: 'Christian Wood', jersey_number: 35, position: 'C', team_id: '1', image_url: `${imgBase}1626174.png`, minutes: 14, pts: 7, reb: 6, ast: 0, stl: 0, blk: 2, fga: 5, fgm: 3, three_fga: 2, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 60 },
    ],
    away_players: [
      { id: 'cur1', full_name: 'Stephen Curry', jersey_number: 30, position: 'PG', team_id: '2', image_url: `${imgBase}201939.png`, minutes: 36, pts: 35, reb: 4, ast: 6, stl: 1, blk: 0, fga: 22, fgm: 12, three_fga: 15, three_fgm: 8, fta: 4, ftm: 3, fg_percent: 54 },
      { id: 'but1', full_name: 'Jimmy Butler', jersey_number: 22, position: 'SF', team_id: '2', image_url: `${imgBase}202710.png`, minutes: 35, pts: 26, reb: 8, ast: 5, stl: 3, blk: 1, fga: 18, fgm: 10, three_fga: 3, three_fgm: 1, fta: 6, ftm: 5, fg_percent: 55 },
      { id: 'dre1', full_name: 'Draymond Green', jersey_number: 23, position: 'PF', team_id: '2', image_url: `${imgBase}203110.png`, minutes: 32, pts: 8, reb: 10, ast: 11, stl: 2, blk: 2, fga: 6, fgm: 3, three_fga: 2, three_fgm: 1, fta: 2, ftm: 1, fg_percent: 50 },
      { id: 'kum1', full_name: 'Jonathan Kuminga', jersey_number: 0, position: 'PF', team_id: '2', image_url: `${imgBase}1630591.png`, minutes: 28, pts: 16, reb: 5, ast: 1, stl: 1, blk: 0, fga: 11, fgm: 7, three_fga: 2, three_fgm: 0, fta: 4, ftm: 2, fg_percent: 63 },
      { id: 'pod1', full_name: 'Brandin Podziemski', jersey_number: 2, position: 'SG', team_id: '2', image_url: `${imgBase}1641716.png`, minutes: 25, pts: 10, reb: 7, ast: 4, stl: 1, blk: 0, fga: 8, fgm: 4, three_fga: 4, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'loo1', full_name: 'Kevon Looney', jersey_number: 5, position: 'C', team_id: '2', image_url: `${imgBase}1626172.png`, minutes: 20, pts: 6, reb: 10, ast: 2, stl: 0, blk: 1, fga: 4, fgm: 3, three_fga: 0, three_fgm: 0, fta: 2, ftm: 0, fg_percent: 75 },
      { id: 'moo1', full_name: 'Moses Moody', jersey_number: 4, position: 'SF', team_id: '2', image_url: `${imgBase}1630541.png`, minutes: 15, pts: 11, reb: 3, ast: 1, stl: 1, blk: 0, fga: 7, fgm: 4, three_fga: 4, three_fgm: 3, fta: 0, ftm: 0, fg_percent: 57 },
      { id: 'pay1', full_name: 'Gary Payton II', jersey_number: 8, position: 'PG', team_id: '2', image_url: `${imgBase}1627780.png`, minutes: 14, pts: 6, reb: 2, ast: 1, stl: 3, blk: 1, fga: 5, fgm: 3, three_fga: 1, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 60 },
    ]
  },

  // GAME 2: BUCKS VS CELTICS (FINAL)
  {
    id: '2', home_team: sampleTeams[3], away_team: sampleTeams[2], home_score: 112, away_score: 115,
    game_date: '2026-05-08T20:00:00Z', arena: 'Fiserv Forum', status: 'final', watchability: 9.4, rating: 4.8, 
    season: '2025-26', image_url: 'https://cdn.nba.com/manage/2026/03/GettyImages-2264469576-scaled-e1772506308284.jpg',
    top_scorer: 'Jayson Tatum - 31 PTS',
    home_players: [
      { id: 'gia2', full_name: 'Giannis Antetokounmpo', jersey_number: 34, position: 'PF', team_id: '4', image_url: `${imgBase}203507.png`, minutes: 38, pts: 36, reb: 14, ast: 7, stl: 1, blk: 3, fga: 22, fgm: 14, three_fga: 2, three_fgm: 0, fta: 12, ftm: 8, fg_percent: 64 },
      { id: 'dam2', full_name: 'Damian Lillard', jersey_number: 0, position: 'PG', team_id: '4', image_url: `${imgBase}203081.png`, minutes: 36, pts: 28, reb: 3, ast: 8, stl: 1, blk: 0, fga: 19, fgm: 9, three_fga: 12, three_fgm: 6, fta: 5, ftm: 4, fg_percent: 47 },
      { id: 'kuz2', full_name: 'Kyle Kuzma', jersey_number: 33, position: 'SF', team_id: '4', image_url: `${imgBase}1628398.png`, minutes: 34, pts: 20, reb: 8, ast: 3, stl: 1, blk: 1, fga: 15, fgm: 8, three_fga: 6, three_fgm: 2, fta: 3, ftm: 2, fg_percent: 53 },
      { id: 'lop2', full_name: 'Brook Lopez', jersey_number: 11, position: 'C', team_id: '4', image_url: `${imgBase}201572.png`, minutes: 30, pts: 12, reb: 6, ast: 1, stl: 0, blk: 4, fga: 10, fgm: 5, three_fga: 6, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 50 },
      { id: 'por2', full_name: 'Bobby Portis', jersey_number: 9, position: 'PF', team_id: '4', image_url: `${imgBase}1626171.png`, minutes: 24, pts: 10, reb: 8, ast: 1, stl: 1, blk: 0, fga: 9, fgm: 4, three_fga: 2, three_fgm: 0, fta: 2, ftm: 2, fg_percent: 44 },
      { id: 'bea2', full_name: 'Malik Beasley', jersey_number: 5, position: 'SG', team_id: '4', image_url: `${imgBase}1627736.png`, minutes: 22, pts: 6, reb: 2, ast: 1, stl: 1, blk: 0, fga: 7, fgm: 2, three_fga: 6, three_fgm: 2, fta: 0, ftm: 0, fg_percent: 28 },
      { id: 'con2', full_name: 'Pat Connaughton', jersey_number: 24, position: 'SF', team_id: '4', image_url: `${imgBase}1626192.png`, minutes: 18, pts: 3, reb: 4, ast: 2, stl: 1, blk: 0, fga: 4, fgm: 1, three_fga: 3, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 25 },
      { id: 'jac2', full_name: 'Andre Jackson Jr.', jersey_number: 44, position: 'SG', team_id: '4', image_url: `${imgBase}1641748.png`, minutes: 12, pts: 2, reb: 3, ast: 2, stl: 2, blk: 1, fga: 2, fgm: 1, three_fga: 0, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 50 },
    ],
    away_players: [
      { id: 'tat2', full_name: 'Jayson Tatum', jersey_number: 0, position: 'SF', team_id: '3', image_url: `${imgBase}1628369.png`, minutes: 38, pts: 31, reb: 9, ast: 5, stl: 1, blk: 1, fga: 21, fgm: 11, three_fga: 9, three_fgm: 4, fta: 6, ftm: 5, fg_percent: 52 },
      { id: 'bro_2', full_name: 'Jaylen Brown', jersey_number: 7, position: 'SG', team_id: '3', image_url: `${imgBase}1627759.png`, minutes: 35, pts: 24, reb: 5, ast: 3, stl: 2, blk: 0, fga: 18, fgm: 9, three_fga: 6, three_fgm: 3, fta: 4, ftm: 3, fg_percent: 50 },
      { id: 'hor2', full_name: 'Al Horford', jersey_number: 42, position: 'C', team_id: '3', image_url: `${imgBase}201143.png`, minutes: 24, pts: 9, reb: 7, ast: 3, stl: 1, blk: 2, fga: 7, fgm: 3, three_fga: 4, three_fgm: 2, fta: 1, ftm: 1, fg_percent: 43 },
      { id: 'kp2', full_name: 'Kristaps Porzingis', jersey_number: 8, position: 'C', team_id: '3', image_url: `${imgBase}204001.png`, minutes: 30, pts: 20, reb: 8, ast: 1, stl: 0, blk: 3, fga: 14, fgm: 7, three_fga: 5, three_fgm: 2, fta: 4, ftm: 4, fg_percent: 50 },
      { id: 'whi2', full_name: 'Derrick White', jersey_number: 9, position: 'PG', team_id: '3', image_url: `${imgBase}1628401.png`, minutes: 32, pts: 14, reb: 4, ast: 7, stl: 2, blk: 2, fga: 10, fgm: 5, three_fga: 5, three_fgm: 2, fta: 2, ftm: 2, fg_percent: 50 },
      { id: 'hol2', full_name: 'Jrue Holiday', jersey_number: 4, position: 'PG', team_id: '3', image_url: `${imgBase}201950.png`, minutes: 33, pts: 12, reb: 5, ast: 8, stl: 3, blk: 0, fga: 9, fgm: 4, three_fga: 4, three_fgm: 2, fta: 2, ftm: 2, fg_percent: 44 },
      { id: 'pri2', full_name: 'Payton Pritchard', jersey_number: 11, position: 'PG', team_id: '3', image_url: `${imgBase}1630202.png`, minutes: 16, pts: 5, reb: 2, ast: 3, stl: 1, blk: 0, fga: 5, fgm: 2, three_fga: 3, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 40 },
      { id: 'hau2', full_name: 'Sam Hauser', jersey_number: 30, position: 'SF', team_id: '3', image_url: `${imgBase}1630573.png`, minutes: 14, pts: 3, reb: 1, ast: 1, stl: 0, blk: 0, fga: 4, fgm: 1, three_fga: 4, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 25 },
    ]
  },

  // GAME 3: NUGGETS VS SUNS (FINAL)
  {
    id: '3', home_team: sampleTeams[5], away_team: sampleTeams[4], home_score: 119, away_score: 114,
    game_date: '2026-05-07T21:00:00Z', arena: 'Ball Arena', status: 'final', watchability: 8.8, rating: 4.4,
    season: '2025-26', image_url: 'https://cdn.nba.com/manage/2026/03/jokic-suns-meta-032426.jpg',
    top_scorer: 'Nikola Jokić - 34 PTS, 15 REB',
    home_players: [
      { id: 'jok3', full_name: 'Nikola Jokić', jersey_number: 15, position: 'C', team_id: '6', image_url: `${imgBase}203999.png`, minutes: 37, pts: 34, reb: 15, ast: 11, stl: 2, blk: 1, fga: 21, fgm: 13, three_fga: 3, three_fgm: 1, fta: 8, ftm: 7, fg_percent: 62 },
      { id: 'mur3', full_name: 'Jamal Murray', jersey_number: 27, position: 'PG', team_id: '6', image_url: `https://cdn.nba.com/headshots/nba/latest/1040x760/1627750.png`, minutes: 35, pts: 22, reb: 4, ast: 8, stl: 1, blk: 0, fga: 18, fgm: 9, three_fga: 7, three_fgm: 3, fta: 2, ftm: 1, fg_percent: 50 },
      { id: 'mpj3', full_name: 'Michael Porter Jr.', jersey_number: 1, position: 'SF', team_id: '6', image_url: `${imgBase}1629008.png`, minutes: 32, pts: 18, reb: 7, ast: 1, stl: 1, blk: 1, fga: 13, fgm: 7, three_fga: 6, three_fgm: 3, fta: 1, ftm: 1, fg_percent: 54 },
      { id: 'gor3', full_name: 'Aaron Gordon', jersey_number: 50, position: 'PF', team_id: '6', image_url: `${imgBase}203932.png`, minutes: 34, pts: 14, reb: 8, ast: 3, stl: 1, blk: 2, fga: 10, fgm: 6, three_fga: 1, three_fgm: 0, fta: 4, ftm: 2, fg_percent: 60 },
      { id: 'wes3', full_name: 'Russell Westbrook', jersey_number: 4, position: 'PG', team_id: '6', image_url: `${imgBase}201566.png`, minutes: 22, pts: 11, reb: 5, ast: 6, stl: 2, blk: 0, fga: 9, fgm: 5, three_fga: 1, three_fgm: 0, fta: 2, ftm: 1, fg_percent: 55 },
      { id: 'bra3', full_name: 'Christian Braun', jersey_number: 0, position: 'SG', team_id: '6', image_url: `${imgBase}1631128.png`, minutes: 24, pts: 9, reb: 3, ast: 2, stl: 1, blk: 0, fga: 7, fgm: 4, three_fga: 2, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 57 },
      { id: 'wat3', full_name: 'Peyton Watson', jersey_number: 8, position: 'PF', team_id: '6', image_url: `${imgBase}1631212.png`, minutes: 18, pts: 7, reb: 4, ast: 1, stl: 1, blk: 2, fga: 5, fgm: 3, three_fga: 1, three_fgm: 1, fta: 0, ftm: 0, fg_percent: 60 },
      { id: 'str3', full_name: 'Julian Strawther', jersey_number: 5, position: 'SG', team_id: '6', image_url: `${imgBase}1641734.png`, minutes: 12, pts: 4, reb: 1, ast: 1, stl: 0, blk: 0, fga: 4, fgm: 2, three_fga: 2, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 50 },
    ],
    away_players: [
      { id: 'dur3', full_name: 'Kevin Durant', jersey_number: 35, position: 'PF', team_id: '5', image_url: `${imgBase}201142.png`, minutes: 38, pts: 30, reb: 8, ast: 4, stl: 1, blk: 2, fga: 21, fgm: 11, three_fga: 6, three_fgm: 2, fta: 6, ftm: 6, fg_percent: 52 },
      { id: 'boo3', full_name: 'Devin Booker', jersey_number: 1, position: 'SG', team_id: '5', image_url: `${imgBase}1626164.png`, minutes: 37, pts: 28, reb: 4, ast: 9, stl: 2, blk: 0, fga: 19, fgm: 10, three_fga: 5, three_fgm: 2, fta: 7, ftm: 6, fg_percent: 53 },
      { id: 'bea3', full_name: 'Bradley Beal', jersey_number: 3, position: 'SG', team_id: '5', image_url: `${imgBase}203078.png`, minutes: 34, pts: 18, reb: 3, ast: 4, stl: 1, blk: 0, fga: 14, fgm: 7, three_fga: 6, three_fgm: 2, fta: 3, ftm: 2, fg_percent: 50 },
      { id: 'nur3', full_name: 'Jusuf Nurkić', jersey_number: 20, position: 'C', team_id: '5', image_url: `${imgBase}203994.png`, minutes: 30, pts: 12, reb: 11, ast: 3, stl: 1, blk: 2, fga: 10, fgm: 5, three_fga: 1, three_fgm: 0, fta: 4, ftm: 2, fg_percent: 50 },
      { id: 'all3', full_name: 'Grayson Allen', jersey_number: 8, position: 'SG', team_id: '5', image_url: `${imgBase}1628960.png`, minutes: 31, pts: 14, reb: 4, ast: 2, stl: 1, blk: 0, fga: 9, fgm: 5, three_fga: 7, three_fgm: 4, fta: 0, ftm: 0, fg_percent: 55 },
      { id: 'one3', full_name: 'Royce O\'Neale', jersey_number: 0, position: 'SF', team_id: '5', image_url: `${imgBase}1628396.png`, minutes: 24, pts: 7, reb: 5, ast: 2, stl: 2, blk: 0, fga: 6, fgm: 2, three_fga: 4, three_fgm: 2, fta: 1, ftm: 1, fg_percent: 33 },
      { id: 'oko3', full_name: 'Josh Okogie', jersey_number: 2, position: 'SF', team_id: '5', image_url: `${imgBase}1629006.png`, minutes: 18, pts: 5, reb: 3, ast: 1, stl: 2, blk: 0, fga: 4, fgm: 2, three_fga: 1, three_fgm: 0, fta: 2, ftm: 1, fg_percent: 50 },
      { id: 'bol3', full_name: 'Bol Bol', jersey_number: 10, position: 'PF', team_id: '5', image_url: `${imgBase}1629626.png`, minutes: 12, pts: 0, reb: 4, ast: 0, stl: 0, blk: 3, fga: 2, fgm: 0, three_fga: 1, three_fgm: 0, fta: 0, ftm: 0, fg_percent: 0 },
    ]
  },

  // GAME 4: CELTICS VS LAKERS (HALFTIME)
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