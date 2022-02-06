class Log {
    static #DEBUG = false;

    static write() {
        if (Log.#DEBUG) {
            console.log(...arguments)
        }
    }
}