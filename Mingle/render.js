class Render {
    constructor(divHints, divWinBanner, divResult) {
        this.divHints = divHints;
        this.divWinBanner = divWinBanner;
        this.divResult = divResult;
    }

    drawHints(game, optionalGuess) {
        const guess = optionalGuess || "";

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
            const guessOffset = bufOffset + game.hints[i].offset;
            for (const [j, c] of [...guess.substring(0, game.solution.length).toUpperCase()].entries()) {
                buf[i][j + guessOffset] = c;
            }
        }
        divHints.innerHTML = buf.map(row => {
            let divRow = document.createElement("div");
            divRow.margin = "2px";
            let spansForLetters = row.map((c, i) => {
                let spanLetter = document.createElement("span");
                if (before <= i && i < before + game.solution.length) {
                    spanLetter.style.backgroundColor = "LightCyan";
                    spanLetter.style.borderStyle = "solid";
                }
                spanLetter.style.display = "inline-block";
                spanLetter.style.borderWidth = "1px";
                spanLetter.style.padding = "4px";
                spanLetter.style.margin = "4px";
                spanLetter.innerHTML = c;
                return spanLetter;
            });
            for (const spanLetter of spansForLetters) {
                divRow.appendChild(spanLetter);
            }
            return divRow.outerHTML;
        }).join("");
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

    clearResult() {
        this.divWinBanner.innerHTML = "";
        this.divResult.innerHTML = "";
    }
}

Render._computeSpacing = function(hints) {
    let before = 0;
    let after = 0;
    for (const hint of hints) {
        before = Math.max(before, hint.offset);
        after = Math.max(after, hint.word.length - hint.offset - hint.size);
    }
    return [before, after];
}

Render._empty = " ";
Render._blank = "_";

Render._whiteSquareEmoji = "\u2B1C";
Render._blackSquareEmoji = "\u2B1B";
Render._redSquareEmoji = String.fromCodePoint(0x1F7E5);
Render._yellowSquareEmoji = String.fromCodePoint(0x1F7E8);
Render._greenSquareEmoji = String.fromCodePoint(0x1F7E9);
Render._pointingDownEmoji = String.fromCodePoint(0x1F447);

Render._paddingEmoji = Render._blackSquareEmoji;
Render._wordPartEmoji = Render._whiteSquareEmoji;

Render._resultToEmoji = new Map([
    [Game.SOLUTION_WRONG, Render._redSquareEmoji],
    [Game.SOLUTION_OTHER_WORD, Render._yellowSquareEmoji],
    [Game.SOLUTION_CORRECT, Render._greenSquareEmoji],
]);
