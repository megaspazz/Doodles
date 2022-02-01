class WordCircle {
	constructor(word) {
		this.word = word;
		
		this.letterCircles = {};
		[...word].forEach(c => {
			this.#addLetterCircle(new LetterCircle(c, 0));
		});
	}
	
	addSolution(word) {
		let solutionCircles = [];
		let indexByChar = {};
		// TODO: randomize order for duplicate letters for incrementing maxFreq.
		[...word].forEach(c => {
			let index = ~~indexByChar[c];
			let letterCircle = this.letterCircles[c][index];
			letterCircle.incrementMaxFreq();
			solutionCircles.push(letterCircle);
			indexByChar[c] = index + 1;
		});
		return solutionCircles;
	}
	
	flattenedLetterCircles() {
		return [].concat(...Object.values(this.letterCircles));
	}
	
	#addLetterCircle(letterCircle) {
		let arr = this.letterCircles[letterCircle.letter];
		if (!arr) {
			arr = [];
			this.letterCircles[letterCircle.letter] = arr;
		}
		arr.push(letterCircle);
	}
}
