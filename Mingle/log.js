class Log {
    static #DEBUG = true;

    static write() {
        if (Log.#DEBUG) {
            console.log(...arguments)
        }
    }
}