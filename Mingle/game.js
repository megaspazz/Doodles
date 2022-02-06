class Game {
    constructor(hints, solution) {
        this.hints = hints;
        this.solution = solution;
        this.hintsUsed = 0;
    }

    #createFromTemplate() {
        return new Game([...this.hints], this.solution);
    }
    static generate(filterFn) {
        return Game.#firstMatch(Game.#shuffle([...Game.#getAllGames()]), filterFn);
    }

    static generateForLength(length, filterFn) {
        return Game.#firstMatch(Game.#shuffle([...Game.#getAllGamesByLength()[length]]), filterFn);
    }

    static getRandomTemplate() {
        const games = Game.#getAllGames();
        const idx = ~~(Math.random() * games.length);
        return games[idx].#createFromTemplate();
    }

    static getRandomTemplateForLength(len) {
        const gamesByLength = Game.#getAllGamesByLength();
        const idx = ~~(Math.random() * gamesByLength[len].length);
        return gamesByLength[len][idx].#createFromTemplate();
    }

    static #allGames = null;
    static #getAllGames() {
        if (!Game.#allGames) {
            let hintsMap = new Map();
            for (const word of Words.LIST) {
                for (let len = 1; len + 1 < word.length; ++len) {
                    for (let i = 0; i + len <= word.length; ++i) {
                        const sub = word.substring(i, i + len);
                        let arr = hintsMap.get(sub);
                        if (!arr) {
                            arr = [];
                            hintsMap.set(sub, arr);
                        }
                        const hint = new Hint(word, i, len);
                        arr.push(hint);
                    }
                }
            }
            Game.#allGames = [];
            for (const [answer, hints] of hintsMap) {
                const game = new Game(hints, answer);
                Game.#allGames.push(game);
            }
        }
        return Game.#allGames;
    }

    static #allGamesByLength = null;
    static #getAllGamesByLength() {
        if (!Game.#allGamesByLength) {
            Game.#allGamesByLength = [];
            for (const game of Game.#getAllGames()) {
                let arr = Game.#allGamesByLength[game.solution.length];
                if (!arr) {
                    arr = [];
                    Game.#allGamesByLength[game.solution.length] = arr;
                }
                arr.push(game);
            }
        }
        return Game.#allGamesByLength;
    }

    static #shuffle(arr) {
        for (let i = arr.length - 1; i > 0; --i) {
            let j = ~~(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static #firstMatch(games, filterFn) {
        for (const gameTemplate of games) {
            let g = gameTemplate.#createFromTemplate();
            if (!filterFn || filterFn(g)) {
                return g;
            }
        }
        return null;
    }
}
