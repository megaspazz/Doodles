class Game {
	constructor(prefix, middle, suffix) {
		this.prefix = prefix;
		this.middle = middle;
		this.suffix = suffix;
		
		this.prefixFreq = Game.#makeFreq(prefix);
		this.suffixFreq = Game.#makeFreq(suffix);
		
		this.prefixCircle = new WordCircle(prefix);
		this.suffixCircle = new WordCircle(suffix);
		this.solutions = [];
		WORDS_LIST.forEach(w => {
			let middleIndex = this.validate(w);
			if (middleIndex >= 0) {
				let words = this.solutions[w.length];
				if (!words) {
					words = new Map();
					this.solutions[w.length] = words;
				}
				//console.log(w, this.validate(w));
				let wPrefix = w.substring(0, middleIndex);
				let wSuffix = w.substring(middleIndex + 1);
				let prefixCircles = this.prefixCircle.addSolution(wPrefix);
				let suffixCircles = this.suffixCircle.addSolution(wSuffix);
				words.set(w, new Solution(w, middleIndex, Solution.NOT_FOUND, prefixCircles, suffixCircles));
			}
		});
	}
	
	checkAndUpdate(word) {
		let solution = this.solutions[word.length]?.get(word);
		if (!solution || solution.state != Solution.NOT_FOUND) {
			log("loser: " + word);
			return false;
		}
		solution.state = Solution.FOUND;
		log("yo");
		log(solution.prefixCircles.concat(solution.suffixCircles));
		for (const letterCircle of solution.prefixCircles.concat(solution.suffixCircles)) {
			++letterCircle.currFreq;
			console.log(letterCircle);
		}
		log("winner: " + word, solution);
		return true;
	}
	
	validate(word) {
		for (let i = 1; i + 1 < word.length; ++i) {
			//console.log(word, i, word[i], word[i] == this.middle, Game.#validatePart(this.prefixFreq, word.substring(0, i)), Game.#validatePart(this.suffixFreq, word.substring(i + 1)))
			if (word[i] == this.middle && Game.#validatePart(this.prefixFreq, word.substring(0, i)) && Game.#validatePart(this.suffixFreq, word.substring(i + 1))) {
				return i;
			}
		}
		return -1;
	}
	
	static generate(prefixSize, suffixSize) {
		while (true) {
			let maxSize = prefixSize + 1 + suffixSize;
			let minSize = ~~(Game.#sizeFactor * maxSize);
			let validWords = WORDS_LIST.filter(w => {
				return minSize <= w.length && w.length <= maxSize;
			});
			let anchorIndex = ~~(Math.random() * validWords.length);
			let anchor = validWords[anchorIndex];
			let middleIndexLower = Math.max(1, anchor.length - suffixSize - 1);
			let middleIndexUpper = Math.min(prefixSize + 1, anchor.length - 1);
			let middleIndex = middleIndexLower + ~~(Math.random() * (middleIndexUpper - middleIndexLower));
			let middle = anchor[middleIndex];
			let anchorPrefix = anchor.substring(0, middleIndex);
			let anchorSuffix = anchor.substring(middleIndex + 1);
			let prefixRemaining = prefixSize - anchorPrefix.length;
			let suffixRemaining = suffixSize - anchorSuffix.length;
			let prefixFreq = Game.#makeFreq(anchorPrefix);
			let suffixFreq = Game.#makeFreq(anchorSuffix);
			for (const word of Game.#shuffle([...Game.#wordsList])) {
				let middleIndices = [];
				for (let i = 1; i + 1 < word.length; ++i) {
					if (word[i] == middle) {
						middleIndices.push(i);
					}
				}
				if (middleIndices.length == 0) {
					continue;
				}
				Game.#shuffle(middleIndices);
				for (let i of Game.#shuffle(middleIndices)) {
					let prefixDiff = Game.#getDiff(prefixFreq, word.substring(0, i));
					let suffixDiff = Game.#getDiff(suffixFreq, word.substring(i + 1));
					log("i = " + i, anchor, middle, word, prefixDiff, suffixDiff);
					if (prefixDiff.length <= prefixRemaining && suffixDiff <= suffixRemaining) {
						Game.#updateFreq(prefixFreq, prefixDiff);
						Game.#updateFreq(suffixFreq, suffixDiff);
						prefixRemaining -= prefixDiff.length;
						suffixRemaining -= suffixDiff.length;
						break;
					}
				}
				log(anchor, middle, word, prefixFreq, prefixRemaining, suffixFreq, suffixRemaining);
			}
			log(anchor, middle, prefixFreq, prefixRemaining, suffixFreq, suffixRemaining);
			if (prefixRemaining == 0 && suffixRemaining == 0) {
				let prefix = Game.#shuffle(Game.#freqToArray(prefixFreq)).join("");
				let suffix = Game.#shuffle(Game.#freqToArray(suffixFreq)).join("");
				return new Game(prefix, middle, suffix);
			}
		}
		
		//log(anchor, middleIndexLower, middleIndexUpper, middleIndex, prefixArr, suffixArr);
		
		/*
		let prefix = Game.#randomLetters(prefixSize).join("");
		let middle = Game.#randomLetter();
		let suffix = Game.#randomLetters(suffixSize).join("");
		return new Game(prefix, middle, suffix);
		*/
	}
	
	static #wordsList = WORDS_LIST;
	static #wordsDict = WORDS_DICT;
	
	static #sizeFactor = 0.75;
	
	static #makeFreq(word) {
		return Game.#updateFreq({}, word);
	}
	
	static #updateFreq(freq, word) {
		[...word].forEach(c => {
			freq[c] = ~~freq[c] + 1;
		});
		return freq;
	}
	
	static #validatePart(freq, part) {
		let partFreq = Game.#makeFreq(part);
		for (let [c, count] of Object.entries(partFreq)) {
			if (count > ~~freq[c]) {
				return false;
			}
		}
		return true;
	}
	
	static #randomLetter() {
		let i = ~~(Math.random() * Game.#wordsList.length);
		let word = Game.#wordsList[i];
		let j = ~~(Math.random() * word.length);
		return word[j];
	}
	
	static #randomLetters(num) {
		let arr = [];
		for (let i = 0; i < num; ++i) {
			arr[i] = Game.#randomLetter();
		}
		return arr;
	}
	
	static #getDiff(freq, word) {
		let diff = [];
		let wordFreq = Game.#makeFreq(word);
		for (const [c, count] of Object.entries(wordFreq)) {
			let need = Math.max(0, count - ~~freq[c]);
			for (let i = 0; i < need; ++i) {
				diff.push(c);
			}
		}
		return diff.join("");
	}
	
	static #shuffle(arr) {
		for (let i = arr.length - 1; i > 0; --i) {
			let j = ~~(Math.random() * (i + 1));
			//[[arr[i], arr[j]] = [[arr[j], arr[i]];
			let tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}
		return arr;
	}
	
	static #freqToArray(freq) {
		let arr = [];
		for (const [c, count] of Object.entries(freq)) {
			for (let i = 0; i < count; ++i) {
				arr.push(c);
			}
		}
		return arr;
	}
}
