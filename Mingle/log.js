class Log {
}

Log._CONSOLE = false;
Log._DOCUMENT = false;

Log.divOutput = null;

Log.write = function() {
    if (Log._CONSOLE) {
        console.log(...arguments)
    }

    if (Log._DOCUMENT) {
        if (!Log.divOutput) {
            Log.divOutput = document.createElement("div");
            Log.divOutput.style.fontFamily = "monospace";
            document.getElementsByTagName("body")[0].appendChild(Log.divOutput);
        }
        let divLine = document.createElement("div");
        divLine.innerText = "[ " + new Date(Date.now()).toLocaleString() + " ]\n" + [...arguments].join("\n");
        divLine.style.margin = "6px";
        Log.divOutput.appendChild(divLine);
    }
}
