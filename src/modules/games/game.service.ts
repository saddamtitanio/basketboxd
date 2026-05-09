import { GameRepository } from "./game.repository";

export class GameService {
    private gameRepository: GameRepository;

    constructor() {
        this.gameRepository = new GameRepository();
    }

    /* Get all games */
    async getAllGames() {
        return await this.gameRepository.findAll();
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