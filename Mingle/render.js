class Render {
    constructor(divHints, divWinBanner, divResult) {
        this.divHints = divHints;
        this.divWinBanner = divWinBanner;
        this.divResult = divResult;
    }

    drawHints(game) {
        const [before, after] = Render.#computeSpacing(game.hints);
        const width = before + game.solution.length + after;
        const emptyRow = Render.#empty.repeat(width);
        let buf = [];
        for (let i = 0; i < game.hintsUsed; ++i) {
            const bufOffset = before - game.hints[i].offset;
            buf[i] = Array.from(emptyRow);
            for (let j = 0; j < game.hints[i].word.length; ++j) {
                let c = game.hints[i].word[j];
                if (j >= game.hints[i].offset && j < game.hints[i].offsetEnd()) {
                    c = "_";
                }
                buf[i][j + bufOffset] = c;
            }
        }
        Log.write(before, after);
        Log.write(buf);
        // this.divHints.innerHTML = "";
        // let div = document.createElement("div");
        divHints.innerHTML = buf.map(row => row.join(Render.#empty)).join("\n\n");
        // this.divHints.appendChild(div);
    }

    drawResult(game, guess) {
        if (guess === game.solution) {
            this.divWinBanner.innerHTML = "YOU WIN!\n" + Render.#pointingDownEmoji + " Share with your friends " + Render.#pointingDownEmoji;
        } else {
            this.divWinBanner.innerHTML = "ur a loser haha\nthe answer was actually " + game.solution  + "\n" + Render.#pointingDownEmoji + " tell ur \"friends\" below " + Render.#pointingDownEmoji;
        }

        const results = game.checkSolution(guess);
        const usedHints = game.hints.slice(0, game.hintsUsed);
        const [before, after] = Render.#computeSpacing(usedHints);
        const width = before + game.solution.length + after;
        const emptyRow = Render.#paddingEmoji.repeat(width);
        let buf = usedHints.map((hint, i) => {
            let row = Array.from(emptyRow);
            const bufOffset = before - hint.offset;
            for (let j = 0; j < hint.word.length; ++j) {
                let c = Render.#wordPartEmoji;
                if (j >= game.hints[i].offset && j < game.hints[i].offsetEnd()) {
                    c = Render.#resultToEmoji.get(results[i]);
                }
                row[j + bufOffset] = c;
            }
            return row;
        });
        Log.write(buf);
        this.divResult.innerHTML = buf.map(row => row.join("")).join("\n");
    }

    static #computeSpacing(hints) {
        let before = 0;
        let after = 0;
        for (const hint of hints) {
            before = Math.max(before, hint.offset);
            after = Math.max(after, hint.word.length - hint.offset - hint.size);
        }
        return [before, after];
    }

    static #empty = " ";
    static #blank = "_";

    static #whiteSquareEmoji = "\u2B1C";
    static #blackSquareEmoji = "\u2B1B";
    static #redSquareEmoji = String.fromCodePoint(0x1F7E5);
    static #yellowSquareEmoji = String.fromCodePoint(0x1F7E8);
    static #greenSquareEmoji = String.fromCodePoint(0x1F7E9);
    static #pointingDownEmoji = String.fromCodePoint(0x1F447);

    static #paddingEmoji = Render.#blackSquareEmoji;
    static #wordPartEmoji = Render.#whiteSquareEmoji;
    static #resultToEmoji = new Map();
    static {
        Render.#resultToEmoji.set(Game.SOLUTION_WRONG, Render.#redSquareEmoji);
        Render.#resultToEmoji.set(Game.SOLUTION_OTHER_WORD, Render.#yellowSquareEmoji);
        Render.#resultToEmoji.set(Game.SOLUTION_CORRECT, Render.#greenSquareEmoji);
    }
}
