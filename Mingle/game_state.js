class GameRunner {
    constructor(game) {
        this.game = game;
        this.hints = [...game.hints];
        this.hintsUsed = 1;
    }
}