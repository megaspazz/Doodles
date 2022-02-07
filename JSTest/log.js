function log() {
    let divLine = document.createElement("div");
    divLine.innerText = "[ " + new Date(Date.now()).toLocaleString() + " ]\n" + [...arguments].join("\n");
    divLine.style.padding = "6px";
    document.getElementsByTagName("body")[0].appendChild(divLine);
}

class Log {
    static #CONSOLE = false;
    static #DOCUMENT = false;

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
