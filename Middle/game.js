class Game {
	constructor(prefix, middle, suffix) {
		this.prefix = prefix || "";
		this.middle = middle || "";
		this.suffix = suffix || "";
		
		this.prefixFreq = Game._makeFreq(this.prefix);
		this.suffixFreq = Game._makeFreq(this.suffix);
		
		this.prefixCircle = new WordCircle(this.prefix);
		this.suffixCircle = new WordCircle(this.suffix);

		this.prefixCircleOrder = Game._shuffle(Game._range(0, this.prefixCircle.letterCircles.length));
		this.suffixCircleOrder = Game._shuffle(Game._range(0, this.suffixCircle.letterCircles.length));

		this.solutions = [];
		WORDS_LIST.forEach(w => {
			let middleIndex = this.validate(w);
			if (middleIndex >= 0) {
				let words = this.solutions[w.length];
				if (!words) {
					words = new Map();
					this.solutions[w.length] = words;
				}
				let wPrefix = w.substring(0, middleIndex);
				let wSuffix = w.substring(middleIndex + 1);
				let prefixCircleIndices = this.prefixCircle.addSolution(wPrefix);
				let suffixCircleIndices = this.suffixCircle.addSolution(wSuffix);
				words.set(w, new Solution(w, middleIndex, Solution.NOT_FOUND, prefixCircleIndices, suffixCircleIndices));
			}
		});
	}
	
	getStateAndUpdate(word) {
		let solution = this.solutions[word.length]?.get(word);
		if (!solution) {
			return Solution.NOT_EXIST;
		}
		if (solution.state == Solution.FOUND) {
			log("loser: " + word);
			return Solution.FOUND;
		}
		solution.state = Solution.FOUND;
		log("yo");
		let prefixCircles = Game._getCircles(this.prefixCircle, solution.prefixCircleIndices);
		let suffixCircles = Game._getCircles(this.suffixCircle, solution.suffixCircleIndices);
		log(prefixCircles.concat(suffixCircles));
		for (const letterCircle of prefixCircles.concat(suffixCircles)) {
			++letterCircle.currFreq;
			log(letterCircle);
		}
		log("winner: " + word, solution);
		return Solution.NOT_FOUND;
	}
	
	validate(word) {
		for (let i = 1; i + 1 < word.length; ++i) {
			if (word[i] == this.middle && Game._validatePart(this.prefixFreq, word.substring(0, i)) && Game._validatePart(this.suffixFreq, word.substring(i + 1))) {
				return i;
			}
		}
		return -1;
	}

	getPrefixLetterCirclesInSetOrder() {
		return Game._getInSetOrder(this.prefixCircle.letterCircles, this.prefixCircleOrder);
	}

	getSuffixLetterCirclesInSetOrder() {
		return Game._getInSetOrder(this.suffixCircle.letterCircles, this.suffixCircleOrder);
	}
}
	
Game._wordsList = WORDS_LIST;
Game._wordsDict = WORDS_DICT;

Game._sizeFactor = 0.75;
	
Game.generate = function(prefixSize, suffixSize) {
	while (true) {
		let maxSize = prefixSize + 1 + suffixSize;
		let minSize = ~~(Game._sizeFactor * maxSize);
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
		let prefixFreq = Game._makeFreq(anchorPrefix);
		let suffixFreq = Game._makeFreq(anchorSuffix);
		for (const word of Game._shuffle([...Game._wordsList])) {
			let middleIndices = [];
			for (let i = 1; i + 1 < word.length; ++i) {
				if (word[i] == middle) {
					middleIndices.push(i);
				}
			}
			if (middleIndices.length == 0) {
				continue;
			}
			Game._shuffle(middleIndices);
			for (let i of Game._shuffle(middleIndices)) {
				let prefixDiff = Game._getDiff(prefixFreq, word.substring(0, i));
				let suffixDiff = Game._getDiff(suffixFreq, word.substring(i + 1));
				log("i = " + i, anchor, middle, word, prefixDiff, suffixDiff);
				if (prefixDiff.length <= prefixRemaining && suffixDiff <= suffixRemaining) {
					Game._updateFreq(prefixFreq, prefixDiff);
					Game._updateFreq(suffixFreq, suffixDiff);
					prefixRemaining -= prefixDiff.length;
					suffixRemaining -= suffixDiff.length;
					break;
				}
			}
			log(anchor, middle, word, prefixFreq, prefixRemaining, suffixFreq, suffixRemaining);
		}
		log(anchor, middle, prefixFreq, prefixRemaining, suffixFreq, suffixRemaining);
		if (prefixRemaining == 0 && suffixRemaining == 0) {
			let prefix = Game._shuffle(Game._freqToArray(prefixFreq)).join("");
			let suffix = Game._shuffle(Game._freqToArray(suffixFreq)).join("");
			return new Game(prefix, middle, suffix);
		}
	}
}

Game.serializer = new Serializer();
Game.serializer.addType(Game);
Game.serializer.addType(LetterCircle);
Game.serializer.addType(Solution);
Game.serializer.addType(WordCircle);
Game.serializer.addType(
	Map,
	(_, v) => [...v],
	(_, data) => new Map(data),
);

Game._makeFreq = function(word) {
	return Game._updateFreq({}, word);
}

Game._updateFreq = function(freq, word) {
	[...word].forEach(c => {
		freq[c] = ~~freq[c] + 1;
	});
	return freq;
}

Game._validatePart = function(freq, part) {
	let partFreq = Game._makeFreq(part);
	for (let [c, count] of Object.entries(partFreq)) {
		if (count > ~~freq[c]) {
			return false;
		}
	}
	return true;
}

Game._randomLetter = function() {
	let i = ~~(Math.random() * Game._wordsList.length);
	let word = Game._wordsList[i];
	let j = ~~(Math.random() * word.length);
	return word[j];
}

Game._randomLetters = function(num) {
	let arr = [];
	for (let i = 0; i < num; ++i) {
		arr[i] = Game._randomLetter();
	}
	return arr;
}

Game._getDiff = function(freq, word) {
	let diff = [];
	let wordFreq = Game._makeFreq(word);
	for (const [c, count] of Object.entries(wordFreq)) {
		let need = Math.max(0, count - ~~freq[c]);
		for (let i = 0; i < need; ++i) {
			diff.push(c);
		}
	}
	return diff.join("");
}

Game._shuffle = function(arr) {
	for (let i = arr.length - 1; i > 0; --i) {
		let j = ~~(Math.random() * (i + 1));
		let tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
	return arr;
}

Game._freqToArray = function(freq) {
	let arr = [];
	for (const [c, count] of Object.entries(freq)) {
		for (let i = 0; i < count; ++i) {
			arr.push(c);
		}
	}
	return arr;
}

Game._SERIALIZE_TYPE_MAP = "MAP";

Game._range = function(low, high) {
	let arr = [];
	for (let i = low; i < high; ++i) {
		arr.push(i);
	}
	return arr;
}

Game._getCircles = function(circle, indices) {
	return indices.map(i => circle.letterCircles[i]);
}

Game._getInSetOrder = function(arr, indices) {
	return indices.map(i => arr[i]);
}
