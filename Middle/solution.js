class Solution {
	static NOT_EXIST = 0;
	static NOT_FOUND = 1;
	static FOUND = 2;
	
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
