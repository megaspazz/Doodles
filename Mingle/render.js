class Render {
    constructor(divHints) {
        this.divHints = divHints;
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
                if (j >= game.hints[i].offset && j < game.hints[i].offset + game.hints[i].size) {
                    c = "_";
                }
                buf[i][j + bufOffset] = c;
            }
        }
        Log.write(before, after);
        Log.write(buf);
        this.divHints.innerHTML = "";
        let pre = document.createElement("pre");
        pre.innerHTML = buf.map(row => row.join(Render.#empty)).join("\n\n");
        this.divHints.appendChild(pre);
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
}
