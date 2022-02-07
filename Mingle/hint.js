class Hint {
    constructor(word, offset, size) {
        this.word = word;
        this.offset = offset;
        this.size = size;
    }

    offsetEnd() {
        return this.offset + this.size;
    }
}

console.log("hint.js loaded");
