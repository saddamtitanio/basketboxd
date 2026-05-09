export interface Player {
  id: string;
  full_name: string;
  jersey_number: number;
  position: string;
  team_id: string;
  image_url?: string;
  minutes?: number;
  pts?: number;
  reb?: number;
  ast?: number;
  stl?: number;
  blk?: number;
  fga?: number;
  fgm?: number;
  three_fga?: number;
  three_fgm?: number;
  fta?: number;
  ftm?: number;
  fg_percent?: number;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo_url?: string;
  mvp_votes?: {
  [playerId: string]: number;
};
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
  {
    id: '1',
    name: 'Lakers',
    city: 'Los Angeles',
    abbreviation: 'LAL',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg',
  },

  {
    id: '2',
    name: 'Warriors',
    city: 'Golden State',
    abbreviation: 'GSW',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg',
  },

  {
    id: '3',
    name: 'Celtics',
    city: 'Boston',
    abbreviation: 'BOS',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg',
  },

  {
    id: '4',
    name: 'Bucks',
    city: 'Milwaukee',
    abbreviation: 'MIL',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg',
  },

  {
    id: '5',
    name: 'Suns',
    city: 'Phoenix',
    abbreviation: 'PHX',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg',
  },

  {
    id: '6',
    name: 'Nuggets',
    city: 'Denver',
    abbreviation: 'DEN',
    logo_url:
      'https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg',
  },
];

export const teamRosters: {
  [key: string]: Player[];
} = {
  '1': [
  {
    id: '1',
    full_name: 'LeBron James',
    jersey_number: 23,
    position: 'SF',
    team_id: '1',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',

    minutes: 38,
    pts: 28,
    reb: 9,
    ast: 11,
    stl: 2,
    blk: 1,

    fga: 21,
    fgm: 11,

    three_fga: 7,
    three_fgm: 3,

    fta: 6,
    ftm: 3,

    fg_percent: 52,
  },

  {
    id: '2',
    full_name: 'Anthony Davis',
    jersey_number: 3,
    position: 'C',
    team_id: '1',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png',

    minutes: 36,
    pts: 24,
    reb: 14,
    ast: 3,
    stl: 1,
    blk: 3,

    fga: 17,
    fgm: 9,

    three_fga: 1,
    three_fgm: 0,

    fta: 8,
    ftm: 6,

    fg_percent: 53,
  },

  {
    id: '3',
    full_name: 'Austin Reaves',
    jersey_number: 15,
    position: 'SG',
    team_id: '1',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1630559.png',

    minutes: 34,
    pts: 17,
    reb: 4,
    ast: 6,
    stl: 1,
    blk: 0,

    fga: 13,
    fgm: 6,

    three_fga: 6,
    three_fgm: 3,

    fta: 2,
    ftm: 2,

    fg_percent: 46,
  },

  {
    id: '4',
    full_name: 'Rui Hachimura',
    jersey_number: 28,
    position: 'PF',
    team_id: '1',

    minutes: 28,
    pts: 12,
    reb: 5,
    ast: 1,
    stl: 0,
    blk: 1,

    fga: 10,
    fgm: 5,

    three_fga: 3,
    three_fgm: 1,

    fta: 2,
    ftm: 1,

    fg_percent: 50,
  },

  {
    id: '5',
    full_name: 'D’Angelo Russell',
    jersey_number: 1,
    position: 'PG',
    team_id: '1',

    minutes: 30,
    pts: 14,
    reb: 2,
    ast: 7,
    stl: 1,
    blk: 0,

    fga: 12,
    fgm: 5,

    three_fga: 7,
    three_fgm: 3,

    fta: 1,
    ftm: 1,

    fg_percent: 41,
  },

  {
    id: '6',
    full_name: 'Jarred Vanderbilt',
    jersey_number: 2,
    position: 'PF',
    team_id: '1',

    minutes: 18,
    pts: 6,
    reb: 7,
    ast: 1,
    stl: 2,
    blk: 1,

    fga: 4,
    fgm: 3,

    three_fga: 1,
    three_fgm: 0,

    fta: 2,
    ftm: 0,

    fg_percent: 75,
  },

  {
    id: '7',
    full_name: 'Gabe Vincent',
    jersey_number: 7,
    position: 'PG',
    team_id: '1',

    minutes: 15,
    pts: 5,
    reb: 1,
    ast: 2,
    stl: 1,
    blk: 0,

    fga: 5,
    fgm: 2,

    three_fga: 4,
    three_fgm: 1,

    fta: 0,
    ftm: 0,

    fg_percent: 40,
  },

  {
    id: '8',
    full_name: 'Cam Reddish',
    jersey_number: 5,
    position: 'SF',
    team_id: '1',

    minutes: 11,
    pts: 4,
    reb: 2,
    ast: 1,
    stl: 1,
    blk: 0,

    fga: 3,
    fgm: 2,

    three_fga: 2,
    three_fgm: 0,

    fta: 1,
    ftm: 0,

    fg_percent: 66,
  },
],
'3': [
  {
    id: '101',
    full_name: 'Jayson Tatum',
    jersey_number: 0,
    position: 'SF',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',

    minutes: 39,
    pts: 31,
    reb: 8,
    ast: 5,
    stl: 2,
    blk: 1,

    fga: 22,
    fgm: 12,

    three_fga: 8,
    three_fgm: 4,

    fta: 5,
    ftm: 3,

    fg_percent: 54,
  },

  {
    id: '102',
    full_name: 'Jaylen Brown',
    jersey_number: 7,
    position: 'SG',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png',

    minutes: 36,
    pts: 24,
    reb: 5,
    ast: 4,
    stl: 1,
    blk: 0,

    fga: 19,
    fgm: 10,

    three_fga: 6,
    three_fgm: 2,

    fta: 4,
    ftm: 2,

    fg_percent: 52,
  },

  {
    id: '103',
    full_name: 'Derrick White',
    jersey_number: 9,
    position: 'PG',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1628401.png',

    minutes: 34,
    pts: 17,
    reb: 4,
    ast: 6,
    stl: 2,
    blk: 1,

    fga: 13,
    fgm: 7,

    three_fga: 8,
    three_fgm: 3,

    fta: 1,
    ftm: 0,

    fg_percent: 53,
  },

  {
    id: '104',
    full_name: 'Kristaps Porzingis',
    jersey_number: 8,
    position: 'C',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/204001.png',

    minutes: 31,
    pts: 19,
    reb: 9,
    ast: 2,
    stl: 0,
    blk: 3,

    fga: 14,
    fgm: 8,

    three_fga: 5,
    three_fgm: 2,

    fta: 3,
    ftm: 1,

    fg_percent: 57,
  },

  {
    id: '105',
    full_name: 'Jrue Holiday',
    jersey_number: 4,
    position: 'PG',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/201950.png',

    minutes: 33,
    pts: 14,
    reb: 5,
    ast: 7,
    stl: 2,
    blk: 0,

    fga: 11,
    fgm: 5,

    three_fga: 5,
    three_fgm: 2,

    fta: 2,
    ftm: 2,

    fg_percent: 45,
  },

  {
    id: '106',
    full_name: 'Al Horford',
    jersey_number: 42,
    position: 'C',
    team_id: '3',

    minutes: 20,
    pts: 8,
    reb: 6,
    ast: 2,
    stl: 1,
    blk: 1,

    fga: 6,
    fgm: 3,

    three_fga: 4,
    three_fgm: 2,

    fta: 0,
    ftm: 0,

    fg_percent: 50,
  },

  {
    id: '107',
    full_name: 'Payton Pritchard',
    jersey_number: 11,
    position: 'PG',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1630202.png',

    minutes: 15,
    pts: 7,
    reb: 2,
    ast: 3,
    stl: 1,
    blk: 0,

    fga: 5,
    fgm: 3,

    three_fga: 4,
    three_fgm: 1,

    fta: 0,
    ftm: 0,

    fg_percent: 60,
  },

  {
    id: '108',
    full_name: 'Sam Hauser',
    jersey_number: 30,
    position: 'SF',
    team_id: '3',

    image_url:
      'https://cdn.nba.com/headshots/nba/latest/1040x760/1630573.png',

    minutes: 12,
    pts: 6,
    reb: 2,
    ast: 1,
    stl: 0,
    blk: 0,

    fga: 4,
    fgm: 2,

    three_fga: 4,
    three_fgm: 2,

    fta: 0,
    ftm: 0,

    fg_percent: 50,
  },
],

};

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
    image_url: 'https://cdn.nba.com/manage/2025/10/GettyImages-2240350502.jpg',
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
    image_url: 'https://cdn.nba.com/manage/2026/03/GettyImages-2264469576-scaled-e1772506308284.jpg',
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
    image_url: 'https://cdn.nba.com/manage/2026/03/jokic-suns-meta-032426.jpg',
    top_scorer: 'Nikola Jokic - 35 PTS, 12 REB'
  },
  
  {
  id: '4',
  home_players: teamRosters['3'],
  away_players: teamRosters['1'],
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
  image_url:
    'https://cdn.nba.com/manage/2025/01/lebron-celtics-012325.jpg',
  period: 'Halftime',
  top_scorer: 'LeBron James - 18 PTS',
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
    image_url: 'https://cdn.nba.com/manage/2025/10/curry-nite-meta-102325.jpg',
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
    image_url: 'https://www.lineups.com/wp-content/uploads/2018/12/bucks-vs-suns-760x422.jpg',
  }
];