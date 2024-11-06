export class WordGenerator {
    private static commonWords: string[] = [
        "function", "const", "let", "var", "class", 
        "interface", "type", "enum", "return", "if",
        "else", "for", "while", "do", "break", 
        "continue", "switch", "case", "default", "try",
        "catch", "finally", "throw", "new", "this",
        "super", "extends", "implements", "static", "public",
        "private", "protected", "void", "null", "undefined"
    ];

    static generateWords(count: number): string {
        const words: string[] = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * this.commonWords.length);
            words.push(this.commonWords[randomIndex]);
        }
        return words.join(' ');
    }
} 