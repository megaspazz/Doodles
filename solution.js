class Solution {
	constructor(word, middleIndex, state, prefixCircles, suffixCircles) {
		this.word = word;
		this.middleIndex = middleIndex;
		this.state = state;
		this.prefixCircles = prefixCircles;
		this.suffixCircles = suffixCircles;
	}
	
	prefix() {
		return this.word.substring(0, middleIndex);
	}
	
	suffix() {
		return this.word.substring(middleIndex + 1);
	}
}

Solution.NOT_EXIST = 0;
Solution.NOT_FOUND = 1;
Solution.FOUND = 2;
