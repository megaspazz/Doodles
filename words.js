class Words {
    static testStatic(x) {
        return x + x;
    }
    // static LIST = [
    //     "ABA",
    //     "ABANDON",
    //     "ABANDONED",
    //     "ABATEMENT",
    //     "ABBA",
    //     "ABBEY",
    //     "ABBREVIATION",
    //     "ABBREVIATIONS",
    //     "ABDOMINAL",
    //     "ABIDE",
    //     "ABIGAIL",
    //     "ABILITIES",
    //     "ABILITY",
    //     "ABLE",
    // ];

    static testPrivateStatic(x) {
        return Words.#privateStatic(x);
    }

    static #privateStatic(x) {
        return x + " <-|->" + x;
    }

    // static DICT = new Map();
    // static {
    //     for (const word of Words.LIST) {
    //         Words.DICT.set(word, true);
    //     }
    // }
}

Words.LIST = [
    "ABA",
    "ABANDON",
    "ABANDONED",
    "ABATEMENT",
    "ABBA",
    "ABBEY",
    "ABBREVIATION",
    "ABBREVIATIONS",
    "ABDOMINAL",
    "ABIDE",
    "ABIGAIL",
    "ABILITIES",
    "ABILITY",
    "ABLE",
];

// Words.#privateTest = function(x) {
//     return x + x;
// }

WORDS_LIST = [
    "ABA",
    "ABANDON",
    "ABANDONED",
    "ABATEMENT",
    "ABBA",
    "ABBEY",
    "ABBREVIATION",
    "ABBREVIATIONS",
    "ABDOMINAL",
    "ABIDE",
    "ABIGAIL",
    "ABILITIES",
    "ABILITY",
    "ABLE",
];
