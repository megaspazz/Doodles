class Log {
    static #CONSOLE = true;
    static #DOCUMENT = true;

    static write() {
        if (Log.#CONSOLE) {
            console.log(...arguments)
        }

        if (Log.#DOCUMENT) {
            if (!Log.divOutput) {
                Log.divOutput = document.createElement("div");
                Log.divOutput.style.fontFamily = "monospace";
                document.getElementsByTagName("body")[0].appendChild(Log.divOutput);
            }
            let divLine = document.createElement("div");
            divLine.innerText = "[ " + new Date(Date.now()).toLocaleString() + " ]\n" + [...arguments].join("\n");
            Log.divOutput.appendChild(divLine);
        }
    }
}
