class Render {
    constructor(svgGame) {
        this.svgGame = svgGame;
    }
    
    updateGame(game) {
        this.updateCircles(game);
        this.updateWords(game);
    }
    
    updateCircles(game) {
        log(game);
        this.svgGame.innerHTML = "";
        this._drawCircle(game.getPrefixLetterCirclesInSetOrder(), WIDTH / 2 - RADIUS, HEIGHT / 2, RADIUS, 2 * Math.PI / (game.prefix.length + 1), 2 * Math.PI / (game.prefix.length + 1));
        this._drawCircle(game.getSuffixLetterCirclesInSetOrder(), WIDTH / 2 + RADIUS, HEIGHT / 2, RADIUS, Math.PI + 2 * Math.PI / (game.suffix.length + 1), 2 * Math.PI / (game.suffix.length + 1));
        let middleLetterCircle = createSVGElement("circle", {
            "cx": WIDTH / 2,
            "cy": HEIGHT / 2,
            "r": LETTER_RADIUS + MIDDLE_BORDER_SIZE / 2,
            "style": style({
                "fill": "DeepSkyBlue",
                "stroke": "DodgerBlue",
                "stroke-width": MIDDLE_BORDER_SIZE,
            }),
        });
        let middleLetterText = createSVGElement("text", {
            "x": WIDTH / 2,
            "y": HEIGHT / 2,
            "font-size": FONT_SIZE,
            "font-family": FONT_FAMILY,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
        }, game.middle);
        svgGame.appendChild(middleLetterCircle);
        svgGame.appendChild(middleLetterText);
    }

    updateWords(game) {
        let divWords = document.getElementById("divWords");
        divWords.innerHTML = "";
        for (const [len, solutionsForLen] of game.solutions.entries()) {
            if (!solutionsForLen) {
                continue;
            }
            let div = document.createElement("div");
            let header = document.createElement("h2");
            let ol = document.createElement("ol");
            let wordsRemaining = 0;
            solutionsForLen.forEach((solution) => {
                let li = document.createElement("li");
                switch (solution.state) {
                    case Solution.NOT_FOUND: {
                        li.innerHTML = "?".repeat(len);
                        ++wordsRemaining;
                        break;
                    }
                    case Solution.FOUND: {
                        li.innerHTML = solution.word;
                        log(solution);
                        break;
                    }
                }
                ol.appendChild(li);
            });
            header.innerHTML = len + "-letter words (" + wordsRemaining + " remaining)";
            div.appendChild(header);
            div.appendChild(ol);
            divWords.appendChild(div);
        };
    }
    
    _drawCircle(letterCircles, x0, y0, radius, startRads, deltaRads) {
        let outerCircle = createSVGElement("circle", {
            "cx": x0,
            "cy": y0,
            "r": radius,
            "style": style({
                "fill": "LightSkyBlue",
            }),
        });
        this.svgGame.prepend(outerCircle);
        for (const [i, letterCircle] of letterCircles.entries()) {
            let x = x0 + radius * Math.cos(startRads + i * deltaRads);
            let y = y0 + radius * Math.sin(startRads + i * deltaRads);
            let letter = letterCircle.letter;
            log(i, letter, letterCircle, x0, y0, radius, startRads, deltaRads);
            let rgb = Render._colorFor(letterCircle);
            let borderWidth = 0;
            // TODO: refactor into function
            if (letterCircle.isCompleted()) {
                borderWidth = Render._borderWidth;
            }
            let letterCircleElement = createSVGElement("circle", {
                "cx": x,
                "cy": y,
                "r": LETTER_RADIUS + borderWidth / 2,
                "style": style({
                    "fill": "rgb(" + rgb.join(", ") + ")",
                    "stroke": "rgb(" + Render._borderColor.join(", ") + ")",
                    "stroke-width": borderWidth,
                }),
            });
            let letterTextElement = createSVGElement("text", {
                "x": x,
                "y": y,
                "font-size": FONT_SIZE,
                "font-family": FONT_FAMILY,
                "text-anchor": "middle",
                "dominant-baseline": "middle",
            }, letter);
            this.svgGame.appendChild(letterCircleElement);
            this.svgGame.appendChild(letterTextElement);
        }
    }
}

Render._colorFor = function(letterCircle) {
    let percentile = letterCircle.completionProgress();
    let r = ~~Render._rangePercentile(Render._startR, Render._endR, percentile);
    let g = ~~Render._rangePercentile(Render._startG, Render._endG, percentile);
    let b = ~~Render._rangePercentile(Render._startB, Render._endB, percentile);
    return [r, g, b];
}

Render._rangePercentile = function(low, high, percentile) {
    return low + (high - low) * percentile;
}

/*
Render._startR = 219;
Render._startG = 112;
Render._startB = 147;

Render._endR = 152;
Render._endG = 251;
Render._endB = 152;
*/

Render._startR = 223;
Render._startG = 223;
Render._startB = 223;

Render._endR = 152;
Render._endG = 251;
Render._endB = 152;

Render._borderR = 34;
Render._borderG = 139;
Render._borderB = 34;
Render._borderColor = [Render._borderR, Render._borderG, Render._borderB];

Render._borderWidth = 4;
