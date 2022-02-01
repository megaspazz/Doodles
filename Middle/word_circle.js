class WordCircle {
	constructor(word) {
		this.word = word;
		
		this.letterCircles = [];
		this.letterCirclesByLetter = {};
		
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
			let letterCircle = this.letterCirclesByLetter[c][index];
			letterCircle.incrementMaxFreq();
			solutionCircles.push(letterCircle);
			indexByChar[c] = index + 1;
		});
		return solutionCircles;
	}
	
	#addLetterCircle(letterCircle) {
		this.letterCircles.push(letterCircle);
		
		let arr = this.letterCirclesByLetter[letterCircle.letter];
		if (!arr) {
			arr = [];
			this.letterCirclesByLetter[letterCircle.letter] = arr;
		}
		arr.push(letterCircle);
	}
}
