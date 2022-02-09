class Flasher {
    constructor() {
        this.elementOriginalColors = new Map([...arguments].map(element => [element, null]));
        this.flashOnceTimeoutID = 0;
    }
    
    flashOnce(color, duration) {
        if (this.flashOnceTimeoutID) {
            clearTimeout(this.flashOnceTimeoutID);
        } else {
            for (const element of this.elementOriginalColors.keys()) {
                console.log(element);
                this.elementOriginalColors[element] = element.style.backgroundColor;
            }
        }
        for (const element of this.elementOriginalColors.keys()) {
            element.style.backgroundColor = color;
        }
        this.flashOnceTimeoutID = setTimeout(() => {
            this.endFlashOnce();
        }, duration);
    }

    endFlashOnce() {
        if (this.flashOnceTimeoutID) {
            this.flashOnceTimeoutID = 0;
            for (const [element, originalColor] of this.elementOriginalColors) {
                element.style.backgroundColor = originalColor;
            }
        }
    }

    _restoreOriginalColors() {
    }
}
