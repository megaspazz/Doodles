function log() {
    let divLine = document.createElement("div");
    divLine.innerText = "[ " + new Date(Date.now()).toLocaleString() + " ]\n" + [...arguments].join("\n");
    divLine.style.padding = "6px";
    document.getElementsByTagName("body")[0].appendChild(divLine);
}

console.log("this is not a class!");
log("used custom log function");
