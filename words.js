class Words {
    static LIST = [
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

    static DICT = new Map();
    static {
        Words.LIST.forEach(word => {
            Words.DICT.set(word, true);
        });
    }
}
