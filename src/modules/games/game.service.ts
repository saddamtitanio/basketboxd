import { GameRepository } from "./game.repository";

export class GameService {
    private gameRepository: GameRepository;

    constructor() {
        this.gameRepository = new GameRepository();
    }
    async getGames(filters: {
        query?: string;
        season?: string;
        teamId?: string;
        arena?: string;
        date?: string;
        startDate?: string;
        status?: string;
        endDate?: string;
    }) {
        return await this.gameRepository.findAll(filters);
    }
    

    /* Get game by ID */
    async getGameById(id: string) {
        return await this.gameRepository.findById(id);
    }

    /* Search games */
    async searchGames(query: string) {
        return await this.gameRepository.search(query);
    }

    /* Get games by season */
    async getGamesBySeason(season: string) {
        return await this.gameRepository.findBySeason(season);
    }

    /* Get completed games */
    async getCompletedGames() {
        return await this.gameRepository.findCompletedGames();
    }

    /* Get games by team */
    async getGamesByTeam(teamId: string) {
        return await this.gameRepository.findByTeam(teamId);
    }
}