class WordCircle {
	constructor(word) {
		this.word = word || "";
		
		this.letterCircles = [];
		this.letterCircleIndicesByLetter = {};
		
		[...this.word].forEach(c => {
			this._addLetterCircle(new LetterCircle(c, 0));
		});
	}
	
	addSolution(word) {
		let solutionCircleIndices = [];
		let indexByChar = {};
		// TODO: randomize order for duplicate letters for incrementing maxFreq.
		[...word].forEach(c => {
			let index = ~~indexByChar[c];
			let letterCircleIndex = this.letterCircleIndicesByLetter[c][index];
			let letterCircle = this.letterCircles[letterCircleIndex];
			letterCircle.incrementMaxFreq();
			solutionCircleIndices.push(letterCircleIndex);
			indexByChar[c] = index + 1;
		});
		return solutionCircleIndices;
	}
	
	_addLetterCircle(letterCircle) {
		const index = this.letterCircles.length;
		this.letterCircles.push(letterCircle);
		
		let arr = this.letterCircleIndicesByLetter[letterCircle.letter];
		if (!arr) {
			arr = [];
			this.letterCircleIndicesByLetter[letterCircle.letter] = arr;
		}
		arr.push(index);
	}
}
