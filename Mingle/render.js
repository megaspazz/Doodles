class Render {
    constructor(divHints, divWinBanner, divResult) {
        this.divHints = divHints;
        this.divWinBanner = divWinBanner;
        this.divResult = divResult;
    }

    drawHints(game) {
        const [before, after] = Render._computeSpacing(game.hints);
        const width = before + game.solution.length + after;
        const emptyRow = Render._empty.repeat(width);
        let buf = [];
        for (let i = 0; i < game.hintsUsed; ++i) {
            const bufOffset = before - game.hints[i].offset;
            buf[i] = Array.from(emptyRow);
            for (let j = 0; j < game.hints[i].word.length; ++j) {
                let c = game.hints[i].word[j];
                if (j >= game.hints[i].offset && j < game.hints[i].offsetEnd()) {
                    c = Render._blank;
                }
                buf[i][j + bufOffset] = c;
            }
        }
        Log.write(before, after);
        Log.write(buf);
        divHints.innerHTML = buf.map(row => row.join(Render._empty)).join("\n\n");
    }

    drawResult(game, guess) {
        if (guess === game.solution) {
            this.divWinBanner.innerHTML = "YOU WIN!\n" + Render._pointingDownEmoji + " Share with your friends " + Render._pointingDownEmoji;
        } else {
            this.divWinBanner.innerHTML = "ur a loser haha\nthe answer was actually " + game.solution  + "\n" + Render._pointingDownEmoji + " tell ur \"friends\" below " + Render._pointingDownEmoji;
        }

        const results = game.checkSolution(guess);
        const usedHints = game.hints.slice(0, game.hintsUsed);
        const [before, after] = Render._computeSpacing(usedHints);
        const width = before + game.solution.length + after;
        const emptyRow = Render._paddingEmoji.repeat(width);
        let buf = usedHints.map((hint, i) => {
            let row = Array.from(emptyRow);
            const bufOffset = before - hint.offset;
            for (let j = 0; j < hint.word.length; ++j) {
                let c = Render._wordPartEmoji;
                if (j >= game.hints[i].offset && j < game.hints[i].offsetEnd()) {
                    c = Render._resultToEmoji.get(results[i]);
                }
                row[j + bufOffset] = c;
            }
            return row;
        });
        Log.write(buf);
        this.divResult.innerHTML = buf.map(row => row.join("")).join("\n");
    }

    static _computeSpacing(hints) {
        let before = 0;
        let after = 0;
        for (const hint of hints) {
            before = Math.max(before, hint.offset);
            after = Math.max(after, hint.word.length - hint.offset - hint.size);
        }
        return [before, after];
    }

    static _empty = " ";
    static _blank = "_";

    static _whiteSquareEmoji = "\u2B1C";
    static _blackSquareEmoji = "\u2B1B";
    static _redSquareEmoji = String.fromCodePoint(0x1F7E5);
    static _yellowSquareEmoji = String.fromCodePoint(0x1F7E8);
    static _greenSquareEmoji = String.fromCodePoint(0x1F7E9);
    static _pointingDownEmoji = String.fromCodePoint(0x1F447);

    static _paddingEmoji = Render._blackSquareEmoji;
    static _wordPartEmoji = Render._whiteSquareEmoji;
    static _resultToEmoji = new Map();
    static {
        Render._resultToEmoji.set(Game.SOLUTION_WRONG, Render._redSquareEmoji);
        Render._resultToEmoji.set(Game.SOLUTION_OTHER_WORD, Render._yellowSquareEmoji);
        Render._resultToEmoji.set(Game.SOLUTION_CORRECT, Render._greenSquareEmoji);
    }
}
