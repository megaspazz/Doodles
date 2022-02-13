class Game {
    constructor(hints, solution) {
        this.hints = hints;
        this.solution = solution;
        this.hintsUsed = 0;
    }

    checkSolution(guess) {
        return this.hints.map(hint => Game._checkHint(hint, guess));
    }

    shuffleHints() {
        Game._shuffle(this.hints);
        return this;
    }

    _createFromTemplate() {
        return new Game([...this.hints], this.solution);
    }
}

Game.SOLUTION_WRONG = 0;
Game.SOLUTION_OTHER_WORD = 1;
Game.SOLUTION_CORRECT = 2;

Game.generate = function(filterFn) {
    return Game._firstMatch(Game._shuffle([...Game._getAllGames()]), filterFn);
}

Game.generateForLength = function(length, filterFn) {
    return Game._firstMatch(Game._shuffle([...Game._getAllGamesByLength()[length]]), filterFn);
}

Game.generateForSolution = function(solution) {
    return Game._getAllGamesBySolution().get(solution.toUpperCase())?._createFromTemplate();
}

Game.getRandomTemplate = function() {
    const games = Game._getAllGames();
    const idx = ~~(Math.random() * games.length);
    return games[idx]._createFromTemplate();
}

Game.getRandomTemplateForLength = function(len) {
    const gamesByLength = Game._getAllGamesByLength();
    const idx = ~~(Math.random() * gamesByLength[len].length);
    return gamesByLength[len][idx]._createFromTemplate();
}

Game._checkHint = function(hint, guess) {
    if (guess.length !== hint.size) {
        return Game.SOLUTION_WRONG;
    }
    const result = hint.word.substring(0, hint.offset) + guess + hint.word.substring(hint.offsetEnd());
    Log.write(result, hint.word);
    if (result === hint.word) {
        return Game.SOLUTION_CORRECT;
    }
    if (Words.DICT.has(result)) {
        return Game.SOLUTION_OTHER_WORD;
    }
    return Game.SOLUTION_WRONG;
}

Game._allGames = null;
Game._getAllGames = function() {
    if (!Game._allGames) {
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
        Game._allGames = [];
        for (const [answer, hints] of hintsMap) {
            const game = new Game(hints, answer);
            Game._allGames.push(game);
        }
    }
    return Game._allGames;
}

Game._allGamesByLength = null;
Game._getAllGamesByLength = function() {
    if (!Game._allGamesByLength) {
        Game._allGamesByLength = [];
        for (const game of Game._getAllGames()) {
            let arr = Game._allGamesByLength[game.solution.length];
            if (!arr) {
                arr = [];
                Game._allGamesByLength[game.solution.length] = arr;
            }
            arr.push(game);
        }
    }
    return Game._allGamesByLength;
}

Game._allGamesBySolution = null;
Game._getAllGamesBySolution = function() {
    if (!Game._allGamesBySolution) {
        Game._allGamesBySolution = new Map();
        for (const game of Game._getAllGames()) {
            Game._allGamesBySolution.set(game.solution, game);
        }
    }
    return Game._allGamesBySolution;
}

Game._shuffle = function(arr) {
    for (let i = arr.length - 1; i > 0; --i) {
        let j = ~~(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

Game._firstMatch = function(games, filterFn) {
    for (const gameTemplate of games) {
        let g = gameTemplate._createFromTemplate();
        if (!filterFn || filterFn(g)) {
            return g;
        }
    }
    return null;
}

Game.serializer = new Serializer(
    Game,
    Hint,
);
