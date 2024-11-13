import { generate } from 'random-words';

export class WordGenerator {
    private static wordList: string[] = generate({ exactly: 1000 }) as string[];

    static generateWords(count: number): string {
        const selectedWords: string[] = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * this.wordList.length);
            selectedWords.push(this.wordList[randomIndex]);
        }
        return selectedWords.join(' ');
    }
} 