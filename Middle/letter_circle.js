class LetterCircle {
	constructor(letter, maxFreq) {
		this.letter = letter;
		this.maxFreq = maxFreq;
		this.currFreq = 0;
	}
	
	incrementMaxFreq() {
		++this.maxFreq;
	}
	
	increment() {
		++this.currFreq;
	}
	
	isCompleted() {
		return this.currFreq == this.maxFreq;
	}
	
	completionProgress() {
		return this.currFreq / this.maxFreq;
	}
}
